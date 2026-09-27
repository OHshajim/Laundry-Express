"use client";

import * as React from "react";
import { Sparkles, Check, ThermometerSnowflake, Flame, SunMedium } from "lucide-react";
import { DEFAULT_DETERGENTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { DetergentItem } from "@/lib/services/catalog-service";

interface StepDetergentProps {
  selectedDetergentId: string;
  onSelectDetergent: (id: string) => void;
  selectedTemp?: "cold" | "warm" | "hot";
  onSelectTemp?: (temp: "cold" | "warm" | "hot") => void;
}

export function StepDetergent({
  selectedDetergentId,
  onSelectDetergent,
  selectedTemp = "cold",
  onSelectTemp,
}: StepDetergentProps) {
  const [detergents, setDetergents] = React.useState<DetergentItem[]>(DEFAULT_DETERGENTS as unknown as DetergentItem[]);

  React.useEffect(() => {
    fetch("/api/catalog")
      .then((res) => res.json())
      .then((data) => {
        if (data.detergents && data.detergents.length > 0) {
          setDetergents(data.detergents.filter((d: DetergentItem) => d.is_active));
        }
      })
      .catch(() => {});
  }, []);

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
          <h5 className="font-bold text-sm text-slate-900">Step 2: Wash Detergent &amp; Temperature</h5>
        </div>
        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
          All Formulas Included
        </span>
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Choose Your Detergent Formula
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    ? "border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{detergent.name}</span>
                    {isSelected && <Check className="h-4 w-4 text-sky-600" />}
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
      </div>

      <div className="space-y-2 pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Wash Temperature Selection
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {temps.map((temp) => {
            const isSelected = selectedTemp === temp.id;
            const Icon = temp.icon;
            return (
              <button
                key={temp.id}
                type="button"
                onClick={() => onSelectTemp?.(temp.id)}
                className={cn(
                  "p-3 rounded-xl border text-left transition-all relative cursor-pointer",
                  isSelected
                    ? "border-sky-500 bg-sky-50/40 ring-2 ring-sky-500/20"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={cn("h-4 w-4", isSelected ? "text-sky-600" : "text-slate-400")} />
                  <span className="text-xs font-bold text-slate-900">{temp.label}</span>
                </div>
                <p className="text-[11px] text-slate-500">{temp.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
