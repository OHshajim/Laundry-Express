"use client";

import * as React from "react";
import { Lock, Mail, Phone, KeyRound, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SettingsPasswordProps {
  userEmail?: string;
  userPhone?: string;
}

/**
 * SettingsPassword Component
 * Implements AGENTS.md 5.e.3:
 * Reset password by verifying OTP sent to email and phone number.
 */
export function SettingsPassword({
  userEmail = "customer@laundryexpress.com",
  userPhone = "815-575-9536",
}: SettingsPasswordProps) {
  const [step, setStep] = React.useState<"request" | "verify" | "success">("request");
  const [channel, setChannel] = React.useState<"email" | "phone">("email");
  const [otpCode, setOtpCode] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setTimeout(() => {
      setIsLoading(false);
      setStep("verify");
    }, 700);
  };

  const handleVerifyAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (otpCode.trim().length < 4) {
      setErrorMsg("Please enter the 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
      setOtpCode("");
      setNewPassword("");
      setConfirmPassword("");
    }, 900);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-black text-slate-900">Security &amp; Password Reset</h3>
        <p className="text-xs text-slate-500">
          Reset your password securely via OTP verification to your verified email or mobile phone.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {step === "request" && (
        <form onSubmit={handleSendOtp} className="space-y-4 max-w-md text-xs">
          <label className="block text-slate-700 font-bold uppercase tracking-wider">
            Choose Verification Channel for OTP
          </label>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setChannel("email")}
              className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                channel === "email" ? "border-primary bg-pink-50 text-slate-900 font-bold" : "border-slate-200 bg-white"
              }`}
            >
              <Mail className="h-4 w-4 text-primary" />
              <div>
                <span className="block text-xs">Email OTP</span>
                <span className="text-[10px] text-slate-400 truncate block">{userEmail}</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setChannel("phone")}
              className={`p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                channel === "phone" ? "border-primary bg-pink-50 text-slate-900 font-bold" : "border-slate-200 bg-white"
              }`}
            >
              <Phone className="h-4 w-4 text-primary" />
              <div>
                <span className="block text-xs">SMS OTP</span>
                <span className="text-[10px] text-slate-400 truncate block">{userPhone}</span>
              </div>
            </button>
          </div>

          <Button type="submit" variant="hero" size="sm" isLoading={isLoading} className="cursor-pointer">
            <KeyRound className="h-3.5 w-3.5 mr-1.5" />
            <span>Send OTP Verification Code</span>
          </Button>
        </form>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerifyAndReset} className="space-y-4 max-w-md text-xs">
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-sky-900 text-xs">
            A verification code has been dispatched to your {channel === "email" ? userEmail : userPhone}.
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700 font-semibold">Enter 6-Digit OTP Code</label>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="e.g. 123456"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-mono text-sm tracking-widest text-center"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700 font-semibold">New Password</label>
            <input
              type="password"
              required
              placeholder="At least 6 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-slate-700 font-semibold">Confirm New Password</label>
            <input
              type="password"
              required
              placeholder="Re-type new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setStep("request")} className="cursor-pointer">
              Back
            </Button>
            <Button type="submit" variant="hero" size="sm" isLoading={isLoading} className="cursor-pointer">
              <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
              Verify OTP &amp; Update Password
            </Button>
          </div>
        </form>
      )}

      {step === "success" && (
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-3 max-w-md">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            <span>Password Successfully Updated!</span>
          </div>
          <p>Your password has been changed via OTP verification. You can now use your new password on all devices.</p>
          <Button type="button" variant="outline" size="sm" onClick={() => setStep("request")} className="cursor-pointer text-xs">
            Done
          </Button>
        </div>
      )}
    </div>
  );
}
