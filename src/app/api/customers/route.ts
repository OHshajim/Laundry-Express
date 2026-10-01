import { NextResponse, type NextRequest } from "next/server";
import { CustomerService } from "@/lib/services/customer-service";
import { getVerifiedUser } from "@/lib/auth-request";

export async function GET(req: NextRequest) {
  const verified = await getVerifiedUser(req);
  if (!verified) return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
  if (verified.user.role !== "admin") return NextResponse.json({ success: false, error: "Forbidden. Admin access required." }, { status: 403 });

  try {
    const customers = await CustomerService.getCustomers();
    return NextResponse.json({ success: true, customers }, { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load customers";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
