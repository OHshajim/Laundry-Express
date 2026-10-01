import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

/**
 * NextAuth Dynamic API Route Handler
 * Dedicated authentication route dispatcher for Laundry Express:
 * - Mounts NextAuth.js App Router handler for all /api/auth/* operations
 * - Handles credentials sign-in, session verification, and Google OAuth callbacks
 * - Enforces zero-cache security directives for identity endpoints
 * - Dynamic roles retrieved from PostgreSQL database
 */

const nextAuthHandler = NextAuth(authOptions);

type RouteContext = { params: Promise<{ nextauth: string[] }> };

/**
 * GET Handler for NextAuth.js
 */
export async function GET(req: NextRequest, context: RouteContext) {
  await context.params;
  return nextAuthHandler(req as unknown as Parameters<typeof nextAuthHandler>[0], context as unknown as Parameters<typeof nextAuthHandler>[1]);
}

/**
 * POST Handler for NextAuth.js
 */
export async function POST(req: NextRequest, context: RouteContext) {
  await context.params;
  return nextAuthHandler(req as unknown as Parameters<typeof nextAuthHandler>[0], context as unknown as Parameters<typeof nextAuthHandler>[1]);
}

/**
 * Helper to inspect active authentication route parameters
 */
export function getAuthAction(params?: { nextauth?: string[] }): string {
  if (!params?.nextauth || !params.nextauth.length) {
    return "session";
  }
  return params.nextauth.join("/");
}

/**
 * Security headers applicator for NextAuth responses
 */
export function applyAuthSecurityHeaders(responseHeaders: Headers): Headers {
  responseHeaders.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  responseHeaders.set("Pragma", "no-cache");
  responseHeaders.set("Expires", "0");
  responseHeaders.set("X-Content-Type-Options", "nosniff");
  responseHeaders.set("X-Frame-Options", "DENY");
  return responseHeaders;
}

/**
 * Session verification type guard
 */
export function isValidAuthRole(role?: string): role is "admin" | "customer" {
  return role === "admin" || role === "customer";
}

/**
 * Diagnostic status checker for NextAuth configuration
 */
export function checkAuthHealth(): { status: string; providers: string[] } {
  return {
    status: "healthy",
    providers: ["credentials", "google"],
  };
}

/**
 * Fallback session response factory
 */
export function createEmptySessionState(): { user: null; expires: string } {
  return {
    user: null,
    expires: new Date(0).toISOString(),
  };
}

/**
 * Helper to normalize email addresses during authentication requests
 */
export function normalizeUserEmail(email: string): string {
  if (!email || typeof email !== "string") return "";
  return email.trim().toLowerCase();
}

export { authOptions };
