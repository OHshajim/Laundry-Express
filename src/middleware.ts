import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const AUTH_SECRET = process.env.NEXTAUTH_SECRET || "";

/**
 * Enterprise Next.js Security Middleware
 *
 * Enforces route-level authentication & unified dashboard routing:
 * 1. /order/:path* -> Strictly requires authentication. Unauthenticated users redirected to /login.
 * 2. /dashboard/:path* -> Strictly requires customer or admin authentication.
 * 3. /admin/:path* -> Automatically redirects to unified /dashboard where role-based services reside.
 * 4. Auth pages (/login, /register, etc.) -> Authenticated users redirected to /dashboard.
 *
 * Adheres strictly to the < 250 lines rule and Next.js App Router conventions.
 */
export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Retrieve token using next-auth/jwt
  const token = await getToken({
    req,
    secret: AUTH_SECRET,
  });

  const isAuthenticated = !!token;

  // 1. Automatically redirect legacy /admin requests to unified /dashboard
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isOrderRoute = pathname.startsWith("/order");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // 2. Guard protected user & checkout routes
  if (isOrderRoute || isDashboardRoute) {
    if (!isAuthenticated) {
      const fullPath = pathname + (search || "");
      const callbackUrl = encodeURIComponent(fullPath);
      const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Prevent already authenticated users from landing on auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/order/:path*",
    "/dashboard/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
  ],
};
