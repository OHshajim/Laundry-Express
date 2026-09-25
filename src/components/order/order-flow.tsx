"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { CustomerAuthGate } from "@/components/auth/customer-auth-gate";
import type { PricingMode, User } from "@/types";
import { ShieldCheck, Lock, Sparkles, Clock, Truck } from "lucide-react";

/**
 * OrderFlow Component
 *
 * Dedicated order checkout manager enforcing:
 * 1. Mandatory customer authentication (sign in or account creation required before ordering)
 * 2. URL search parameters pre-filling (e.g. from /pricing plan selections)
 * 3. Upfront Stripe checkout before booking confirmation
 */
export function OrderFlow() {
  const searchParams = useSearchParams();

  const [currentUser, setCurrentUser] = React.useState<User | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("lx_customer_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      // Ignore storage errors
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("lx_customer_user", JSON.stringify(user));
    } catch {
      // Ignore storage errors
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("lx_customer_user");
    } catch {
      // Ignore storage errors
    }
  };

  const modeParam = searchParams.get("mode") as PricingMode | null;
  const initialMode: PricingMode =
    modeParam === "per_kg" || modeParam === "package" ? modeParam : "per_bag";

  const bagsParam = searchParams.get("bags");
  const initialBagCount = bagsParam ? Math.max(1, parseInt(bagsParam, 10) || 2) : 2;

  const weightParam = searchParams.get("weight");
  const initialWeightKg = weightParam ? Math.max(5, parseFloat(weightParam) || 8) : 8.0;

  const packageParam = searchParams.get("package") || "pkg-saver-5";

  if (!authChecked) {
    return <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Mandatory Customer Login Gate */}
      <CustomerAuthGate
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* If customer is not authenticated, halt ordering until sign in */}
      {!currentUser ? (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 max-w-xl mx-auto space-y-2">
          <p className="font-bold">⚠️ Customer Account Required to Schedule Pickup</p>
          <p className="text-slate-600">
            Please sign in above or use one of our quick one-click demo customer profiles to unlock slot booking, address verification, and upfront Stripe checkout.
          </p>
        </div>
      ) : (
        <>
          {/* Visual Step Progress Bar */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-sky-50 text-sky-800 font-bold border border-sky-100">
                <span className="h-6 w-6 rounded-full bg-sky-600 text-white flex items-center justify-center text-[11px] shrink-0 font-extrabold">
                  1
                </span>
                <span>Plan &amp; Bags</span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
                <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] shrink-0 font-bold">
                  2
                </span>
                <span>Detergent Choice</span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
                <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] shrink-0 font-bold">
                  3
                </span>
                <span>Slot &amp; Presence</span>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 text-slate-700 font-medium">
                <span className="h-6 w-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[11px] shrink-0 font-bold">
                  4
                </span>
                <span>Stripe Upfront Pay</span>
              </div>
            </div>
          </div>

          {/* Booking Form & Live Summary */}
          <BookingWizard
            initialMode={initialMode}
            initialBagCount={initialBagCount}
            initialWeightKg={initialWeightKg}
            initialPackageId={packageParam}
            currentUser={currentUser}
          />
        </>
      )}

      {/* Security & Operational Assurances Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Encrypted Stripe Checkout</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Cards, Apple Pay, &amp; Google Pay securely processed with 256-bit encryption.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Strict Operating Windows</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Pickup &amp; delivery strictly between 8am–12pm or 1pm–6pm daily.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Free Delivery on 2+ Bags</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              1 Bag = $10.00 fee. 2 or more bags = $0.00 delivery fee automatically applied.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
