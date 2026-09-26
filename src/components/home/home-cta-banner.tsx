"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  CreditCard,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBubbles } from "@/components/shared/floating-bubbles";

/**
 * HomeCtaBanner Component
 *
 * High-conversion visual banner positioned above the global footer:
 * - Uses semantic CSS variables and Tailwind tokens (--primary, --primary-dark, --secondary)
 * - Features the official Bubble Hero brand logo badge (/brand/logo-badge.jpg)
 * - Responsive badge pills preventing awkward line breaks across screen sizes
 * - Ambient floating soap bubbles and gentle glowing halos
 * - Strict adherence to the 100-250 lines architectural rule
 */
export function HomeCtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-16 sm:py-20 bg-gradient-to-b from-white to-primary-pale/40 text-white relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Luxury Glassmorphic Card Container */}
        <div className="relative overflow-hidden rounded-3xl bg-black border border-primary/30 shadow-[0_0_50px_var(--primary-ghost)] p-8 sm:p-12 lg:p-14">
          {/* Ambient Floating Soap Bubbles inside banner */}
          <FloatingBubbles variant="banner" className="opacity-75" />

          {/* Ambient Brand Halo lighting behind banner content */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none -z-10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/15 rounded-full blur-3xl pointer-events-none -z-10"
          />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
            {/* Left Value Proposition & Details */}
            <div className="space-y-4 text-center lg:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 border border-primary/30 text-primary-light text-xs font-black uppercase tracking-wider backdrop-blur-md">
                <Zap className="h-3.5 w-3.5 text-primary fill-primary shrink-0" />
                <span className="whitespace-nowrap">Instant Doorstep Laundry Pickup</span>
              </div>

              <h2
                id="cta-heading"
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight text-balance"
              >
                Ready for Clean Clothes{" "}
                <span className="gradient-text whitespace-nowrap">Without Lifting a Finger?</span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal text-pretty">
                Book your pickup in under 2 minutes. Only{" "}
                <strong className="text-white font-black whitespace-nowrap">
                  $32.50 per 13-gallon bag
                </strong>{" "}
                (about 2 loads).{" "}
                <span className="whitespace-nowrap">$10 pickup &amp; delivery</span> — or{" "}
                <strong className="text-primary font-black drop-shadow-[0_0_10px_var(--primary)] whitespace-nowrap">
                  FREE on 2+ bags ($0.00)
                </strong>
                ! We wash, dry, fold, and return fresh to your doorstep.
              </p>

              {/* Guarantees & Features Row 1 — Self-contained non-breaking pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 whitespace-nowrap backdrop-blur-sm">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-medium">Dual Photo Proofs</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 whitespace-nowrap backdrop-blur-sm">
                  <Sparkles className="h-4 w-4 text-primary shrink-0" />
                  <span className="font-medium">Tide &amp; Eco Detergents</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-200 whitespace-nowrap backdrop-blur-sm">
                  <Clock className="h-4 w-4 text-sky-400 shrink-0" />
                  <span className="font-bold text-white">Daily 8am-12pm &amp; 1pm-6pm</span>
                </div>
              </div>

              {/* Guarantees & Features Row 2 — Self-contained non-breaking pills */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-primary-light whitespace-nowrap backdrop-blur-sm">
                  <Zap className="h-3.5 w-3.5 text-primary shrink-0" />
                  <span className="font-medium">24h Express Turnaround</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-slate-300 whitespace-nowrap backdrop-blur-sm">
                  <Lock className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span className="font-medium">Zero-Lost Guarantee</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sky-300 whitespace-nowrap backdrop-blur-sm">
                  <CreditCard className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                  <span className="font-medium">Secure Stripe Checkout</span>
                </div>
              </div>
            </div>

            {/* Right Action Callouts & Brand Logo Badge */}
            <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0 w-full sm:w-auto">
              <Link href="/order" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-black shadow-lg shadow-primary/35 text-base px-8 py-5 h-auto transition-all active:scale-[0.98] whitespace-nowrap"
                >
                  <span>Book Pickup Now</span>
                  <ArrowRight className="h-5 w-5 ml-2 shrink-0 text-white" />
                </Button>
              </Link>

              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 border-white/30 text-sm font-bold transition-all px-8 py-4 h-auto whitespace-nowrap"
                >
                  <span>Compare Plans &amp; Bags</span>
                </Button>
              </Link>

              {/* Official Brand Logo Badge */}
              <div className="pt-1 flex items-center gap-3 bg-white/10 hover:bg-white/15 px-4 py-2 rounded-2xl border border-white/20 backdrop-blur-md transition-all shadow-md group">
                <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-primary/50 shadow-sm shrink-0 group-hover:scale-105 transition-transform bg-white/10">
                  <Image
                    src="/brand/logo-badge.jpg"
                    alt="Laundry Express Official Logo Badge"
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-black text-white tracking-wide leading-tight whitespace-nowrap">
                    Laundry Express™
                  </span>
                  <span className="text-[11px] font-semibold text-primary-light leading-tight whitespace-nowrap">
                    Bubble Hero Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeCtaBanner;
