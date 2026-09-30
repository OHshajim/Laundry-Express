import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";
import { createAdminSignedProofUrl } from "@/lib/supabase/admin";
import { OrderService } from "@/lib/services/order-service";

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: getAuthSecret() });
    if (!token?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const orderId = req.nextUrl.searchParams.get("orderId");
    const path = req.nextUrl.searchParams.get("path");
    if (!orderId || !path || path.includes("..")) {
      return NextResponse.json({ success: false, error: "Invalid proof request." }, { status: 400 });
    }

    const order = await OrderService.getOrderByNumber(orderId);
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found." }, { status: 404 });
    }
    if (
      token.role !== "admin" &&
      order.user_id !== token.id &&
      (!token.email || order.customer_email?.toLowerCase() !== token.email.toLowerCase())
    ) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }

    const proofUrl = `/api/order-proof?${new URLSearchParams({ orderId, path }).toString()}`;
    const knownPath = order.proofs?.some((proof) => proof.image_url === proofUrl);
    const matchesOrder = path.startsWith(`order-${order.id}/`) ||
      (order.order_number && path.startsWith(`order-${order.order_number}/`));
    if (!knownPath || !matchesOrder) {
      return NextResponse.json({ success: false, error: "Proof not found." }, { status: 404 });
    }

    const signedUrl = await createAdminSignedProofUrl(path);
    if (!signedUrl) {
      return NextResponse.json({ success: false, error: "Unable to retrieve proof." }, { status: 500 });
    }
    return NextResponse.redirect(signedUrl);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unable to retrieve proof.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
