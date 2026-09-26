"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HowItWorksStep } from "@/components/home/how-it-works-step";
import { SERVICES_DATA, ServiceKey } from "@/lib/how-it-works-data";

/**
 * HowItWorksSection Component
 *
 * Merges the 4-step process and 4 service packages into a single interactive,
 * animated, scroll-driven journey:
 * - One horizontal (vertical on mobile) timeline with 4 stages:
 *   Schedule -> Home/Away Hand-off -> Photo Proof -> Delivered Fresh
 * - Framer Motion animated route progress line with traveling delivery beacon
 * - 4 service categories folded into the same timeline as inline tabs:
 *   [Bag Wash & Fold] [By-the-KG] [Bedding & Delicates] [24h Express]
 * - Large friendly icons and 3-5 word primary labels accessible to all ages
 * - Preserves the bottom conversion CTA strip
 */
export function HowItWorksSection() {
  const [activeService, setActiveService] = React.useState<ServiceKey>("bag");
  const [activeStepIndex, setActiveStepIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const prefersReduced = useReducedMotion();

  const currentService = SERVICES_DATA[activeService];

  // Auto-cycle through the 4 steps along the delivery route on desktop/idle
  React.useEffect(() => {
    if (isPaused || prefersReduced) return;
    const interval = setInterval(() => {
      setActiveStepIndex((prev) => (prev + 1) % 4);
    }, 3400);
    return () => clearInterval(interval);
  }, [isPaused, prefersReduced]);

  const progressPercent = ((activeStepIndex + 1) / 4) * 100;

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-pink-50/20 to-white border-b border-slate-100 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-[#EC4899] bg-pink-50 border-pink-200">
            Simple 4-Step Express Journey
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            How Laundry Express Works
          </h2>
          <p className="text-base sm:text-lg text-slate-600 font-normal">
            From your doorstep to crisp fresh clothes in 24 hours. Effortless, reliable, and photo-verified.
          </p>
        </div>

        {/* Unified Service Filters / Tabs */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-400">
            See this process for:
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 max-w-full">
            {(Object.keys(SERVICES_DATA) as ServiceKey[]).map((key) => {
              const svc = SERVICES_DATA[key];
              const Icon = svc.icon;
              const isSelected = activeService === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setActiveService(key);
                    setActiveStepIndex(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#EC4899] text-white shadow-md shadow-pink-500/25 scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{svc.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Service Inline Price & Delivery Perk */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 pt-0.5">
            <span className="text-slate-900 font-black">{currentService.price}</span>
            <span className="text-slate-300">•</span>
            <span className="text-[#EC4899]">{currentService.badge}</span>
          </div>
        </div>

        {/* Animated Connecting Delivery Route Bar with Traveling Beacon */}
        <div className="relative hidden lg:block max-w-5xl mx-auto px-10">
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-pink-500 to-[#EC4899] rounded-full"
              initial={{ width: "25%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            />
          </div>

          {/* Traveling Delivery Route Van Indicator */}
          <motion.div
            className="absolute -top-3 text-[#EC4899] bg-white p-1 rounded-full shadow-md border border-pink-200"
            initial={{ left: "10%" }}
            animate={{ left: `${Math.min(progressPercent - 3, 94)}%` }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
          >
            <Truck className="h-4 w-4" />
          </motion.div>
        </div>

        {/* 4 Interactive Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {currentService.steps.map((step, idx) => (
            <HowItWorksStep
              key={step.id}
              step={step}
              index={idx}
              isActive={idx === activeStepIndex}
              isCompleted={idx < activeStepIndex}
              onClick={() => setActiveStepIndex(idx)}
            />
          ))}
        </div>

        {/* Bottom Conversion CTA Strip */}
        <div className="text-center pt-4 space-y-3">
          <Link href="/order">
            <Button variant="hero" size="lg" className="shadow-lg shadow-pink-500/30">
              <span>Book Your Pickup Today</span>
              <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </Link>
          <p className="text-xs text-slate-500">
            No subscription required. Book as you need or buy discounted packages.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
