"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { CustomerAuthGate } from "@/components/auth/customer-auth-gate";
import { useAuth } from "@/context/auth-context";
import type { PricingMode } from "@/types";
import { ShieldCheck, Lock, Clock, Truck, Check } from "lucide-react";

/**
 * OrderFlow Component
 *
 * Dedicated order checkout manager enforcing:
 * 1. Synchronized customer authentication via global useAuth()
 * 2. URL search parameters pre-filling (e.g. from /pricing plan selections)
 * 3. Interactive 4-step navigation wizard synced with progress header
 * 4. Strictly between 100-250 lines per architectural rules
 */
export function OrderFlow() {
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [currentStep, setCurrentStep] = React.useState<number>(1);

  const packageParam = searchParams.get("package");
  const modeParam = searchParams.get("mode") as PricingMode | null;
  const initialMode: PricingMode = packageParam
    ? "package"
    : modeParam === "per_kg" || modeParam === "package"
    ? modeParam
    : "per_bag";

  const bagsParam = searchParams.get("bags");
  const initialBagCount = bagsParam ? Math.max(1, parseInt(bagsParam, 10) || 2) : 2;

  const weightParam = searchParams.get("weight");
  const initialWeightKg = weightParam ? Math.max(5, parseFloat(weightParam) || 8) : 8.0;

  const initialPackageId = packageParam || "pkg-saver-5";

  const steps = [
    { num: 1, label: "Plan & Bags" },
    { num: 2, label: "Detergent & Wash" },
    { num: 3, label: "Schedule & Address" },
    { num: 4, label: "Review & Pay" },
  ];

  if (isLoading) {
    return <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />;
  }

  return (
    <div className="space-y-8">
      {/* 1. Mandatory Customer Login Gate */}
      <CustomerAuthGate />

      {/* If customer is not authenticated, show friendly sign in instruction */}
      {!isAuthenticated || !user ? (
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs text-amber-900 max-w-xl mx-auto space-y-2">
          <p className="font-bold">⚠️ Customer Account Required to Schedule Pickup</p>
          <p className="text-slate-600">
            Please sign in above, create an account, or continue with Google to unlock slot booking, address verification, and upfront Stripe checkout.
          </p>
        </div>
      ) : (
        <>
          {/* Interactive Step-by-Step Navigation Bar */}
          <div className="bg-white p-3 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
              {steps.map((st) => {
                const isActive = currentStep === st.num;
                const isCompleted = currentStep > st.num;

                return (
                  <button
                    key={st.num}
                    type="button"
                    onClick={() => {
                      if (isCompleted || isActive) {
                        setCurrentStep(st.num);
                      }
                    }}
                    disabled={!isCompleted && !isActive}
                    className={`flex items-center gap-2 p-2.5 rounded-2xl transition-all text-left ${
                      isActive
                        ? "bg-sky-600 text-white font-extrabold shadow-md ring-2 ring-sky-500/20"
                        : isCompleted
                        ? "bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 cursor-pointer hover:bg-emerald-100"
                        : "bg-slate-50 text-slate-400 font-medium cursor-not-allowed"
                    }`}
                  >
                    <span
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] shrink-0 font-extrabold ${
                        isActive
                          ? "bg-white text-sky-700"
                          : isCompleted
                          ? "bg-emerald-600 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : st.num}
                    </span>
                    <span className="truncate">{st.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progressive 4-Step Booking Wizard */}
          <BookingWizard
            initialMode={initialMode}
            initialBagCount={initialBagCount}
            initialWeightKg={initialWeightKg}
            initialPackageId={initialPackageId}
            currentUser={user}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </>
      )}

      {/* Operational Trust & Security Badges */}
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
