import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { CouponService } from "@/lib/services/coupon-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

const requireAdmin = async (req: NextRequest) => {
  const token = await getToken({ req, secret: AUTH_SECRET });
  if (!token) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  if (token.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
  return null;
};

export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get("code");
    const subtotal = parseFloat(req.nextUrl.searchParams.get("subtotal") || "0");

    if (code) {
      const result = await CouponService.validateCoupon(code, subtotal);
      return NextResponse.json(result, { status: result.valid ? 200 : 400 });
    }

    const guard = await requireAdmin(req);
    if (guard) return guard;
    const coupons = await CouponService.getCoupons();
    return NextResponse.json({ success: true, coupons }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load coupons";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const body = await req.json();
    const saved = await CouponService.saveCoupon(body);
    return NextResponse.json({ success: true, coupon: saved }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const body = await req.json();
    const saved = await CouponService.saveCoupon(body);
    return NextResponse.json({ success: true, coupon: saved });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard) return guard;
  try {
    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "Coupon ID required" }, { status: 400 });
    await CouponService.deleteCoupon(id);
    return NextResponse.json({ success: true, message: "Coupon deleted." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete coupon";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
