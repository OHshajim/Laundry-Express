"use client";

import * as React from "react";
import Image from "next/image";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Heart,
  CheckCircle2,
  Star,
  Award,
} from "lucide-react";

/**
 * HeroMascot Component
 *
 * Visual hero element featuring the "Bubble Hero" mascot:
 * - Uses semantic CSS variables and Tailwind tokens (--primary, --primary-dark, --primary-pale)
 * - Gentle floating & bobbing keyframe animation
 * - Smooth fade + scale entrance on load
 * - Fully responsive: scales down cleanly on mobile without overlapping text
 * - Clean badges highlighting 24h turnaround, fabric care, and photo proof
 * - Strict adherence to the 100-250 lines architectural rule
 */
export function HeroMascot() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-md mx-auto animate-in fade-in zoom-in-95 duration-700 select-none">
      {/* Soft Ambient Halo behind mascot using theme tokens */}
      <div
        aria-hidden="true"
        className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full bg-gradient-to-tr from-primary-pale via-primary-light/25 to-secondary/20 blur-3xl pointer-events-none -z-10 animate-pulse"
      />

      {/* Floating & Bobbing Container */}
      <div className="relative w-72 sm:w-88 h-72 sm:h-88 flex items-center justify-center animate-bubble-wobble">
        {/* Floating Mini Decorative Badge - Top Left */}
        <div
          aria-hidden="true"
          className="absolute -top-2 -left-2 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-primary-pale flex items-center gap-1.5 animate-bounce [animation-duration:3s]"
        >
          <div className="h-6 w-6 rounded-full bg-primary-pale flex items-center justify-center text-primary">
            <Heart className="h-3.5 w-3.5 fill-primary" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 pr-1 whitespace-nowrap">
            Pick Up • Wash
          </span>
        </div>

        {/* Floating Mini Decorative Badge - Top Right */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 -right-10 bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-lg border border-sky-100 flex items-center gap-1.5 animate-bounce [animation-duration:3.6s]"
        >
          <div className="h-6 w-6 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
            <Sparkles className="h-3.5 w-3.5 fill-sky-600" />
          </div>
          <span className="text-[11px] font-bold text-slate-800 pr-1 whitespace-nowrap">
            Fold &amp; Deliver
          </span>
        </div>

        {/* Bubble Hero Mascot Image */}
        <div className="relative w-64 h-64 sm:w-76 sm:h-76 flex items-center justify-center group">
          <Image
            src="/hero.jpg"
            alt="Laundry Express Bubble Hero Mascot"
            width={340}
            height={340}
            priority
            className="w-full h-full object-contain mix-blend-multiply drop-shadow-2xl transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Floating Bubble Hero Badge: 24h & Photo Proof */}
        <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-11/12 max-w-[300px] bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-primary-pale shadow-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-full bg-primary-pale text-primary flex items-center justify-center font-bold shadow-xs">
              <Zap className="h-4 w-4 fill-primary" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 block leading-tight">
                Bubble Hero
              </span>
              <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-600 inline" />
                Spotless &amp; Protected
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[11px] font-black text-primary-dark bg-primary-pale px-2.5 py-0.5 rounded-full border border-primary-pale">
              24h Fast
            </span>
            <span className="text-[9px] text-slate-400 font-semibold mt-0.5 flex items-center gap-0.5">
              <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600 inline" />
              Photo Proof
            </span>
          </div>
        </div>
      </div>

      {/* Trust Micro-Badge below mascot */}
      <div className="mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/60 shadow-xs text-[11px] text-slate-600">
        <Award className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold text-slate-700">100% Satisfaction Guaranteed</span>
        <span className="text-slate-300">•</span>
        <div className="flex items-center gap-0.5 text-amber-500">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-bold text-slate-800">4.9 / 5</span>
        </div>
      </div>
    </div>
  );
}

export default HeroMascot;
