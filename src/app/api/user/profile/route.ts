import { NextResponse, type NextRequest } from "next/server";
import { UserDbService } from "@/lib/services/user-db-service";
import { getVerifiedUser } from "@/lib/auth-request";

/**
 * POST /api/user/profile
 * Updates user profile attributes (name, phone, address) dynamically in database (public.users)
 * Strictly complies with the < 250 lines rule
 */
export async function POST(req: NextRequest) {
  try {
    const verified = await getVerifiedUser(req);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }
    const { user } = verified;

    const body = await req.json();
    const { fullName, phone, address, userId } = body;
    const targetUserId = (userId as string) || user.id;

    // Prevent IDOR: customers can only edit their own profile
    if (user.role !== "admin" && targetUserId !== user.id) {
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

    const updated = await UserDbService.updateProfile(targetUserId, updates, user.email || undefined);
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
    const verified = await getVerifiedUser(req);
    if (!verified) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { success: true, user: verified.user },
      { status: 200, headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Profile fetch error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
