import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { OtpService } from "@/lib/security/otp-service";
import { UserDbService } from "@/lib/services/user-db-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";

/**
 * POST /api/auth/change-password
 * Updates account password strictly upon matching 6-digit email OTP
 * Strictly adheres to the < 250 lines rule
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
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Email, verification OTP, and new password are required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verify session user matches requested email (or is admin)
    if (token.email && token.email.toLowerCase() !== normalizedEmail && token.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden. You cannot change another user's password." },
        { status: 403 }
      );
    }

    if (typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Strictly match OTP in DB
    const verifyResult = await OtpService.verifyAndConsumeOtp(normalizedEmail, otp, "change_password");
    if (!verifyResult.success) {
      return NextResponse.json(
        { success: false, error: verifyResult.error || "Incorrect or expired verification code." },
        { status: 400 }
      );
    }

    // 2. Persist new hashed password
    const updated = await UserDbService.updatePassword(normalizedEmail, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Failed to update password in database." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Your password has been successfully updated." },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Password change service error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
