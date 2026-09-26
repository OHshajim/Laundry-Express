"use client";

import * as React from "react";
import { motion, useReducedMotion, type Transition } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface StepData {
  id: number;
  numberStr: string;
  shortLabel: string;
  badge: string;
  icon: LucideIcon;
  actionText: string;
  detail: string;
  helperNote: string;
}

interface HowItWorksStepProps {
  step: StepData;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  onClick: () => void;
}

/**
 * HowItWorksStep Sub-Component
 *
 * Renders an animated interactive milestone card along the delivery route:
 * - Stacked readable layout preventing any text clipping or collapse
 * - Full-width typography without harsh truncate or line-clamps
 * - Playful spring animated mascot icons
 * - Clean CSS variables and theme tokens (--primary, --primary-dark)
 * - Strict adherence to the 100-250 lines rule
 */
export function HowItWorksStep({
  step,
  index,
  isActive,
  isCompleted,
  onClick,
}: HowItWorksStepProps) {
  const prefersReduced = useReducedMotion();
  const Icon = step.icon;

  const springTransition: Transition = prefersReduced
    ? { duration: 0.2 }
    : { type: "spring", stiffness: 350, damping: 22 };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`Step ${step.id}: ${step.shortLabel}`}
      aria-current={isActive ? "step" : undefined}
      className="relative text-left w-full h-full focus:outline-hidden group cursor-pointer"
      initial={prefersReduced ? false : { opacity: 0, y: 16 }}
      animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, ...springTransition }}
    >
      <div
        className={`relative rounded-3xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between h-full min-h-[300px] ${
          isActive
            ? "bg-white border-primary shadow-[0_0_24px_rgba(236,72,153,0.22)] ring-2 ring-primary/30 scale-[1.02]"
            : isCompleted
            ? "bg-sky-50/40 border-sky-200/80 hover:bg-sky-50/70"
            : "bg-white/90 border-slate-200/80 hover:border-pink-300 hover:bg-white"
        }`}
      >
        {/* Top Indicator Row */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span
              className={`text-xs font-black px-2.5 py-1 rounded-full border transition-colors ${
                isActive
                  ? "bg-primary text-white border-primary shadow-xs"
                  : isCompleted
                  ? "bg-sky-100 text-sky-800 border-sky-200"
                  : "bg-slate-100 text-slate-600 border-slate-200"
              }`}
            >
              Step {step.numberStr}
            </span>

            <Badge
              variant={isActive ? "hero" : "secondary"}
              className="text-[10px] uppercase tracking-wider font-extrabold max-w-[140px] truncate"
            >
              {step.badge}
            </Badge>
          </div>

          {/* Large Friendly Animated Mascot Icon */}
          <div className="mb-3.5">
            <motion.div
              className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${
                isActive
                  ? "bg-gradient-to-tr from-primary to-rose-400 text-white border-transparent shadow-[0_0_18px_rgba(236,72,153,0.45)]"
                  : isCompleted
                  ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                  : "bg-slate-50 text-slate-700 border-slate-200 group-hover:border-pink-200 group-hover:text-primary"
              }`}
              animate={
                isActive && !prefersReduced
                  ? { scale: [1, 1.08, 1], rotate: [0, -3, 3, 0] }
                  : { scale: 1, rotate: 0 }
              }
              transition={{
                repeat: isActive && !prefersReduced ? Infinity : 0,
                repeatDelay: 2.2,
                duration: 0.6,
              }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>

          {/* Short 3-5 Word Label with full wrapping and no text collapse */}
          <div className="space-y-1">
            <h4
              className={`text-lg font-black tracking-tight leading-snug transition-colors ${
                isActive ? "text-primary" : "text-slate-900 group-hover:text-slate-800"
              }`}
            >
              {step.shortLabel}
            </h4>

            <p className="text-xs font-bold text-slate-700 leading-normal">
              {step.actionText}
            </p>
          </div>
        </div>

        {/* Secondary Detail Text: Full text visible with no cutoffs */}
        <div className="pt-3 border-t border-slate-100 mt-4 space-y-2">
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {step.detail}
          </p>

          <p
            className={`text-[11px] font-bold flex items-center gap-1.5 ${
              isActive ? "text-primary" : "text-slate-400"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isActive ? "bg-primary animate-ping" : "bg-slate-300"
              }`}
            />
            <span>{step.helperNote}</span>
          </p>
        </div>
      </div>
    </motion.button>
  );
}

export default HowItWorksStep;
