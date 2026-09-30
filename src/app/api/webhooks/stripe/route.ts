import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { OrderService } from "@/lib/services/order-service";
import { ContentService } from "@/lib/services/content-service";
import { sendInvoiceEmail } from "@/lib/services/email-service";
import { formatSlotLabel, resolveDetergentName } from "@/lib/utils";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" as any });

// In-memory LRU set to ensure idempotent event handling
const PROCESSED_EVENT_IDS = new Set<string>();

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.arrayBuffer();
    event = stripe.webhooks.constructEvent(Buffer.from(rawBody), sig, WEBHOOK_SECRET);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Webhook signature verification failed";
    console.error("[stripe-webhook] signature error:", msg);
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // Idempotency check 1: Event ID already processed
  if (PROCESSED_EVENT_IDS.has(event.id)) {
    return NextResponse.json({ received: true, idempotent: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn("[stripe-webhook] payment failed for intent:", pi.id, pi.last_payment_error?.message);
        // Order remains PENDING_PAYMENT per business rules
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info("[stripe-webhook] checkout session expired:", session.id);
        // Order remains PENDING_PAYMENT
        break;
      }
      default:
        break;
    }

    // Record processed event ID (capped to 1000 items)
    if (PROCESSED_EVENT_IDS.size > 1000) {
      const first = PROCESSED_EVENT_IDS.values().next().value;
      if (first) PROCESSED_EVENT_IDS.delete(first);
    }
    PROCESSED_EVENT_IDS.add(event.id);
  } catch (handlerErr: unknown) {
    const msg = handlerErr instanceof Error ? handlerErr.message : "Webhook handler error";
    console.error("[stripe-webhook] processing error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const { order_id, order_number } = session.metadata || {};
  const identifier = order_number || order_id;
  if (!identifier) {
    throw new Error("checkout.session.completed is missing order metadata.");
  }

  const order = await OrderService.getOrderByNumber(identifier);
  if (!order) {
    throw new Error(`Paid order ${identifier} was not found.`);
  }

  if (order.payment_status === "paid" && order.invoice_email_sent_at) {
    console.info("[stripe-webhook] paid order invoice already sent:", identifier);
    return;
  }

  let finalOrder = order;
  if (order.payment_status !== "paid") {
    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;
    const updatedOrder = await OrderService.markOrderPaid(order.id, {
      stripe_payment_intent_id: paymentIntentId,
      customer_name: session.customer_details?.name || order.customer_name,
      customer_email: session.customer_details?.email || order.customer_email,
      payment_method: "card",
    });
    if (!updatedOrder) throw new Error(`Could not confirm paid order ${identifier}.`);
    finalOrder = updatedOrder;
  }

  // 2. Generate and dispatch official invoice email to customer and admin
  try {
    const planNames: Record<string, string> = {
      per_bag: "By The Bag (13 Gal)",
      per_lb: "By The Pound (lb)",
      package: "Saver Package",
    };

    const fullAddress = [
      finalOrder.street_address,
      finalOrder.apt_unit ? `Apt ${finalOrder.apt_unit}` : "",
      finalOrder.city,
      finalOrder.state,
      finalOrder.zip_code,
    ].filter(Boolean).join(", ") || finalOrder.pickup_address || "Doorstep Address";

    const customerEmail = session.customer_details?.email || finalOrder.customer_email;
    if (!customerEmail) {
      throw new Error(`No customer email is available for paid order ${identifier}.`);
    }

    const settings = await ContentService.getSettings();
    const slotLabel = finalOrder.pickup_slot === "8am-12pm" || finalOrder.pickup_slot === "1pm-6pm"
      ? formatSlotLabel(
          finalOrder.pickup_slot as "8am-12pm" | "1pm-6pm",
          settings.slot1_start || "08:00", settings.slot1_end || "12:00",
          settings.slot2_start || "13:00", settings.slot2_end || "18:00"
        )
      : finalOrder.pickup_slot || "Scheduled Window";

    await sendInvoiceEmail({
      orderNumber: finalOrder.order_number,
      orderDate: finalOrder.created_at,
      paymentMethod: "Credit / Debit Card (Stripe)",
      customerName: session.customer_details?.name || finalOrder.customer_name || "Valued Customer",
      customerEmail,
      pickupDate: finalOrder.pickup_date,
      pickupSlot: slotLabel,
      deliveryDate: finalOrder.delivery_date || "Within 24 Hours",
      planName: planNames[finalOrder.pricing_mode] || finalOrder.pricing_mode,
      quantity: finalOrder.pricing_mode === "per_bag"
        ? `${finalOrder.bag_count} Bag(s)`
        : `${finalOrder.final_weight_lbs || finalOrder.estimated_weight_lbs || 0} lbs`,
      detergent: resolveDetergentName(finalOrder.detergent_id),
      subtotal: Number(finalOrder.subtotal || 0),
      deliveryFee: Number(finalOrder.delivery_fee || 0),
      discountAmount: Number(finalOrder.discount_amount || 0),
      totalAmount: Number(finalOrder.total_amount || 0),
      address: fullAddress,
    });

    await OrderService.markInvoiceEmailSent(finalOrder.id);
    console.info(`[stripe-webhook] Payment captured and invoice emailed for order ${finalOrder.order_number}`);
  } catch (emailErr: unknown) {
    console.error("[stripe-webhook] Invoice email dispatch failed:", emailErr);
    throw emailErr;
  }
}
