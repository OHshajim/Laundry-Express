import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { OtpService } from "@/lib/security/otp-service";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET;

// Rate limiting map (5 OTP requests per minute per IP)
const otpRateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkOtpRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const entry = otpRateLimitMap.get(ip);
  if (!entry || now > entry.expiresAt) {
    otpRateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * POST /api/auth/otp/send
 * Securely persists hashed 6-digit OTP in the database and dispatches code to email
 * Strictly adheres to the < 250 lines rule
 */
export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkOtpRateLimit(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many code requests. Please wait 60 seconds." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, purpose } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    if (purpose !== "change_password" && purpose !== "reset_password" && purpose !== "register_email") {
      return NextResponse.json(
        { success: false, error: "Invalid purpose specified." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // If changing password in settings, verify caller is authenticated and owns the email
    if (purpose === "change_password") {
      const token = await getToken({ req, secret: AUTH_SECRET });
      if (!token) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Please sign in to change your password." },
          { status: 401 }
        );
      }
      if (token.email && token.email.toLowerCase() !== normalizedEmail && token.role !== "admin") {
        return NextResponse.json(
          { success: false, error: "Forbidden. You can only request codes for your own account." },
          { status: 403 }
        );
      }
    }

    // Persist OTP in database and dispatch
    const result = await OtpService.generateAndSaveOtp(normalizedEmail, purpose);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to generate verification code." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `A 6-digit verification code has been dispatched to ${normalizedEmail}.`,
      },
      {
        status: 200,
        headers: { "Cache-Control": "no-store, max-age=0" },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to dispatch verification code.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
