"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Sparkles, Shirt, Truck, Camera, ShieldCheck, ArrowRight } from "lucide-react";

interface StepSummary {
  step: number;
  label: string;
  sub: string;
  icon: React.ElementType;
}

const STEPS: StepSummary[] = [
  {
    step: 1,
    label: "Bag Picked",
    sub: "Doorstep custody & barcode logged",
    icon: ShoppingBag,
  },
  {
    step: 2,
    label: "Eco Sanitized",
    sub: "Cold-water cycle & fabric care",
    icon: Sparkles,
  },
  {
    step: 3,
    label: "Crisp Fold",
    sub: "Hand folded & weather-proof sealed",
    icon: Shirt,
  },
  {
    step: 4,
    label: "Returned Fresh",
    sub: "Porch delivery with photo proof",
    icon: Truck,
  },
];

/**
 * OrderTrackingSummary Component
 *
 * Static 4-stage transparency graphic replacing simulated live customer orders on homepage.
 * Captioned: "Every order is tracked from pickup to delivery — see live tracking after you book"
 * Directs active users to authenticate into the real customer dashboard.
 */
export function OrderTrackingSummary() {
  return (
    <div className="w-full max-w-5xl mx-auto rounded-3xl bg-white border border-pink-100 shadow-xl p-6 sm:p-8">
      {/* Top Banner & Official Caption */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-pink-50">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FCE7F3] text-[#BE185D] text-xs font-bold mb-2">
            <Camera className="h-3.5 w-3.5 text-[#EC4899]" />
            <span>Dual Photo Proof Guarantee</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            How Every Order Travels With Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
            Every order is tracked from pickup to delivery — see live tracking after you book
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#EC4899] hover:text-[#BE185D] transition-colors self-start md:self-center"
        >
          <span>Open Customer Dashboard</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* 4-Step Summary Horizontal Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-6">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-pink-50/40 border border-pink-100/60 hover:border-pink-200 transition-all duration-200"
            >
              <div className="h-12 w-12 rounded-2xl bg-white text-[#EC4899] shadow-sm border border-pink-100 flex items-center justify-center font-bold mb-3">
                <Icon className="h-6 w-6 text-[#EC4899]" />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#BE185D]">
                Stage {s.step} of 4
              </span>
              <h3 className="text-sm font-black text-slate-900 mt-0.5">{s.label}</h3>
              <p className="text-[11px] text-slate-500 mt-1 font-normal leading-tight">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Trust Micro-Row with Guarantee Link */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Timestamped driver photos taken at both pickup &amp; delivery</span>
        </div>
        <Link
          href="/terms#guarantee-policy"
          className="font-bold text-[#EC4899] hover:text-[#BE185D] underline underline-offset-2"
        >
          See full guarantee policy →
        </Link>
      </div>
    </div>
  );
}

export default OrderTrackingSummary;
