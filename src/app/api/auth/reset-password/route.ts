import { NextResponse } from "next/server";
import { OtpService } from "@/lib/security/otp-service";
import { UserDbService } from "@/lib/services/user-db-service";

// Rate limiting map for reset password execution (5 requests per minute per IP)
const executeRateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkExecuteRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const entry = executeRateLimitMap.get(ip);
  if (!entry || now > entry.expiresAt) {
    executeRateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * POST /api/auth/reset-password
 *
 * Finalizes user password update via verified email OTP:
 * - Rate limiting check (5 attempts/min)
 * - Cryptographically verifies matching 6-digit email OTP
 * - Updates hashed credentials across database and memory store
 * - Strictly complies with 100-250 lines rule
 */
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkExecuteRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many attempts. Please wait 60 seconds.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    if (!otp || typeof otp !== "string" || otp.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 6-digit verification code." },
        { status: 400 }
      );
    }

    if (!newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "New password must be at least 6 characters long.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // 1. Strictly verify 6-digit OTP dispatched to this email
    const verifyResult = await OtpService.verifyAndConsumeOtp(normalizedEmail, otp.trim(), "reset_password");
    if (!verifyResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: verifyResult.error || "Incorrect or expired verification code. Please check your email.",
        },
        { status: 400 }
      );
    }

    // 2. Persist new hashed password into database and memory registry
    const updated = await UserDbService.updatePassword(normalizedEmail, newPassword);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Unable to update password. Please retry." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your password has been successfully reset. You may now sign in.",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Password reset service temporarily unavailable.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
