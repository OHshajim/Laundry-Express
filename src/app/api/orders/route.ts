import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { OrderService } from "@/lib/services/order-service";
import { getAuthSecret } from "@/lib/auth-secret";


/**
 * /api/orders
 * Dynamic endpoint for customer bookings & administrative fulfillment pipeline
 * Strictly complies with the < 250 lines rule
 */

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    const isAdmin = token?.role === "admin";
    const userId = isAdmin ? undefined : token.id;
    const userEmail = isAdmin ? undefined : token?.email || undefined;

    if (!isAdmin && req.nextUrl.searchParams.has("userId")) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }

    const orders = await OrderService.getOrders(userId, userEmail);
    return NextResponse.json({ success: true, orders }, { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load orders";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token?.id || !token.email) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }
    const body = await req.json();

    const createdOrder = await OrderService.createOrder({
      ...body,
      user_id: token.id,
      customer_email: token.email,
    });

    return NextResponse.json({ success: true, order: createdOrder }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create booking";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
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
