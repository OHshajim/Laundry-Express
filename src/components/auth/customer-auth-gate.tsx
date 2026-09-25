"use client";

import * as React from "react";
import { UserCheck, LogIn, UserPlus, ShieldCheck, Sparkles, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { User } from "@/types";

interface CustomerAuthGateProps {
  currentUser: User | null;
  onLogin: (user: User) => void;
  onLogout: () => void;
}

/**
 * CustomerAuthGate Component
 *
 * Enforces mandatory customer authentication before placing laundry orders.
 * Provides standard sign-in, account creation, and instant one-click demo profiles.
 */
export function CustomerAuthGate({
  currentUser,
  onLogin,
  onLogout,
}: CustomerAuthGateProps) {
  const [authMode, setAuthMode] = React.useState<"login" | "register">("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [errorMsg, setErrorMsg] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    const user: User = {
      id: `u-${Date.now()}`,
      email: email.trim().toLowerCase(),
      full_name: authMode === "register" ? fullName || "New Customer" : "Registered Customer",
      role: "customer",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onLogin(user);
    setErrorMsg("");
  };

  const handleQuickDemo = (name: string, emailAddr: string) => {
    const user: User = {
      id: `u-demo-${Date.now()}`,
      email: emailAddr,
      full_name: name,
      role: "customer",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    onLogin(user);
    setErrorMsg("");
  };

  // If customer is already authenticated, show status bar with sign-out option
  if (currentUser) {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
            <UserCheck className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-slate-900">{currentUser.full_name}</span>
              <Badge variant="success" className="text-[10px] py-0 px-1.5">
                Logged In Customer
              </Badge>
            </div>
            <span className="text-slate-500 text-[11px]">{currentUser.email}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 font-semibold cursor-pointer transition-colors"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Sign Out / Switch User</span>
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
        <h3 className="text-2xl font-black text-slate-900">
          Customer Sign-In Required
        </h3>
        <p className="text-xs text-slate-500">
          Please log in or create an account to schedule your laundry pickup.
        </p>
      </div>

      {/* Segmented Auth Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs mx-auto text-xs font-bold">
        <button
          type="button"
          onClick={() => setAuthMode("login")}
          className={`flex-1 py-2 rounded-lg transition-all ${
            authMode === "login" ? "bg-white text-sky-700 shadow-xs" : "text-slate-500"
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setAuthMode("register")}
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

      {/* Sign In / Sign Up Form */}
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
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
            />
          </div>
        )}

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Email Address *</label>
          <input
            type="email"
            required
            placeholder="sarah@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
          />
        </div>

        <div>
          <label className="block font-bold text-slate-700 uppercase mb-1">Password *</label>
          <input
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-medium"
          />
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full shadow-md">
          {authMode === "login" ? (
            <>
              <LogIn className="h-4 w-4 mr-1.5" />
              <span>Sign In &amp; Continue Order</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4 mr-1.5" />
              <span>Create Account &amp; Order</span>
            </>
          )}
        </Button>
      </form>

      {/* Fast One-Click Demo Logins for Instant Testing */}
      <div className="pt-4 border-t border-slate-100 space-y-2">
        <span className="text-[11px] font-bold text-slate-400 block text-center uppercase tracking-wide">
          One-Click Demo Profiles (Instant Test)
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo("Sarah Jenkins", "sarah@example.com")}
            className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-left text-xs transition-colors cursor-pointer"
          >
            <span className="font-bold text-sky-900 block">Sarah Jenkins</span>
            <span className="text-[10px] text-sky-600">Existing Customer</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemo("Marcus Rodriguez", "marcus@example.com")}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-left text-xs transition-colors cursor-pointer"
          >
            <span className="font-bold text-slate-900 block">Marcus Rodriguez</span>
            <span className="text-[10px] text-slate-500">1-Bag Customer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
