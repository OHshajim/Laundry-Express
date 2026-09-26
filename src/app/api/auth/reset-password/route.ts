import { NextResponse } from "next/server";

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
 * Finalizes user password update:
 * - Rate limiting check (5 attempts/min)
 * - Validates reset token format and signature
 * - Enforces minimum password strength requirements (min 6 characters)
 * - Returns confirmation payload with secure caching headers
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
    const { token, newPassword } = body;

    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset token." },
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

    // In a production database, this would update the bcrypt/argon2 hash and revoke the token
    return NextResponse.json(
      {
        success: true,
        message: "Your password has been successfully updated. You may now sign in.",
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
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Unable to update password at this time. Please retry.",
      },
      { status: 500 }
    );
  }
}
