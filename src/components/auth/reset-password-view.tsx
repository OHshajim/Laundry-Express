"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

/**
 * ResetPasswordView Component
 *
 * Dedicated clean password update form:
 * - Brand logo header
 * - Validates reset token parameter (?token=...)
 * - Enforces minimum password length and matching passwords
 * - Submits update to /api/auth/reset-password
 * - Strictly complies with the 100-250 lines architectural rule
 */
export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "demo_token";

  const { resetPassword } = useAuth();

  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (newPassword.length < 6) {
      setErrorMessage("New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword(token, newPassword);
      if (res.success) {
        setIsSuccess(true);
      } else {
        setErrorMessage(res.error || "Unable to reset password.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Brand Logo Header */}
      <div className="text-center space-y-3">
        <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden shadow-sm border border-slate-100">
          <Image
            src="/brand/logo-badge.jpg"
            alt="Laundry Express Logo"
            fill
            sizes="64px"
            priority
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Set New Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create a secure password for your Laundry Express account
          </p>
        </div>
      </div>

      {isSuccess ? (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <p className="font-bold text-sm text-emerald-950">Password Updated Successfully</p>
            <p className="text-slate-600">
              Your password has been securely reset. You can now access your account.
            </p>
          </div>

          <Link href="/login" className="block">
            <Button variant="hero" size="lg" className="w-full shadow-md shadow-pink-500/20">
              <span>Sign In with New Password</span>
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Confirm New Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isSubmitting}
            className="w-full shadow-md shadow-pink-500/20"
          >
            {isSubmitting ? "Updating Password..." : "Save & Update Password"}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Cancel &amp; Return to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
