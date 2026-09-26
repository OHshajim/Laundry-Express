"use client";

import * as React from "react";
import Link from "next/link";
import { UserCheck, LogIn, UserPlus, LogOut, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/auth-context";
import type { User } from "@/types";

interface CustomerAuthGateProps {
  currentUser?: User | null;
  onLogin?: (user: User) => void;
  onLogout?: () => void;
}

/**
 * CustomerAuthGate Component
 *
 * Enforces mandatory customer authentication before placing laundry orders:
 * - Credentials login and registration
 * - Google single sign-on option
 * - Synchronized session state with global AuthProvider
 * - Strictly adheres to 100-250 lines rule
 */
export function CustomerAuthGate({
  currentUser,
  onLogin,
  onLogout,
}: CustomerAuthGateProps) {
  const auth = useAuth();
  const effectiveUser = currentUser ?? auth.user;

  const [authMode, setAuthMode] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      if (authMode === "register") {
        const res = await auth.register({
          fullName: fullName.trim() || "Valued Customer",
          email,
          password,
        });
        if (!res.success) {
          setErrorMsg(res.error || "Registration failed. Please try again.");
          setIsSubmitting(false);
          return;
        }
      } else {
        const res = await auth.login(email, password);
        if (!res.success) {
          setErrorMsg(res.error || "Invalid credentials. Please try again.");
          setIsSubmitting(false);
          return;
        }
      }
      if (auth.user && onLogin) onLogin(auth.user);
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg("");
    setIsGoogleLoading(true);
    try {
      const res = await auth.loginWithGoogle();
      if (res.success && auth.user && onLogin) {
        onLogin(auth.user);
      } else if (!res.success) {
        setErrorMsg(res.error || "Google authentication was not completed.");
      }
    } catch {
      setErrorMsg("Unable to connect to Google service.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleSignOut = () => {
    auth.logout();
    if (onLogout) onLogout();
  };

  if (effectiveUser) {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900">{effectiveUser.full_name}</span>
              <Badge variant="success" className="text-[10px] py-0 px-1.5">
                Verified Customer
              </Badge>
            </div>
            <span className="text-slate-500 text-[11px]">{effectiveUser.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out / Switch Profile</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-300 shadow-xl max-w-xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto">
          <LogIn className="h-6 w-6" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">Customer Sign-In Required</h3>
        <p className="text-xs text-slate-500">
          Please log in or create an account to schedule your laundry pickup.
        </p>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isGoogleLoading || isSubmitting}
        className="w-full py-2.5 px-4 rounded-xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
      >
        <Globe className="h-4 w-4 text-sky-600" />
        <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
      </button>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-slate-200 w-full" />
        <span className="bg-white px-3 text-[10px] uppercase font-bold text-slate-400 absolute">
          Or continue with email
        </span>
      </div>

      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs mx-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => { setAuthMode("login"); setErrorMsg(""); }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            authMode === "login" ? "bg-white text-sky-700 shadow-xs" : "text-slate-500"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode("register"); setErrorMsg(""); }}
          className={`flex-1 py-2 rounded-lg transition-all ${
            authMode === "register" ? "bg-white text-sky-700 shadow-xs" : "text-slate-500"
          }`}
        >
          Create Account
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
        {authMode === "register" && (
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sarah Jenkins"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="sarah.jenkins@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block font-bold text-slate-700 uppercase">Password *</label>
            <Link href="/forgot-password" className="text-primary text-[10px] font-bold hover:underline">
              Forgot?
            </Link>
          </div>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <Button type="submit" variant="hero" size="lg" disabled={isSubmitting} className="w-full shadow-md">
          {authMode === "login" ? (
            <>
              <LogIn className="h-4 w-4 mr-1.5" />
              <span>{isSubmitting ? "Authenticating..." : "Sign In & Continue Order"}</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-1.5" />
              <span>{isSubmitting ? "Creating Account..." : "Create Account & Order"}</span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
