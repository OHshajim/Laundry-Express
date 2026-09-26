"use client";

import * as React from "react";
import { ShoppingBag, Sparkles, Shirt, Truck, CheckCircle2, Camera } from "lucide-react";

interface JourneyStage {
  id: string;
  step: number;
  label: string;
  actionText: string;
  icon: React.ElementType;
  headline: string;
  description: string;
  proofBadge: string;
  metric: string;
}

const STAGES: JourneyStage[] = [
  {
    step: 1,
    id: "picked",
    label: "Cloth Picked",
    actionText: "Step 1: Doorstep Intake",
    icon: ShoppingBag,
    headline: "Doorstep Bag Pickup & Verification",
    description: "Driver arrives in your selected window. Bag is weighed, barcoded, and pickup photo proof is logged.",
    proofBadge: "Driver Photo Proof Logged",
    metric: "8am–12pm & 1pm–6pm Daily",
  },
  {
    step: 2,
    id: "wash",
    label: "Gentle Wash",
    actionText: "Step 2: Deep Sanitization",
    icon: Sparkles,
    headline: "Eco-Bubble Wash & Custom Detergent",
    description: "Cold-water gentle wash with selected detergent formula. Delicates separated and pre-treated for stains.",
    proofBadge: "Hypoallergenic Cycle Active",
    metric: "100% Color-Safe Sanitized",
  },
  {
    step: 3,
    id: "fold",
    label: "Crisp Fold",
    actionText: "Step 3: Precision Finishing",
    icon: Shirt,
    headline: "Crisp Folding & Quality Inspection",
    description: "Wrinkle-free hand folding, paired socks, and clean sealed packaging ready to place straight into drawers.",
    proofBadge: "Fabric Inspection Cleared",
    metric: "Retail-Crisp Stacked",
  },
  {
    step: 4,
    id: "delivered",
    label: "Delivered",
    actionText: "Step 4: Porch Delivery",
    icon: Truck,
    headline: "Returned Fresh to Your Doorstep",
    description: "24-hour turnaround. Driver drops off your fresh laundry and snaps the drop-off photo proof confirmation.",
    proofBadge: "Drop-off Photo Proof Sent",
    metric: "2+ Bags = 100% Free Delivery",
  },
];

export function ClothJourneyAnimation() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % STAGES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPaused]);

  const current = STAGES[activeStep];
  const CurrentIcon = current.icon;

  return (
    <div
      className="w-full rounded-3xl bg-white/90 backdrop-blur-xl border border-pink-200/80 shadow-[0_0_35px_rgba(233,30,99,0.12)] p-4 sm:p-6 lg:p-7 space-y-6 transition-all"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Header & Live Progress Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-[#E91E63] flex items-center gap-1.5 drop-shadow-[0_0_8px_rgba(233,30,99,0.35)]">
            <span className="h-2 w-2 rounded-full bg-[#E91E63] animate-pulse" />
            Live Express Lifecycle
          </span>
          <h3 className="text-lg font-black text-slate-900 tracking-tight">
            How Your Clothes Travel With Us
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">
            Stage {current.step} of 4
          </span>
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-50 text-[#E91E63] border border-pink-200">
            {current.label}
          </span>
        </div>
      </div>

      {/* 4-Step Interactive Stepper Tracker */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isActive = idx === activeStep;
          const isPassed = idx < activeStep;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={`relative flex items-center gap-2.5 p-3 rounded-2xl text-left transition-all cursor-pointer border ${
                isActive
                  ? "bg-slate-950 text-white border-[#E91E63] shadow-[0_0_18px_rgba(233,30,99,0.35)]"
                  : isPassed
                  ? "bg-pink-50/60 text-slate-800 border-pink-200/70 hover:bg-pink-100/50"
                  : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100"
              }`}
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive
                    ? "bg-[#E91E63] text-white shadow-[0_0_10px_rgba(233,30,99,0.6)]"
                    : isPassed
                    ? "bg-pink-200 text-[#E91E63]"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <span className={`text-[10px] font-bold block ${isActive ? "text-pink-300" : "text-slate-400"}`}>
                  Step {stage.step}
                </span>
                <span className="text-xs font-black truncate block">
                  {stage.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Stage Animated Visual Showcase Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-neutral-900 to-black text-white p-5 sm:p-6 border border-neutral-800 shadow-xl">
        {/* Subtle glowing radial background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#E91E63]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Left Graphic & Animated Icon */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="relative h-18 w-18 rounded-2xl bg-gradient-to-tr from-[#E91E63] to-rose-400 text-white flex items-center justify-center shadow-[0_0_24px_rgba(233,30,99,0.5)] mb-3 animate-bounce">
              <CurrentIcon className="h-9 w-9" />
            </div>
            <span className="text-xs font-bold text-pink-300">
              {current.actionText}
            </span>
            <span className="text-[11px] text-neutral-400 mt-0.5">
              {current.metric}
            </span>
          </div>

          {/* Right Stage Narrative & Live Proof Badge */}
          <div className="md:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/40 text-xs font-bold">
              <Camera className="h-3.5 w-3.5 text-[#E91E63]" />
              <span>{current.proofBadge}</span>
            </div>

            <h4 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {current.headline}
            </h4>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              {current.description}
            </p>

            {/* Micro Badges */}
            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified Standard
              </span>
              <span>•</span>
              <span className="text-neutral-300 font-medium">
                Photo Proof Stored 90 Days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClothJourneyAnimation;
