"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

/**
 * ForgotPasswordView Component
 *
 * Dedicated clean password recovery form:
 * - Brand logo header
 * - Email format validation
 * - Dispatches reset request to /api/auth/forgot-password
 * - Confirmation screen with return to login link
 * - Strictly complies with the 100-250 lines architectural rule
 */
export function ForgotPasswordView() {
  const { forgotPassword } = useAuth();
  const [email, setEmail] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const res = await forgotPassword(email);
      if (res.success) {
        setSuccessMessage(
          res.message ||
            "If an account exists for this email, password reset instructions have been dispatched."
        );
      } else {
        setErrorMessage(res.error || "Unable to send password reset request.");
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
            Reset Your Password
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enter your account email to receive secure recovery instructions
          </p>
        </div>
      </div>

      {successMessage ? (
        <div className="space-y-5 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Password Reset Email Sent</span>
            </div>
            <p className="text-slate-600 leading-relaxed">{successMessage}</p>
          </div>

          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Return to Sign In</span>
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
              Account Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 pl-10 rounded-xl border border-slate-200 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Mail className="h-4 w-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <Button
            type="submit"
            variant="hero"
            size="lg"
            disabled={isSubmitting}
            className="w-full shadow-md shadow-pink-500/20"
          >
            {isSubmitting ? "Dispatching Email..." : "Send Reset Instructions"}
          </Button>

          <div className="text-center pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-primary transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Remember password? Back to Sign In</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}
