import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { PricingPlanService } from "@/lib/services/pricing-plan-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

export async function GET() {
  try {
    const plans = await PricingPlanService.getPlans();
    return NextResponse.json({ success: true, plans }, { status: 200 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load packages";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }
    const body = await req.json();
    const saved = await PricingPlanService.savePlan(body);
    return NextResponse.json({ success: true, plan: saved }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to save package";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token || token.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized. Admin role required." }, { status: 403 });
    }
    const id = req.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Plan ID is required." }, { status: 400 });
    }
    await PricingPlanService.deletePlan(id);
    return NextResponse.json({ success: true, message: "Package removed." });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to delete package";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
