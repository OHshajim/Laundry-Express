import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import { OrderService } from "@/lib/services/order-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";
const stripeKey = process.env.STRIPE_SECRET_KEY;

const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: "2024-12-18.acacia" as any })
  : null;

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("session_id");
    const orderNumber = req.nextUrl.searchParams.get("order_id");

    if (!sessionId || !stripe) {
      return NextResponse.json({ success: false, error: "Invalid session lookup" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isPaid = session.payment_status === "paid";

    if (isPaid && orderNumber) {
      const orders = await OrderService.getOrders();
      const ord = orders.find((o) => o.order_number === orderNumber);
      if (ord) {
        await OrderService.updateOrderStatus(ord.id, "confirmed");
      }
    }

    return NextResponse.json({
      success: true,
      paid: isPaid,
      amountTotal: (session.amount_total || 0) / 100,
      customerEmail: session.customer_details?.email,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to verify session";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const body = await req.json();

    const createdOrder = await OrderService.createOrder({
      ...body,
      user_id: token?.id || body.user_id || "guest-customer",
      customer_email: token?.email || body.customer_email || "customer@laundryexpress.com",
    });

    const isCard = body.payment_method === "card" || body.payment_method === "apple_pay";

    if (isCard && stripe) {
      const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
      const subtotalCents = Math.max(100, Math.round(Number(body.subtotal || body.total_amount || 32.50) * 100));
      const deliveryCents = Math.round(Number(body.delivery_fee || 0) * 100);

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Laundry Express — ${body.pricing_mode === "per_bag" ? "By The Bag Wash & Fold" : body.pricing_mode === "package" ? "Saver Package Credit" : "By The Pound (lb)"}`,
              description: `${body.bag_count || 1} Bag(s) • Cold Water Gentle Care • 24hr Return`,
              images: [`${origin}/brand/logo-badge.jpg`],
            },
            unit_amount: subtotalCents,
          },
          quantity: 1,
        },
      ];

      if (deliveryCents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Doorstep Pickup & Return Delivery",
              description: "Doorstep service within scheduled window",
            },
            unit_amount: deliveryCents,
          },
          quantity: 1,
        },
      );
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: body.customer_email || token?.email || undefined,
        success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${createdOrder.order_number}`,
        cancel_url: `${origin}/order?canceled=true`,
        metadata: {
          order_id: createdOrder.id,
          order_number: createdOrder.order_number,
          user_id: createdOrder.user_id || "",
          pickup_date: body.pickup_date || "",
          pickup_slot: body.pickup_slot || "",
        },
      });

      return NextResponse.json({
        success: true,
        checkoutUrl: session.url,
        order: createdOrder,
      }, { status: 201 });
    }

    return NextResponse.json({
      success: true,
      order: createdOrder,
      isCash: true,
    }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
