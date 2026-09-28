"use client";

import * as React from "react";
import { Sparkles, Check, Droplets, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DetergentItem } from "@/lib/services/catalog-service";

interface StepDetergentProps {
  selectedDetergentId: string;
  onSelectDetergent: (id: string) => void;
  selectedTemp?: string;
  onSelectTemp?: (temp: string) => void;
}

export function StepDetergent({
  selectedDetergentId,
  onSelectDetergent,
}: StepDetergentProps) {
  const [detergents, setDetergents] = React.useState<DetergentItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.detergents)) {
          const activeList = data.detergents.filter((d: DetergentItem) => d.is_active !== false);
          setDetergents(activeList);
          if (activeList.length > 0 && !selectedDetergentId) {
            onSelectDetergent(activeList[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h5 className="font-bold text-sm text-slate-900">Step 2: Wash Detergent Formulation</h5>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          All Formulas Included
        </span>
      </div>

      {/* Cold Water Standard Assurance */}
      <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/80 flex items-start gap-3 text-xs">
        <Droplets className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-black text-sky-950 block">Standard 100% Cold Water Eco-Wash</span>
          <p className="text-[11px] text-sky-800 leading-relaxed">
            All laundry is sanitized using professional cold-water cycles to preserve fiber elasticity, lock in vibrant colors, and prevent fabric shrinkage.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Choose Your Detergent Formula
        </label>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-pulse">
            <div className="h-20 rounded-xl bg-slate-100" />
            <div className="h-20 rounded-xl bg-slate-100" />
          </div>
        ) : detergents.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center">
            Standard Eco Detergent included automatically.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {detergents.map((detergent) => {
              const isSelected = selectedDetergentId === detergent.id;
              return (
                <button
                  key={detergent.id}
                  type="button"
                  onClick={() => onSelectDetergent(detergent.id)}
                  className={cn(
                    "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between cursor-pointer",
                    isSelected
                      ? "border-primary bg-pink-50/40 ring-2 ring-primary/20"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{detergent.name}</span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">{detergent.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-2 block uppercase tracking-wider">
                    {detergent.brand} • {detergent.type}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
