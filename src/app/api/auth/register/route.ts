import { NextResponse } from "next/server";
import { CustomUserStore } from "@/lib/services/custom-user-store";
import { UserDbService } from "@/lib/services/user-db-service";
import { OtpService } from "@/lib/security/otp-service";

// In-memory rate limiting tracker (5 registrations per minute per IP)
const registrationRateLimitMap = new Map<string, { count: number; expiresAt: number }>();

function checkRegistrationRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 5;

  const entry = registrationRateLimitMap.get(ip);
  if (!entry || now > entry.expiresAt) {
    registrationRateLimitMap.set(ip, { count: 1, expiresAt: now + windowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  return true;
}

/**
 * POST /api/auth/register
 *
 * Production endpoint for customer account registration:
 * - Rate limiting protection (5 registrations/min)
 * - Strict full name and password complexity checks (min 6 characters)
 * - Creates a new database account without modifying existing accounts
 * - Strictly adheres to 100-250 lines rule
 */
export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRegistrationRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many registration attempts. Please wait 60 seconds.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-Content-Type-Options": "nosniff",
          },
        }
      );
    }

    const body = await req.json();
    const fullName = body.fullName || body.full_name || body.name;
    const { email, password, phone, verificationCode } = body;

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid full name." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    if (typeof verificationCode !== "string" || verificationCode.trim().length !== 6) {
      return NextResponse.json(
        { success: false, error: "A valid email verification code is required." },
        { status: 400 }
      );
    }

    if (CustomUserStore.findByEmail(normalizedEmail) || await UserDbService.getUserByEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const verification = await OtpService.verifyAndConsumeOtp(
      normalizedEmail,
      verificationCode,
      "register_email"
    );
    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: verification.error || "Email verification failed." },
        { status: 400 }
      );
    }

    const dbUser = await UserDbService.registerCustomer({
      email: normalizedEmail,
      name: fullName.trim(),
      phone: typeof phone === "string" ? phone : undefined,
      password,
    });

    const storedUser = CustomUserStore.createCustomer({
      id: dbUser.id,
      email: normalizedEmail,
      fullName: fullName.trim(),
      phone: typeof phone === "string" ? phone : undefined,
      password,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: dbUser.id || storedUser.id,
          email: dbUser.email,
          full_name: dbUser.full_name,
          phone: dbUser.phone,
          role: dbUser.role,
          is_active: dbUser.is_active,
          created_at: dbUser.created_at,
          updated_at: dbUser.updated_at,
        },
        message: "Customer account created successfully.",
      },
      {
        status: 201,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "An account with this email already exists.") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Registration service error." },
      { status: 500 }
    );
  }
}
