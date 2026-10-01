import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { OrderService } from "@/lib/services/order-service";
import { PricingPlanService } from "@/lib/services/pricing-plan-service";
import { CatalogService } from "@/lib/services/catalog-service";
import { CouponService } from "@/lib/services/coupon-service";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";
import { getVerifiedUser } from "@/lib/auth-request";
import type { CouponItem } from "@/lib/services/coupon-service";
import { validateCheckoutPayload } from "@/lib/checkout-validation";

const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
  // @ts-expect-error -- Keep the API version pinned for the existing Stripe integration.
  apiVersion: "2024-12-18.acacia",
}) : null;

/**
 * GET /api/checkout?order_id=...&session_id=...
 * Reads the actual database order status without mutating payment state.
 * Payment confirmation is strictly delegated to verified Stripe webhooks.
 */
export async function GET(req: NextRequest) {
  try {
    const verified = await getVerifiedUser(req);
    if (!verified?.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    const { user } = verified;
    const orderNumber = req.nextUrl.searchParams.get("order_id");
    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Missing order identifier" }, { status: 400 });
    }

    const order = await OrderService.getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }
    if (user.role !== "admin" && order.user_id !== user.id &&
      order.customer_email?.toLowerCase() !== user.email.toLowerCase()) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }

    const isPaid = order.payment_status === "paid";

    return NextResponse.json({
      success: true,
      paid: isPaid,
      order,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to retrieve order";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * POST /api/checkout
 * Validates prices server-side, creates a pending order, and initializes a Stripe Checkout Session.
 */
export async function POST(req: NextRequest) {
  try {
    const verified = await getVerifiedUser(req);
    if (!verified) {
      return NextResponse.json({ success: false, error: "Sign in before placing an order." }, { status: 401 });
    }
    const { user } = verified;
    const body = await req.json().catch(() => null);
    const payloadError = validateCheckoutPayload(body);
    if (payloadError) return NextResponse.json({ success: false, error: payloadError }, { status: 400 });
    const paymentMethod = body.payment_method;
    const isOnline = paymentMethod !== "cash_on_delivery";
    if (isOnline && !stripe) {
      return NextResponse.json({ success: false, error: "Online payment is temporarily unavailable." }, { status: 503 });
    }

    const pricingConfig = await PricingPlanService.getPricing();
    if (!pricingConfig) {
      return NextResponse.json(
        { success: false, error: "Pricing has not been configured. Please try again later." },
        { status: 503 }
      );
    }
    if (body.pricing_mode === "per_bag" &&
      (typeof body.bag_count !== "number" || !Number.isInteger(body.bag_count) ||
        body.bag_count < pricingConfig.min_bags || body.bag_count > pricingConfig.max_bags)) {
      return NextResponse.json({ success: false, error: `Bag quantity must be a whole number between ${pricingConfig.min_bags} and ${pricingConfig.max_bags}.` }, { status: 400 });
    }
    if (body.pricing_mode === "per_lb" &&
      (typeof body.estimated_weight_lbs !== "number" || !Number.isFinite(body.estimated_weight_lbs) ||
        body.estimated_weight_lbs < pricingConfig.min_lbs || body.estimated_weight_lbs > pricingConfig.max_lbs)) {
      return NextResponse.json({ success: false, error: `Laundry weight must be between ${pricingConfig.min_lbs} and ${pricingConfig.max_lbs} lbs.` }, { status: 400 });
    }
    const { detergents } = await CatalogService.getCatalog();
    const detergent = detergents.find((d) => d.id === body.detergent_id);
    if (!detergent?.is_active) {
      return NextResponse.json(
        { success: false, error: "Choose an available detergent before checkout." },
        { status: 400 }
      );
    }
    const detergentFee = detergent ? detergent.price : 0;

    let validatedCoupon: CouponItem | undefined;
    if (body.promo_code) {
      const preliminaryPrice = calculateOrderPrice({
        pricing_mode: body.pricing_mode || "per_bag",
        bag_count: body.bag_count,
        estimated_weight_lbs: body.estimated_weight_lbs,
        detergent_fee: detergentFee,
        base_bag_price: pricingConfig.base_bag_price,
        base_pound_price: pricingConfig.base_pound_price,
        min_bags: pricingConfig.min_bags,
        max_bags: pricingConfig.max_bags,
        min_lbs: pricingConfig.min_lbs,
        max_lbs: pricingConfig.max_lbs,
        free_delivery_lbs: pricingConfig.free_delivery_lbs,
        one_bag_delivery_fee: pricingConfig.one_bag_delivery_fee,
        free_delivery_threshold: pricingConfig.free_delivery_threshold,
      });

      const couponCheck = await CouponService.validateCoupon(body.promo_code, preliminaryPrice.subtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        validatedCoupon = couponCheck.coupon;
      } else {
        return NextResponse.json({ success: false, error: couponCheck.error || "Invalid coupon code." }, { status: 400 });
      }
    }

    const serverPrice = calculateOrderPrice({
      pricing_mode: body.pricing_mode || "per_bag",
      bag_count: body.bag_count,
      estimated_weight_lbs: body.estimated_weight_lbs,
      detergent_fee: detergentFee,
      promo: validatedCoupon ? {
        code: validatedCoupon.code,
        discount_type: validatedCoupon.discount_type,
        discount_value: validatedCoupon.discount_value,
      } : undefined,
      base_bag_price: pricingConfig.base_bag_price,
      base_pound_price: pricingConfig.base_pound_price,
      min_bags: pricingConfig.min_bags,
      max_bags: pricingConfig.max_bags,
      min_lbs: pricingConfig.min_lbs,
      max_lbs: pricingConfig.max_lbs,
      free_delivery_lbs: pricingConfig.free_delivery_lbs,
      one_bag_delivery_fee: pricingConfig.one_bag_delivery_fee,
      free_delivery_threshold: pricingConfig.free_delivery_threshold,
    });
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;
    let origin: string | undefined;
    if (isOnline) {
      const originUrl = new URL(configuredOrigin);
      if (originUrl.protocol !== "https:" && originUrl.hostname !== "localhost") {
        return NextResponse.json({ success: false, error: "Checkout requires a secure site URL." }, { status: 503 });
      }
      origin = originUrl.origin;
      if (Math.round(serverPrice.total_amount * 100) < 50) {
        return NextResponse.json({ success: false, error: "The order total is below Stripe's minimum payment amount." }, { status: 400 });
      }
    }

    const createdOrder = await OrderService.createOrder({
      ...body,
      detergent_name: detergent.name,
      user_id: user.id,
      customer_name: user.full_name,
      customer_email: user.email,
      customer_phone: body.customer_phone || user.phone || "",
      subtotal: serverPrice.subtotal,
      detergent_fee: serverPrice.detergent_fee,
      delivery_fee: serverPrice.delivery_fee,
      discount_amount: serverPrice.discount_amount,
      coupon_code: validatedCoupon?.code || null,
      tax_amount: serverPrice.tax_amount,
      total_amount: serverPrice.total_amount,
      payment_method: paymentMethod,
      payment_status: "pending",
      order_status: "pending",
    });

    if (isOnline && stripe) {
      const netServiceAmountCents = Math.round((serverPrice.subtotal + serverPrice.detergent_fee - serverPrice.discount_amount) * 100);
      const deliveryFeeCents = Math.round(serverPrice.delivery_fee * 100);

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Laundry Express — ${createdOrder.pricing_mode === "per_bag" ? "By The Bag Wash & Fold" : createdOrder.pricing_mode === "package" ? "Saver Package Credit" : "By The Pound (lb)"}`,
              description: `${createdOrder.pricing_mode === "per_bag" ? `${createdOrder.bag_count || 1} Bag(s)` : `${createdOrder.estimated_weight_lbs || 15} lbs`} • Cold Water Gentle Care • 24hr Return`,
              images: [`${origin}/brand/logo-badge.jpg`],
            },
            unit_amount: netServiceAmountCents,
          },
          quantity: 1,
        },
      ];

      if (deliveryFeeCents > 0) {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Doorstep Pickup & Return Delivery",
              description: "Doorstep pickup and 24hr return delivery",
            },
            unit_amount: deliveryFeeCents,
          },
          quantity: 1,
        });
      }

      let session: Stripe.Checkout.Session;
      try {
        session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: user.email,
        success_url: `${origin}/dashboard/orders?checkout=complete&order_id=${encodeURIComponent(createdOrder.order_number)}`,
        cancel_url: `${origin}/order?canceled=true&order_id=${createdOrder.order_number}`,
        metadata: {
          order_id: createdOrder.id,
          order_number: createdOrder.order_number,
          user_id: createdOrder.user_id || "",
          pickup_date: createdOrder.pickup_date || "",
          pickup_slot: createdOrder.pickup_slot || "",
        },
        payment_intent_data: {
          metadata: {
            order_number: createdOrder.order_number,
            order_id: createdOrder.id,
          },
        },
        });
      } catch (error) {
        await OrderService.markOrderPaymentFailed(createdOrder.order_number);
        throw error;
      }

      try {
        await OrderService.saveCheckoutSessionId(createdOrder.id, session.id);
      } catch (error) {
        try {
          await stripe.checkout.sessions.expire(session.id);
          await OrderService.markOrderPaymentFailed(createdOrder.id);
        } catch (cleanupError) {
          console.error("[checkout] Unable to safely close an untracked Stripe session:", cleanupError);
        }
        throw error;
      }
      if (!session.url) {
        try {
          await stripe.checkout.sessions.expire(session.id);
          await OrderService.markOrderPaymentFailed(createdOrder.id);
        } catch (cleanupError) {
          console.error("[checkout] Unable to close a Stripe session without a redirect URL:", cleanupError);
        }
        throw new Error("Stripe did not provide a checkout URL.");
      }

      return NextResponse.json({ success: true, checkoutUrl: session.url, order: createdOrder }, { status: 201 });
    }

    return NextResponse.json({ success: true, order: createdOrder, isCash: true }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
