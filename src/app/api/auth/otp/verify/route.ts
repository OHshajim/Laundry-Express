import { NextResponse, type NextRequest } from "next/server";
import { OtpService } from "@/lib/security/otp-service";
import { consumeRateLimit } from "@/lib/security/rate-limit";

/**
 * POST /api/auth/otp/verify
 * Validates that the submitted 6-digit OTP matches the database record
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, otp, purpose } = body;
    if (typeof email === "string" && !await consumeRateLimit(req, "otp-verify", 10, 60, email)) {
      return NextResponse.json({ success: false, error: "Too many verification attempts. Please wait." }, { status: 429 });
    }

    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { success: false, error: "Email, 6-digit code, and purpose are required." },
        { status: 400 }
      );
    }

    if (purpose !== "change_password" && purpose !== "reset_password") {
      return NextResponse.json(
        { success: false, error: "Invalid verification purpose." },
        { status: 400 }
      );
    }

    const result = await OtpService.verifyAndConsumeOtp(email, otp, purpose);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Incorrect verification code." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Code verified successfully." },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Verification service error.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
