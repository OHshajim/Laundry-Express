import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { OrderService } from "@/lib/services/order-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

/**
 * /api/orders
 * Dynamic endpoint for customer bookings & administrative fulfillment pipeline
 * Strictly complies with the < 250 lines rule
 */

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const isAdmin = token?.role === "admin";
    const userId = isAdmin ? undefined : token?.id || (req.nextUrl.searchParams.get("userId") || undefined);

    const orders = await OrderService.getOrders(userId);
    return NextResponse.json({ success: true, orders }, { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load orders";
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

    return NextResponse.json({ success: true, order: createdOrder }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create booking";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden. Admin authorization required." }, { status: 403 });
    }

    const body = await req.json();
    const { orderId, status, finalWeight, proofType, imageUrl, notes } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required." }, { status: 400 });
    }

    if (status) {
      await OrderService.updateOrderStatus(orderId, status);
    }
    if (typeof finalWeight === "number") {
      await OrderService.updateFinalWeight(orderId, finalWeight);
    }
    if (proofType && imageUrl) {
      await OrderService.uploadProof(orderId, proofType, imageUrl, notes);
    }

    return NextResponse.json({ success: true, message: "Order successfully updated." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update order";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
