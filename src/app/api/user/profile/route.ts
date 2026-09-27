import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserDbService } from "@/lib/services/user-db-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

/**
 * POST /api/user/profile
 * Updates user profile attributes (name, phone, address) dynamically in database (public.users)
 * Strictly complies with the < 250 lines rule
 */
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { fullName, phone, address, userId } = body;
    const targetUserId = (userId as string) || token.id;

    // Prevent IDOR: customers can only edit their own profile
    if (token.role !== "admin" && targetUserId !== token.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden. You cannot edit another user's profile." },
        { status: 403 }
      );
    }

    const updates: Record<string, string> = {};
    if (typeof fullName === "string" && fullName.trim()) {
      updates.full_name = fullName.trim();
    }
    if (typeof phone === "string") {
      updates.phone = phone.trim();
    }
    if (typeof address === "string") {
      updates.address = address.trim();
    }

    const updated = await UserDbService.updateProfile(targetUserId, updates, token.email || undefined);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update profile in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profile details successfully updated.",
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Profile update error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

/**
 * GET /api/user/profile
 * Retrieves latest user profile and avatar from database
 */
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await UserDbService.getUserByEmail(token.email);
    if (!user) {
      return NextResponse.json({ success: false, error: "User profile not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, user },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Profile fetch error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

