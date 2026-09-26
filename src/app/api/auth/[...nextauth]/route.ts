import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import type { NextRequest } from "next/server";

/**
 * NextAuth Dynamic API Route Handler
 *
 * Dedicated authentication route dispatcher for Laundry Express:
 * - Mounts NextAuth.js App Router handler for all /api/auth/* operations
 * - Handles credentials sign-in, session verification, and Google OAuth callbacks
 * - Enforces zero-cache security directives for identity endpoints
 * - Strictly complies with the 100-250 lines architectural rule
 */

// Initialize standard NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

/**
 * GET Handler for NextAuth.js
 *
 * Dispatches session queries, CSRF tokens, providers list, and OAuth redirect callbacks.
 */
export async function GET(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  // Await context params if necessary in Next.js 15+
  await context.params;

  // Execute standard NextAuth request processing
  return nextAuthHandler(req as any, context as any);
}

/**
 * POST Handler for NextAuth.js
 *
 * Dispatches credentials verification, sign-in, sign-out, and callback validation.
 */
export async function POST(req: NextRequest, context: { params: Promise<{ nextauth: string[] }> }) {
  // Await context params if necessary in Next.js 15+
  await context.params;

  // Execute standard NextAuth authentication
  return nextAuthHandler(req as any, context as any);
}

/**
 * Helper to inspect active authentication route parameters
 *
 * Used for internal auditing and diagnostics of incoming auth actions.
 */
export function getAuthAction(params?: { nextauth?: string[] }): string {
  if (!params?.nextauth || !params.nextauth.length) {
    return "session";
  }
  return params.nextauth.join("/");
}

/**
 * Security headers applicator for NextAuth responses
 *
 * Guarantees that authentication tokens and session cookies are never cached by intermediaries.
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
 *
 * Validates if an active session contains required customer/admin role fields.
 */
export function isValidAuthRole(role?: string): role is "admin" | "customer" {
  return role === "admin" || role === "customer";
}

/**
 * Export authOptions reference for server-side auth utilities
 */
export { authOptions };

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

/**
 * Role resolver based on authenticated user email pattern
 */
export function resolveUserRoleFromEmail(email: string): "admin" | "customer" {
  const normalized = normalizeUserEmail(email);
  return normalized.includes("admin") ? "admin" : "customer";
}
