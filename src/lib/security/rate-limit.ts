import crypto from "node:crypto";
import type { NextRequest } from "next/server";
import { getAuthSecret } from "@/lib/auth-secret";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function consumeRateLimit(
  req: NextRequest | Request,
  scope: string,
  limit: number,
  windowSeconds: number,
  subject = ""
): Promise<boolean> {
  const forwardedFor = req.headers.get("x-real-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwardedFor || "unknown";
  const key = crypto.createHmac("sha256", getAuthSecret())
    .update(`${scope}:${ip}:${subject.trim().toLowerCase()}`)
    .digest("hex");
  const { data, error } = await createAdminSupabaseClient().rpc("consume_auth_rate_limit", {
    key_input: key,
    max_hits: limit,
    window_seconds: windowSeconds,
  });
  if (error) throw new Error(`Unable to check request rate limit: ${error.message}`);
  return data === true;
}
