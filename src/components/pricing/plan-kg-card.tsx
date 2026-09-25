"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, ShieldCheck, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PlanKgCardProps {
  weightKg: number;
  onWeightKgChange: (weight: number) => void;
}

/**
 * PlanKgCard Component
 *
 * Dedicated plan card for weighed laundry by the kilogram ($2.75/KG).
 * Designed for bulky loads, Airbnb hosts, and sports teams.
 */
export function PlanKgCard({ weightKg, onWeightKgChange }: PlanKgCardProps) {
  const kgSubtotal = Math.round(weightKg * 2.75 * 100) / 100;
  const kgDeliveryFee = kgSubtotal >= 40 ? 0.0 : 10.0;
  const kgTotal = kgSubtotal + kgDeliveryFee;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-sky-200 shadow-xl max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 mb-2">
            <Scale className="h-3 w-3" />
            Weighed Precision Intake
          </span>
          <h3 className="text-2xl font-black text-slate-900">By the Kilogram (KG)</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ideal for bulky linens, blankets, salon towels, and commercial loads.
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-3xl font-black text-slate-900">$2.75</span>
          <span className="text-xs text-slate-500 block">per kg (5kg min)</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Estimated Weight:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onWeightKgChange(Math.max(5, weightKg - 2))}
              disabled={weightKg <= 5}
              aria-label="Decrease weight"
              className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-16 text-center text-2xl font-black text-slate-900">
              {weightKg} kg
            </span>
            <button
              type="button"
              onClick={() => onWeightKgChange(Math.min(60, weightKg + 2))}
              disabled={weightKg >= 60}
              aria-label="Increase weight"
              className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500 bg-white p-3 rounded-xl border border-slate-200 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
          <span>We weigh your laundry on certified scales and upload a scale photo proof upon intake.</span>
        </div>
      </div>

      <div className="space-y-2 pt-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>{weightKg} KG Wash &amp; Dry ($2.75/kg):</span>
          <span className="font-semibold text-slate-900">{formatCurrency(kgSubtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Delivery Fee (Free over $40):</span>
          <span className={`font-bold ${kgDeliveryFee === 0 ? "text-emerald-600" : "text-slate-900"}`}>
            {kgDeliveryFee === 0 ? "FREE ($0.00)" : "$10.00"}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
          <span>Estimated Total:</span>
          <span className="text-xl text-sky-600">{formatCurrency(kgTotal)}</span>
        </div>
      </div>

      <Link href={`/order?mode=per_kg&weight=${weightKg}`} className="block">
        <Button variant="hero" size="lg" className="w-full shadow-lg shadow-pink-500/25">
          <span>Continue with {weightKg} KG</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
