import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBubbles } from "./floating-bubbles";
import { HeroMascot } from "./hero-mascot";
import { OrderTrackingSummary } from "@/components/home/order-tracking-summary";

/**
 * HeroSection Component
 *
 * Primary landing hero experience featuring:
 * - Solid two-stop linear gradient: Bubble Pink (#FCE7F3) -> Foam White (#FFFFFF)
 * - Animated transparent vector Bubble Hero mascot with gentle bobbing
 * - High-conversion value propositions, bag pricing, and delivery thresholds
 * - Static 4-stage order transparency overview
 */
export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden pt-10 pb-16 lg:pt-14 lg:pb-20"
      style={{ background: "linear-gradient(160deg, #FCE7F3 0%, #FFFFFF 70%)" }}
    >
      {/* Ambient Floating Mascot Bubbles */}
      <FloatingBubbles variant="hero" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Unified Top Animated Badge: Location Highlight + Free Delivery */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 shadow-xs text-xs font-medium text-slate-800">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#EC4899]" />
              </span>
              <span className="font-bold text-slate-900">
                Lake in the Hills &amp; Surrounding (30-Mile Radius)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[#BE185D] font-extrabold">2+ Bags = FREE Delivery</span>
            </div>

            {/* Main Headline & Tagline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.05]">
                Laundry Piling Up?
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black gradient-text tracking-tight">
                Pick Up • Wash • Fold • Deliver
              </p>
            </div>

            {/* Sub-tagline & Value Proposition */}
            <div className="space-y-1 max-w-xl mx-auto lg:mx-0">
              <p className="text-base sm:text-lg font-black text-slate-900">
                More Time For What Matters.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Only <strong className="text-slate-900 font-black">$32.50 per 13-gallon bag</strong> (about 2 loads). <strong className="text-slate-900 font-black">$10 pickup &amp; delivery</strong> — or <strong className="text-[#BE185D] font-black">FREE on 2+ bags</strong>! Serving Lake in the Hills, Algonquin, Crystal Lake, Huntley, Cary, Elgin &amp; Schaumburg (30-mile radius).
              </p>
            </div>

            {/* Core Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 max-w-lg mx-auto lg:mx-0 text-xs">
              <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">$32.50 / Bag</span>
                <span className="text-slate-500 font-medium">About 2 Loads (13-Gal)</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">2+ Bags</span>
                <span className="text-[#BE185D] font-bold">FREE Pickup &amp; Delivery</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-pink-100 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">1 Bag</span>
                <span className="text-slate-500 font-medium">$10 Pickup &amp; Delivery</span>
              </div>
            </div>

            {/* Call to Actions with Pink Primary Color */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link href="/order" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-[#EC4899] hover:bg-[#BE185D] text-white shadow-lg shadow-pink-500/25"
                >
                  Schedule Your Pickup
                  <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                </Button>
              </Link>

              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-slate-300 hover:border-pink-300 hover:bg-pink-50/50"
                >
                  View Plans &amp; Pricing
                </Button>
              </Link>
            </div>

            {/* Social Trust Bar */}
            <div className="pt-1 flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-500">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-amber-400" />
                ))}
              </div>
              <span className="font-semibold text-slate-800">4.9 / 5.0 Rating</span>
              <span className="text-slate-300">•</span>
              <span>10,000+ Clean Bags Delivered</span>
            </div>
          </div>

          {/* Right Mascot Artwork: Transparent Floating Bubble Hero (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <HeroMascot />
          </div>
        </div>

        {/* Static 4-Stage Transparency Summary Graphic */}
        <div className="pt-4">
          <OrderTrackingSummary />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
