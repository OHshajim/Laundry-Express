import * as React from "react";
import Link from "next/link";
import { CalendarClock, DoorOpen, Camera, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProcessStep {
  step: string;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  note: string;
}

const STEPS: ProcessStep[] = [
  {
    step: "01",
    title: "Schedule Your Window",
    badge: "Strict Time Slots",
    description:
      "Choose from our daily operational pickup slots: 8:00 AM – 12:00 PM or 1:00 PM – 6:00 PM. Pick today, tomorrow, or a future date.",
    icon: CalendarClock,
    note: "No waiting around all day.",
  },
  {
    step: "02",
    title: "Home or Away Hand-off",
    badge: "Contactless Ready",
    description:
      "Specify if you'll be Home or Away. If away, simply confirm your bag is placed safely outside your door before our driver arrives.",
    icon: DoorOpen,
    note: "Presence verification guaranteed.",
  },
  {
    step: "03",
    title: "Instant Photo Proof",
    badge: "100% Transparent",
    description:
      "Our driver snaps a timestamped photo of your bag during pickup. Both you and the operations team see the proof right away.",
    icon: Camera,
    note: "Zero lost or mixed bags.",
  },
  {
    step: "04",
    title: "Delivered Fresh & Folded",
    badge: "24h Turnaround",
    description:
      "Washed with your selected detergent (Tide, Plant Eco, or Hypoallergenic), dried with care, folded crisp, and delivered with drop-off photo proof.",
    icon: Sparkles,
    note: "2+ Bags = FREE delivery!",
  },
];

export function ProcessSection() {
  return (
    <section id="process" className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-sky-700 bg-sky-50 border-sky-200">
            Simple 4-Step Process
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Laundry Express Works
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From your doorstep to crisp fresh clothes in 24 hours. Effortless, reliable, and completely photo-verified.
          </p>
        </div>

        {/* Steps Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.step}
                className="relative bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-sky-600/40">
                      {s.step}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {s.badge}
                    </Badge>
                  </div>

                  <div className="h-12 w-12 rounded-xl bg-white border border-sky-100 flex items-center justify-center text-sky-600 shadow-xs mb-4">
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60">
                  <p className="text-[11px] font-semibold text-sky-700 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                    {s.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Strip */}
        <div className="mt-12 text-center">
          <Link href="/order">
            <Button variant="hero" size="lg" className="shadow-lg shadow-pink-500/25">
              <span>Book Your Pickup Today</span>
              <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </Link>
          <p className="text-xs text-slate-500 mt-2">
            No subscription required. Book as you need or buy discounted packages.
          </p>
        </div>
      </div>
    </section>
  );
}
