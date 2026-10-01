import crypto from "node:crypto";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { getAuthSecret } from "@/lib/auth-secret";

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function hashOtp(otp: string): string {
  return crypto.createHmac("sha256", getAuthSecret()).update(otp.trim()).digest("hex");
}

function hashesMatch(storedHash: string, inputHash: string): boolean {
  const stored = Buffer.from(storedHash, "hex");
  const input = Buffer.from(inputHash, "hex");
  return stored.length === input.length && crypto.timingSafeEqual(stored, input);
}

export class OtpService {
  static async generateAndSaveOtp(
    email: string,
    purpose: "change_password" | "reset_password" | "register_email"
  ): Promise<{ success: boolean; error?: string }> {
    const normalized = email.trim().toLowerCase();
    const code = crypto.randomInt(100000, 1000000).toString();
    const supabase = createAdminSupabaseClient();
    const { error: deleteError } = await supabase.from("auth_otps")
      .delete().eq("email", normalized).eq("purpose", purpose);
    if (deleteError) throw new Error(`Unable to replace verification code: ${deleteError.message}`);

    const { data, error } = await supabase.from("auth_otps").insert({
      email: normalized,
      otp_hash: hashOtp(code),
      purpose,
      attempts: 0,
      expires_at: new Date(Date.now() + OTP_TTL_MS).toISOString(),
    }).select("id").single();
    if (error || !data) throw new Error(`Unable to save verification code: ${error?.message || "No record returned."}`);

    try {
      const { sendOtpEmail } = await import("@/lib/services/email-service");
      await sendOtpEmail(normalized, code, purpose);
    } catch (error) {
      const { error: deleteError } = await supabase.from("auth_otps").delete().eq("id", data.id);
      if (deleteError) console.error("[otp] Failed to remove undelivered code:", deleteError.message);
      console.error("[otp] Email delivery failed:", error);
      return { success: false, error: "Unable to send the verification code. Please retry." };
    }
    return { success: true };
  }

  static async verifyAndConsumeOtp(
    email: string,
    inputOtp: string,
    purpose: "change_password" | "reset_password" | "register_email"
  ): Promise<{ success: boolean; error?: string }> {
    if (!email || !/^\d{6}$/.test(inputOtp.trim())) {
      return { success: false, error: "A valid 6-digit code is required." };
    }

    const normalized = email.trim().toLowerCase();
    const inputHash = hashOtp(inputOtp);
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.from("auth_otps")
      .select("id,otp_hash,attempts,expires_at")
      .eq("email", normalized).eq("purpose", purpose)
      .order("created_at", { ascending: false }).limit(1).maybeSingle();
    if (error) throw new Error(`Unable to verify code: ${error.message}`);
    if (!data) return { success: false, error: "Verification code has expired or was not requested." };

    if (Date.now() > Date.parse(data.expires_at)) {
      const { error: deleteError } = await supabase.from("auth_otps").delete().eq("id", data.id);
      if (deleteError) throw new Error(`Unable to remove expired code: ${deleteError.message}`);
      return { success: false, error: "Verification code has expired. Please request a new code." };
    }
    if (data.attempts >= MAX_ATTEMPTS) {
      return { success: false, error: "Too many incorrect attempts. Please request a new code." };
    }
    if (!hashesMatch(data.otp_hash, inputHash)) {
      const { data: updated, error: updateError } = await supabase.from("auth_otps")
        .update({ attempts: data.attempts + 1 })
        .eq("id", data.id).eq("attempts", data.attempts).select("id").maybeSingle();
      if (updateError) throw new Error(`Unable to record failed verification: ${updateError.message}`);
      if (!updated) return { success: false, error: "Verification code has already been used." };
      return { success: false, error: "Incorrect verification code. Please check your email." };
    }

    const { data: consumed, error: consumeError } = await supabase.from("auth_otps")
      .delete().eq("id", data.id).eq("otp_hash", inputHash).select("id").maybeSingle();
    if (consumeError) throw new Error(`Unable to consume verification code: ${consumeError.message}`);
    return consumed
      ? { success: true }
      : { success: false, error: "Verification code has already been used." };
  }
}
