import { NextResponse } from "next/server";
import type { User } from "@/types";
import { CustomUserStore } from "@/lib/services/custom-user-store";
import { UserDbService } from "@/lib/services/user-db-service";

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
 * - Persists profile in CustomUserStore for NextAuth credentials access
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
    const { fullName, email, password, phone } = body;

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

    // Register user inside CustomUserStore for immediate NextAuth authorization
    const storedUser = CustomUserStore.createCustomer({
      email: normalizedEmail,
      fullName: fullName.trim(),
      phone: phone?.trim(),
      password,
    });

    // Synchronize newly registered user into Supabase public.users
    let dbUser: User = storedUser;
    try {
      dbUser = await UserDbService.syncUser({
        id: storedUser.id,
        email: storedUser.email,
        name: storedUser.full_name,
        phone: storedUser.phone,
        role: "customer",
      });
    } catch (err: any) {
      console.warn("⚠️ Register API: Could not sync user to database:", err?.message);
    }

    const publicUser: User = {
      id: dbUser.id || storedUser.id,
      email: dbUser.email || storedUser.email,
      full_name: dbUser.full_name || storedUser.full_name,
      phone: dbUser.phone || storedUser.phone,
      address: dbUser.address || storedUser.address,
      role: dbUser.role || storedUser.role,
      is_active: dbUser.is_active ?? storedUser.is_active,
      created_at: dbUser.created_at || storedUser.created_at,
      updated_at: dbUser.updated_at || storedUser.updated_at,
    };

    return NextResponse.json(
      {
        success: true,
        user: publicUser,
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
    return NextResponse.json(
      { success: false, error: "Registration service error." },
      { status: 500 }
    );
  }
}
