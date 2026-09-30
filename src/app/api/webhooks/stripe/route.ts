import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { OrderService } from "@/lib/services/order-service";
import { ContentService } from "@/lib/services/content-service";
import { sendInvoiceEmail } from "@/lib/services/email-service";
import { formatSlotLabel } from "@/lib/utils";

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY!;
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: "2024-12-18.acacia" as any });

// Stripe requires the raw body — disable Next.js body parsing
export const config = { api: { bodyParser: false } };

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

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "payment_intent.payment_failed": {
        const pi = event.data.object as Stripe.PaymentIntent;
        console.warn("[stripe-webhook] payment failed:", pi.id, pi.last_payment_error?.message);
        break;
      }
      default:
        // Unhandled event type — acknowledge receipt
        break;
    }
  } catch (handlerErr: unknown) {
    const msg = handlerErr instanceof Error ? handlerErr.message : "Webhook handler error";
    console.error("[stripe-webhook] handler error:", msg);
    // Return 200 so Stripe doesn't retry — log internally instead
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const { order_id, order_number } = session.metadata || {};
  const identifier = order_number || order_id;
  if (!identifier) {
    console.warn("[stripe-webhook] checkout.session.completed missing order metadata");
    return;
  }

  // 1. Confirm order in DB
  let order = await OrderService.getOrderByNumber(identifier);
  if (!order) {
    console.warn("[stripe-webhook] order not found:", identifier);
    return;
  }

  await OrderService.updateOrderStatus(order.id, "confirmed");

  // Refresh order after update
  order = (await OrderService.getOrderByNumber(identifier)) || order;

  // 2. Send invoice email to customer + admin
  try {
    const planNames: Record<string, string> = {
      per_bag: "By The Bag (13 Gal)",
      per_lb: "By The Pound (lb)",
      package: "Saver Package",
    };

    const fullAddress = [
      order.street_address,
      order.apt_unit ? `Apt ${order.apt_unit}` : "",
      order.city,
      order.state,
      order.zip_code,
    ].filter(Boolean).join(", ") || order.pickup_address || "";

    const customerEmail = session.customer_details?.email || order.customer_email;
    if (!customerEmail) {
      console.warn("[stripe-webhook] no customer email — skipping invoice email for", identifier);
      return;
    }

    const settings = await ContentService.getSettings().catch(() => ({} as any));
    const s = settings as any;
    const slotLabel = order.pickup_slot === "8am-12pm" || order.pickup_slot === "1pm-6pm"
      ? formatSlotLabel(
          order.pickup_slot as "8am-12pm" | "1pm-6pm",
          s.slot1_start || "08:00", s.slot1_end || "12:00",
          s.slot2_start || "13:00", s.slot2_end || "18:00"
        )
      : order.pickup_slot || "Scheduled Window";

    await sendInvoiceEmail({
      orderNumber: order.order_number,
      customerName: session.customer_details?.name || order.customer_name || "Valued Customer",
      customerEmail,
      pickupDate: order.pickup_date,
      pickupSlot: slotLabel,
      deliveryDate: order.delivery_date || "Within 24 Hours",
      planName: planNames[order.pricing_mode] || order.pricing_mode,
      quantity: order.pricing_mode === "per_bag"
        ? `${order.bag_count} Bag(s)`
        : `${order.final_weight_lbs || order.estimated_weight_lbs || 0} lbs`,
      detergent: order.detergent_id || "Standard",
      subtotal: Number(order.subtotal || 0),
      deliveryFee: Number(order.delivery_fee || 0),
      discountAmount: Number(order.discount_amount || 0),
      totalAmount: Number(order.total_amount || 0),
      address: fullAddress,
    });

    console.info("[stripe-webhook] invoice emailed for", identifier, "→", customerEmail);
  } catch (emailErr: unknown) {
    const msg = emailErr instanceof Error ? emailErr.message : "Email error";
    console.error("[stripe-webhook] invoice email failed:", msg);
    // Don't throw — order is already confirmed; email failure is recoverable
  }
}
