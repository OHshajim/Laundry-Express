"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Truck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HowItWorksStep } from "@/components/home/how-it-works-step";
import { SERVICES_DATA, ServiceKey } from "@/lib/how-it-works-data";

const STEP_POSITIONS = ["12.5%", "37.5%", "62.5%", "87.5%"];
const PROGRESS_WIDTHS = ["0%", "33.333%", "66.666%", "100%"];

/**
 * HowItWorksSection Component
 *
 * Interactive delivery journey with mathematically aligned route progress & traveling beacon.
 * Uses semantic CSS variables and Tailwind tokens (--primary, --secondary).
 * Strict adherence to the 100-250 lines rule.
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
    }, 3600);
    return () => clearInterval(interval);
  }, [isPaused, prefersReduced]);

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 bg-gradient-to-b from-white via-primary-pale/20 to-white border-b border-slate-100 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="outline" className="text-primary bg-primary/10 border-primary/20">
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
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap ${isSelected
                    ? "bg-primary text-white shadow-md shadow-primary/25 scale-[1.02]"
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
            <span className="text-primary">{currentService.badge}</span>
          </div>
        </div>

        {/* Animated Connecting Delivery Route Bar: Perfectly aligned with 4-card grid centers */}
        <div className="relative hidden lg:block w-full py-4 select-none">
          {/* Base Inactive Gray Track connecting station 1 (12.5%) to station 4 (87.5%) */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[12.5%] right-[12.5%] h-2.5 bg-slate-100 rounded-full border border-slate-200/70 shadow-inner overflow-hidden">
            {/* Animated Active Route Gradient Fill */}
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 via-pink-400 to-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: PROGRESS_WIDTHS[activeStepIndex] }}
              transition={{ type: "spring", stiffness: 240, damping: 26 }}
            />
          </div>

          {/* 4 Station Waypoint Pins: Exactly matching each card's column center */}
          {STEP_POSITIONS.map((pos, idx) => {
            const isPassed = idx <= activeStepIndex;
            const isCurrent = idx === activeStepIndex;

            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                style={{ left: pos }}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 cursor-pointer focus:outline-hidden group"
                aria-label={`Jump to Step ${idx + 1}`}
              >
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-[11px] font-black transition-all duration-300 ${isCurrent
                    ? "bg-primary text-white ring-4 ring-primary/20 shadow-md scale-110"
                    : isPassed
                      ? "bg-sky-500 text-white shadow-xs"
                      : "bg-white text-slate-400 border-2 border-slate-200 group-hover:border-pink-300"
                    }`}
                >
                  {isPassed && !isCurrent ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : idx + 1}
                </div>
              </button>
            );
          })}

          {/* Traveling Delivery Route Van Beacon: Aligned right over current station */}
          <motion.div
            className="absolute -top-0 z-20 pointer-events-none"
            initial={{ left: STEP_POSITIONS[0] }}
            animate={{ left: STEP_POSITIONS[activeStepIndex] }}
            transition={{ type: "spring", stiffness: 240, damping: 30 }}
            style={{ transform: "translateX(-50%)" }}
          >
            <div className="relative text-white bg-primary p-1.5 rounded-full shadow-lg shadow-primary/40 border-2 border-white flex items-center justify-center">
              <Truck className="h-4 w-4" />
              <span className="absolute -inset-1 rounded-full bg-primary/30 animate-ping -z-10" />
            </div>
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
            <Button variant="hero" size="lg" className="shadow-lg shadow-primary/30">
              <span>Book Your Pickup Today</span>
              <ArrowRight className="h-4 w-4 ml-2 shrink-0" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
