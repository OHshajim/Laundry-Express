import { NextResponse, type NextRequest } from "next/server";
import { OrderService } from "@/lib/services/order-service";
import { ContentService } from "@/lib/services/content-service";
import { sendInvoiceEmail } from "@/lib/services/email-service";
import { formatSlotLabel, resolveDetergentName } from "@/lib/utils";

/**
 * POST /api/orders/email-invoice
 * Sends invoice email to customer + admin via Nodemailer.
 * Slot times are loaded from admin settings — fully dynamic.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { orderId, orderNumber } = body;

    const identifier = orderNumber || orderId;
    if (!identifier) {
      return NextResponse.json({ success: false, error: "Order identifier required" }, { status: 400 });
    }

    const [order, settings] = await Promise.all([
      OrderService.getOrderByNumber(identifier),
      ContentService.getSettings(),
    ]);

    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const s = settings as any;
    const slotLabel = order.pickup_slot === "8am-12pm" || order.pickup_slot === "1pm-6pm"
      ? formatSlotLabel(
          order.pickup_slot as "8am-12pm" | "1pm-6pm",
          s.slot1_start || "08:00", s.slot1_end || "12:00",
          s.slot2_start || "13:00", s.slot2_end || "18:00"
        )
      : order.pickup_slot || "Scheduled Window";

    const planNames: Record<string, string> = {
      per_bag: "By The Bag (13 Gal)",
      per_lb: "By The Pound (lb)",
      package: "Saver Package",
    };

    const fullAddress = [
      order.street_address,
      order.apt_unit ? `Apt ${order.apt_unit}` : "",
      order.city, order.state, order.zip_code,
    ].filter(Boolean).join(", ") || order.pickup_address || "";

    await sendInvoiceEmail({
      orderNumber: order.order_number,
      customerName: order.customer_name || "Valued Customer",
      customerEmail: order.customer_email || "",
      pickupDate: order.pickup_date,
      pickupSlot: slotLabel,
      deliveryDate: order.delivery_date || "Within 24 Hours",
      planName: planNames[order.pricing_mode] || order.pricing_mode,
      quantity: order.pricing_mode === "per_bag"
        ? `${order.bag_count} Bag(s)`
        : `${order.final_weight_lbs || order.estimated_weight_lbs || 0} lbs`,
      detergent: resolveDetergentName(order.detergent_id),
      subtotal: Number(order.subtotal || 0),
      deliveryFee: Number(order.delivery_fee || 0),
      discountAmount: Number(order.discount_amount || 0),
      totalAmount: Number(order.total_amount || 0),
      address: fullAddress,
    });

    return NextResponse.json({
      success: true,
      message: `Invoice dispatched to ${order.customer_email} and admin`,
      orderNumber: order.order_number,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to send invoice email";
    console.error("[email-invoice]", msg);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
