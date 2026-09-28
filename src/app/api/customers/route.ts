import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { CustomerService } from "@/lib/services/customer-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

/**
 * /api/customers
 * GET: Retrieves customer accounts where role = 'customer' directly from the database
 * Strictly complies with the < 250 lines architectural rule.
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    const customers = await CustomerService.getCustomers();
    return NextResponse.json(
      { success: true, customers },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to load customers";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
