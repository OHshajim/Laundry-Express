import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import { OrderService } from "@/lib/services/order-service";
import { AddressService } from "@/lib/services/address-service";
import { UserDbService } from "@/lib/services/user-db-service";
import { PricingPlanService } from "@/lib/services/pricing-plan-service";
import { CatalogService } from "@/lib/services/catalog-service";
import { CouponService } from "@/lib/services/coupon-service";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;
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
    const orderNumber = req.nextUrl.searchParams.get("order_id");
    if (!orderNumber) {
      return NextResponse.json({ success: false, error: "Missing order identifier" }, { status: 400 });
    }

    const order = await OrderService.getOrderByNumber(orderNumber);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
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
    const token = await getToken({ req, secret: AUTH_SECRET });
    const body = await req.json();

    // 1. Server-side zero-trust price calculation & validation
    const pricingConfig = await PricingPlanService.getPricing();
    if (!pricingConfig) {
      return NextResponse.json(
        { success: false, error: "Pricing has not been configured. Please try again later." },
        { status: 503 }
      );
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

    let validatedPromoCode: string | undefined;
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
        validatedPromoCode = couponCheck.coupon.code;
      }
    }

    const serverPrice = calculateOrderPrice({
      pricing_mode: body.pricing_mode || "per_bag",
      bag_count: body.bag_count,
      estimated_weight_lbs: body.estimated_weight_lbs,
      detergent_fee: detergentFee,
      promo_code: validatedPromoCode,
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

    // 2. Create the order with verified server prices and PENDING_PAYMENT status
    const createdOrder = await OrderService.createOrder({
      ...body,
      detergent_name: detergent.name,
      user_id: token?.id || body.user_id || "guest-customer",
      customer_name: body.customer_name || token?.name || "Customer",
      customer_email: token?.email || body.customer_email || "",
      customer_phone: body.customer_phone || token?.phone || "",
      subtotal: serverPrice.subtotal,
      delivery_fee: serverPrice.delivery_fee,
      discount_amount: serverPrice.discount_amount,
      tax_amount: serverPrice.tax_amount,
      total_amount: serverPrice.total_amount,
      payment_method: body.payment_method || "card",
      payment_status: "pending",
      order_status: "pending",
    });

    // 3. Persist address & profile updates for authenticated users
    if (createdOrder.user_id && createdOrder.user_id !== "guest-customer") {
      if (body.customer_phone) {
        try {
          await UserDbService.updateProfile(createdOrder.user_id, { phone: body.customer_phone }, token?.email || body.customer_email);
        } catch {}
      }
      if (body.street_address) {
        try {
          await AddressService.saveAddress({
            user_id: createdOrder.user_id,
            label: body.address_label || "Home",
            street_address: body.street_address,
            apt_unit: body.apt_unit || "",
            city: body.city || "",
            state: body.state || "",
            zip_code: body.zip_code || "",
            is_default: true,
          });
        } catch {}
      }
    }

    // 4. Create Stripe Checkout Session if card / online payment
    const isOnline = body.payment_method === "card" || body.payment_method === "apple_pay" || body.payment_method === "stripe";

    if (isOnline && stripe) {
      const origin = req.headers.get("origin") || req.nextUrl.origin || "http://localhost:3000";
      const netServiceAmountCents = Math.max(50, Math.round((serverPrice.subtotal - serverPrice.discount_amount) * 100));
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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        customer_email: body.customer_email || token?.email || undefined,
        success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}&order_id=${createdOrder.order_number}`,
        cancel_url: `${origin}/order?canceled=true&order_id=${createdOrder.order_number}`,
        metadata: {
          order_id: createdOrder.id,
          order_number: createdOrder.order_number,
          user_id: createdOrder.user_id || "",
          pickup_date: createdOrder.pickup_date || "",
          pickup_slot: createdOrder.pickup_slot || "",
        },
      });

      return NextResponse.json({ success: true, checkoutUrl: session.url, order: createdOrder }, { status: 201 });
    }

    return NextResponse.json({ success: true, order: createdOrder, isCash: true }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create checkout session";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
