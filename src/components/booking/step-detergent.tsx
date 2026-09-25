"use client";

import * as React from "react";
import { Sparkles, Check, ThermometerSnowflake, ShieldCheck, Leaf } from "lucide-react";
import { DEFAULT_DETERGENTS } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";

interface StepDetergentProps {
  selectedDetergentId: string;
  onSelectDetergent: (id: string) => void;
}

/**
 * StepDetergent Component
 *
 * Second step in the laundry booking flow.
 * Allows customer to dynamically choose their detergent formulation and wash temperature.
 */
export function StepDetergent({
  selectedDetergentId,
  onSelectDetergent,
}: StepDetergentProps) {
  const [washTemp, setWashTemp] = React.useState<"cold" | "warm">("cold");

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-600" />
          <h5 className="font-bold text-sm text-slate-900">
            Step 2: Wash Detergent &amp; Temperature
          </h5>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Included In Plan
        </span>
      </div>

      {/* Detergent Options Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEFAULT_DETERGENTS.map((detergent) => {
          const isSelected = selectedDetergentId === detergent.id;
          return (
            <button
              key={detergent.id}
              type="button"
              onClick={() => onSelectDetergent(detergent.id)}
              className={cn(
                "p-3.5 rounded-2xl border-2 text-left transition-all duration-150 flex items-start justify-between cursor-pointer",
                isSelected
                  ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              )}
            >
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-slate-900">
                    {detergent.name}
                  </span>
                  {detergent.price_adjustment > 0 ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                      +{formatCurrency(detergent.price_adjustment)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                      FREE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {detergent.description}
                </p>
              </div>

              <span
                className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                  isSelected
                    ? "bg-sky-600 border-sky-600 text-white"
                    : "border-slate-300 bg-white"
                )}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </span>
            </button>
          );
        })}
      </div>

      {/* Wash Temperature Cycle Selection */}
      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="font-bold text-slate-700 flex items-center gap-1.5">
          <ThermometerSnowflake className="h-4 w-4 text-sky-600" />
          <span>Water Temperature Preference:</span>
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWashTemp("cold")}
            className={cn(
              "px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer",
              washTemp === "cold"
                ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            Cold Wash (Eco &amp; Color Safe)
          </button>
          <button
            type="button"
            onClick={() => setWashTemp("warm")}
            className={cn(
              "px-3 py-1.5 rounded-xl border font-bold transition-all cursor-pointer",
              washTemp === "warm"
                ? "bg-sky-600 text-white border-sky-600 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            )}
          >
            Warm Wash (Sanitize)
          </button>
        </div>
      </div>
    </div>
  );
}
