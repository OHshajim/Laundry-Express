"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft, AlertCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";

/**
 * AdminAuthGuard Component
 *
 * Professional role-based authorization guard for administrative operations:
 * - Simple and secure role checking (user.role === "admin")
 * - Dedicated staff credentials login form
 * - Clear warning and switch button for customer sessions
 * - Strictly complies with the 100-250 lines rule
 */
export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, login, logout, isLoading } = useAuth();

  const [email, setEmail] = React.useState("admin@laundryexpress.com");
  const [password, setPassword] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // If loading session state, show clean skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="h-48 w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-sm animate-pulse" />
      </div>
    );
  }

  // If authenticated as an administrator, grant immediate access
  if (isAdmin && user) {
    return <>{children}</>;
  }

  // Handle Admin Credentials Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Invalid staff credentials.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Navigation Header */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Site</span>
        </Link>
        <span className="text-[11px] font-black uppercase text-primary tracking-wider flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5" />
          Admin Portal
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl space-y-6">
        {user && !isAdmin ? (
          /* User is logged in, but has customer role */
          <div className="text-center space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-900">Administrator Access Required</h2>
              <p className="text-xs text-slate-500">
                You are currently signed in as <strong>{user.full_name}</strong> ({user.email}), which is a customer account.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Please sign out to authenticate with an authorized operations staff profile.
            </div>
            <Button
              variant="hero"
              className="w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              <span>Sign Out &amp; Switch Account</span>
            </Button>
          </div>
        ) : (
          /* Admin credentials login */
          <>
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Operations Staff Sign-In
              </h2>
              <p className="text-xs text-slate-500">
                Restricted portal for laundry dispatch and operations management.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Staff Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="admin@laundryexpress.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Access Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2.5 rounded-xl transition-all shadow-md"
              >
                {isSubmitting ? "Authenticating..." : "Authenticate Staff Session"}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
