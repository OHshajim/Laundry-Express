import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBubbles } from "./floating-bubbles";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white pt-10 pb-16 lg:pt-16 lg:pb-24">
      {/* Ambient Floating Mascot Bubbles */}
      <FloatingBubbles variant="hero" />

      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-sky-200/40 via-rose-200/30 to-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Unified Top Animated Badge: Location Highlight + Free Delivery */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-sky-200 shadow-xs text-xs font-medium text-slate-800">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-600" />
              </span>
              <span className="font-bold text-sky-900">
                Lake in the Hills (30-Mile Radius)
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-sky-600 font-extrabold">2+ Bags = FREE Delivery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Superhero Fast{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-rose-600">
                Doorstep Laundry
              </span>{" "}
              Pickup &amp; Delivery.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Skip laundry day. Schedule a morning (8am–12pm) or afternoon (1pm–6pm) window. We wash, fold, and return your clothes fresh to your doorstep with guaranteed photo proof.
            </p>

            {/* Core Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-lg mx-auto lg:mx-0 text-xs">
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">2+ Bags</span>
                <span className="text-slate-500 font-medium">Free Doorstep Delivery</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">Daily Windows</span>
                <span className="text-slate-500 font-medium">8am-12pm &amp; 1pm-6pm</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs text-center sm:text-left">
                <span className="font-bold text-slate-900 block text-sm">Photo Proof</span>
                <span className="text-slate-500 font-medium">Pickup &amp; Drop-off</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-3">
              <Link href="/order" className="w-full sm:w-auto">
                <Button variant="hero" size="lg" className="w-full sm:w-auto shadow-pink-500/25">
                  Schedule Your Pickup
                  <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
                </Button>
              </Link>

              <Link href="/pricing" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Plans &amp; Pricing
                </Button>
              </Link>
            </div>

            {/* Social Trust Bar */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-2.5 text-xs text-slate-500">
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

          {/* Right Mascot Artwork Showcase (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-72 sm:w-88 h-72 sm:h-88 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-tr from-sky-400 via-sky-300 to-rose-300 p-2 group hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/brand/mascot-bubble-hero.jpg"
                alt="Superhero Bubble Mascot for Laundry Express"
                fill
                priority
                sizes="(max-width: 768px) 288px, 352px"
                className="object-cover rounded-2xl"
              />

              {/* Floating Hero Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-sky-100 shadow-lg flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 block">Fast &amp; Spotless</span>
                    <span className="text-[11px] text-slate-500">Pickup to Porch</span>
                  </div>
                </div>
                <span className="font-black text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Ready in 24h
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
