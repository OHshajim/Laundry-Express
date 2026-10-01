import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PricingPlanService } from "@/lib/services/pricing-plan-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function GET() {
  try {
    const pricing = await PricingPlanService.getPricing();
    return NextResponse.json(
      { success: true, configured: pricing !== null, pricing },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load pricing";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }
    const body = await req.json();
    const updated = await PricingPlanService.updatePricing(body);
    return NextResponse.json({ success: true, pricing: updated }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update pricing";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
