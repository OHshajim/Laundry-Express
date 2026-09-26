"use client";

import * as React from "react";
import { Sparkles, Check, ThermometerSnowflake, Flame, SunMedium } from "lucide-react";
import { DEFAULT_DETERGENTS } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";

interface StepDetergentProps {
  selectedDetergentId: string;
  onSelectDetergent: (id: string) => void;
  selectedTemperature?: "cold" | "warm" | "hot";
  onSelectTemperature?: (temp: "cold" | "warm" | "hot") => void;
}

/**
 * StepDetergent Component
 * Implements AGENTS.md 4.d:
 * - Detergent selection (Tide, Seventh Generation Eco, All Free & Clear)
 * - Wash Temperature selection (Cold, Warm, Hot)
 */
export function StepDetergent({
  selectedDetergentId,
  onSelectDetergent,
  selectedTemperature = "cold",
  onSelectTemperature,
}: StepDetergentProps) {
  const temps = [
    { id: "cold" as const, label: "Cold Wash", desc: "Gentle on fabrics, eco-saver", icon: ThermometerSnowflake },
    { id: "warm" as const, label: "Warm Wash", desc: "Balanced everyday wash", icon: SunMedium },
    { id: "hot" as const, label: "Hot Wash", desc: "Deep sanitization for towels & whites", icon: Flame },
  ];

  return (
    <div className="space-y-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h5 className="font-bold text-sm text-slate-900">
            Step 2: Wash Detergent &amp; Temperature
          </h5>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          All Detergents Included
        </span>
      </div>

      {/* Detergent Options Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Choose Your Detergent Formula
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEFAULT_DETERGENTS.map((detergent) => {
            const isSelected = selectedDetergentId === detergent.id;
            return (
              <button
                key={detergent.id}
                type="button"
                onClick={() => onSelectDetergent(detergent.id)}
                className={cn(
                  "p-3.5 rounded-xl border-2 text-left transition-all flex flex-col justify-between cursor-pointer",
                  isSelected
                    ? "border-primary bg-pink-50/50 ring-2 ring-primary/20 shadow-xs"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-slate-900">{detergent.name}</span>
                    <span
                      className={cn(
                        "h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ml-1",
                        isSelected ? "bg-primary border-primary text-white" : "border-slate-300"
                      )}
                    >
                      {isSelected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{detergent.description}</p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] font-bold text-emerald-700">
                  {detergent.price_adjustment > 0 ? `+${formatCurrency(detergent.price_adjustment)}` : "FREE with plan"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wash Temperature Cycle Selection */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Choose Wash Temperature
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {temps.map((t) => {
            const isSelected = selectedTemperature === t.id;
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onSelectTemperature?.(t.id)}
                className={cn(
                  "p-3 rounded-xl border-2 text-left flex items-center gap-2.5 transition-all cursor-pointer",
                  isSelected
                    ? "border-primary bg-pink-50/50 ring-2 ring-primary/20 shadow-xs font-bold"
                    : "border-slate-200 bg-white hover:border-slate-300"
                )}
              >
                <div className={cn("p-1.5 rounded-lg shrink-0", isSelected ? "bg-pink-100 text-primary" : "bg-slate-100 text-slate-600")}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-900 block font-bold">{t.label}</span>
                  <span className="text-[10px] text-slate-500 block">{t.desc}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
