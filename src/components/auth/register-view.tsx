"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, Eye, EyeOff, Globe, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

/**
 * RegisterView Component
 *
 * Distinct, simple registration interface for new Laundry Express customers:
 * - Prominent brand badge header with welcoming onboarding copy
 * - One-click NextAuth Google registration
 * - Clean structured form: Name, Email, Phone, Password, and Confirmation
 * - Strictly complies with the 100-250 lines architectural rule
 */
export function RegisterView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const { register, loginWithGoogle, isAuthenticated, user, isAdmin } = useAuth();

  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated && user) {
      router.push(redirectPath || (isAdmin ? "/admin" : "/dashboard"));
    }
  }, [isAuthenticated, user, isAdmin, redirectPath, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match. Please verify.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await register({
        fullName: fullName.trim() || "Valued Customer",
        email: email.trim().toLowerCase(),
        password,
        phone: phone.trim() || undefined,
      });

      if (!res.success) {
        setErrorMsg(res.error || "Account registration could not be completed.");
        setIsSubmitting(false);
        return;
      }
      router.push(redirectPath || "/dashboard");
    } catch {
      setErrorMsg("An unexpected registration error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg("");
    setIsGoogleLoading(true);
    try {
      const res = await loginWithGoogle();
      if (!res.success) setErrorMsg(res.error || "Google authentication was not completed.");
    } catch {
      setErrorMsg("Unable to connect to Google service.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      {/* Brand Header */}
      <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="relative h-14 w-14 rounded-2xl overflow-hidden shadow-xs border border-slate-100 shrink-0">
          <Image
            src="/brand/logo-badge.jpg"
            alt="Laundry Express Logo"
            fill
            sizes="56px"
            priority
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Create Your Account</h1>
          <p className="text-xs text-slate-500 mt-0.5">24h doorstep laundry service • Free delivery on 2+ bags</p>
        </div>
      </div>

      {/* Google OAuth Button via NextAuth */}
      <button
        type="button"
        onClick={handleGoogleSignUp}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs disabled:opacity-50"
      >
        <Globe className="h-4 w-4 text-sky-600" />
        <span>{isGoogleLoading ? "Connecting to Google..." : "Sign up with Google"}</span>
      </button>

      {/* Visual Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
          Or register with email
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Full Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Sarah Jenkins"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Phone Number (optional)</label>
          <input
            type="tel"
            placeholder="e.g. 815-575-9536"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Password *</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Min 6 chars"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 pr-8 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">Confirm Password *</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
        <Button
          type="submit"
          variant="hero"
          size="lg"
          disabled={isSubmitting || isGoogleLoading}
          className="w-full shadow-md shadow-pink-500/20 mt-2"
        >
          <UserPlus className="h-4 w-4 mr-1.5" />
          <span>{isSubmitting ? "Creating Account..." : "Create Account & Continue"}</span>
        </Button>
      </form>

      {/* Switch to Login */}
      <div className="pt-2 text-center border-t border-slate-100 text-xs text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="font-bold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
