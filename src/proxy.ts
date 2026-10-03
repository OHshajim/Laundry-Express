import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthSecret } from "@/lib/auth-secret";

/**
 * Enterprise Next.js Security Proxy
 *
 * Enforces route-level authentication & role authorization:
 * 1. /order/:path* -> Strictly requires authentication. Unauthenticated users redirected to /login.
 * 2. /dashboard/:path* -> Strictly requires customer or admin authentication.
 * 3. /admin/:path* -> Strictly requires admin role; non-admins redirected to /dashboard.
 * 4. Auth pages (/login, /register, etc.) -> Authenticated users redirected to /dashboard.
 */
export async function proxy(req: NextRequest) {
  const { pathname, search, searchParams } = req.nextUrl;

  const token = await getToken({
    req,
    secret: getAuthSecret(),
  });

  const isAuthenticated = !!token;
  const userRole = token?.role as string | undefined;
  const isAdmin = userRole === "admin";

  // 1. Guard legacy /admin routes - strictly require admin role
  if (pathname.startsWith("/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL(`/login?callbackUrl=${encodeURIComponent("/dashboard")}`, req.url);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  const isOrderRoute = pathname.startsWith("/order");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/reset-password");

  // 2. Guard protected customer & checkout routes
  if (isOrderRoute || isDashboardRoute) {
    if (!isAuthenticated) {
      const fullPath = pathname + (search || "");
      const callbackUrl = encodeURIComponent(fullPath);
      const loginUrl = new URL(`/login?callbackUrl=${callbackUrl}`, req.url);
      return NextResponse.redirect(loginUrl);
    }

    // 3. Guard against customer accessing admin-exclusive tabs via query parameters or direct URL paths
    if (isDashboardRoute && !isAdmin) {
      const requestedTab = searchParams.get("tab");
      const pathSegment = pathname.replace(/^\/dashboard\/?/, "").split("/")[0];
      const adminExclusiveTabs = new Set([
        "customers",
        "packages",
        "detergents",
        "coupons",
        "reviews",
        "faqs",
        "rates",
        "settings",
      ]);

      if ((requestedTab && adminExclusiveTabs.has(requestedTab)) || (pathSegment && adminExclusiveTabs.has(pathSegment))) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }
  }

  // 4. Prevent already authenticated users from landing on auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export default proxy;

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
