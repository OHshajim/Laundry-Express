import crypto from "node:crypto";
import { getAuthSecret } from "@/lib/auth-secret";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

interface RequestLike {
  headers?: Headers | Record<string, string | string[] | undefined> | { get?: (name: string) => string | null };
}

function extractClientIp(req?: RequestLike): string {
  if (!req?.headers) return "unknown";
  const h = req.headers;
  const getHeader = (name: string): string | null => {
    if (typeof (h as Headers).get === "function") return (h as Headers).get(name);
    if (typeof (h as { get?: (k: string) => string | null }).get === "function") {
      return (h as { get: (k: string) => string | null }).get(name);
    }
    const val = (h as Record<string, string | string[] | undefined>)[name]
      || (h as Record<string, string | string[] | undefined>)[name.toLowerCase()];
    return Array.isArray(val) ? val[0] : (val || null);
  };

  const ip = getHeader("x-vercel-forwarded-for")
    || getHeader("x-real-ip")
    || "unknown";
  return ip.replace(/[^a-zA-Z0-9.:_-]/g, "");
}

export async function consumeRateLimit(
  req: RequestLike | undefined,
  scope: string,
  limit: number,
  windowSeconds: number,
  subject = ""
): Promise<boolean> {
  const ip = extractClientIp(req);
  const secret = getAuthSecret();
  const supabase = createAdminSupabaseClient();

  // 1. IP-based rate limit check
  const ipKey = crypto.createHmac("sha256", secret).update(`${scope}:ip:${ip}`).digest("hex");
  const { data: ipAllowed, error: ipError } = await supabase.rpc("consume_auth_rate_limit", {
    key_input: ipKey,
    max_hits: limit,
    window_seconds: windowSeconds,
  });
  if (ipError) throw new Error(`Rate limit check failed: ${ipError.message}`);
  if (ipAllowed !== true) return false;

  // 2. Account/Email subject rate limit check (prevents botnet distributed password guessing)
  const normSubject = subject.trim().toLowerCase();
  if (normSubject) {
    const accKey = crypto.createHmac("sha256", secret).update(`${scope}:account:${normSubject}`).digest("hex");
    const { data: accAllowed, error: accError } = await supabase.rpc("consume_auth_rate_limit", {
      key_input: accKey,
      max_hits: limit,
      window_seconds: windowSeconds,
    });
    if (accError) throw new Error(`Rate limit check failed: ${accError.message}`);
    if (accAllowed !== true) return false;
  }

  return true;
}
