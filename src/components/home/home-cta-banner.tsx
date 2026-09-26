import * as React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotBadge } from "@/components/shared/mascot-badge";
import { FloatingBubbles } from "@/components/shared/floating-bubbles";

/**
 * HomeCtaBanner Component
 *
 * Full-width, high-conversion visual banner positioned above the global footer.
 * Features Deep Hero Blue (#1E88C7), Hero Amber (#F5A623), and Cape Red (#D63A3A) accents.
 *
 * Fully responsive across mobile, tablet, and desktop:
 * - Anti-overflow button layouts
 * - Guaranteed contrast on hover
 * - Minimal decorative iconography
 */
export function HomeCtaBanner() {
  return (
    <section
      aria-labelledby="cta-heading"
      className="py-16 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden"
    >
      {/* Ambient Floating Mascot Bubbles */}
      <FloatingBubbles variant="banner" />

      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-white/10 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl">
          <div className="space-y-4 text-center lg:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <Zap className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              <span>Instant Doorstep Laundry Pickup</span>
            </div>

            <h2
              id="cta-heading"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
            >
              Ready for Clean Clothes Without Lifting a Finger?
            </h2>

            <p className="text-sm sm:text-base text-sky-100 leading-relaxed font-normal">
              Book your pickup in under 2 minutes. Only{" "}
              <strong>$32.50 per 13-gallon bag (about 2 loads)</strong>. $10 pickup &amp; delivery — or{" "}
              <strong>FREE on 2+ bags ($0.00)</strong>!
              We wash, dry, fold, and return fresh to your doorstep.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs text-sky-100">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-300" />
                <span>Dual Photo Proof Guarantee</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Tide &amp; Eco Detergent Options</span>
              </div>
              <span className="hidden sm:inline">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white">Daily 8am-12pm &amp; 1pm-6pm</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center lg:justify-start gap-4 text-xs text-sky-200">
              <span>⚡ 24-Hour Express Turnaround</span>
              <span>•</span>
              <span>🔒 Zero-Lost-Garment Guarantee</span>
              <span>•</span>
              <span>💳 Secure Stripe Checkout</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 shrink-0 w-full sm:w-auto">
            <Link href="/order" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-[#F5A623] hover:bg-[#e09216] text-[#141B2E] hover:text-[#141B2E] font-black shadow-lg shadow-amber-500/30 text-sm sm:text-base px-8 py-5 h-auto"
              >
                <span>Book Pickup Now</span>
                <ArrowRight className="h-5 w-5 ml-2 shrink-0 text-[#141B2E]" />
              </Button>
            </Link>

            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-slate-900 border-white/40 text-sm font-bold transition-colors"
              >
                <span>Compare Plans &amp; Bags</span>
              </Button>
            </Link>

            <div className="hidden lg:block pt-2">
              <MascotBadge size="sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

