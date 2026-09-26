import { Plus, Minus, ShoppingBag, Zap, Scale, CheckCircle2 } from "lucide-react";
import type { PricingMode } from "@/types";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StepBagCounterProps {
  pricingMode: PricingMode;
  bagCount: number;
  onBagCountChange: (count: number) => void;
  weightKg: number;
  onWeightKgChange: (kg: number) => void;
}

export function StepBagCounter({
  pricingMode,
  bagCount,
  onBagCountChange,
  weightKg,
  onWeightKgChange,
}: StepBagCounterProps) {
  if (pricingMode === "package") {
    return (
      <div className="p-5 rounded-2xl bg-sky-50 border border-sky-100 flex items-center gap-3">
        <CheckCircle2 className="h-6 w-6 text-sky-600 shrink-0" />
        <div>
          <h5 className="text-sm font-bold text-slate-900">Pre-Paid Package Credit Active</h5>
          <p className="text-xs text-slate-600 mt-0.5">
            1 bag/credit will be automatically deducted from your account balance upon completed pickup.
          </p>
        </div>
      </div>
    );
  }

  if (pricingMode === "per_kg") {
    return (
      <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-sky-600" />
            <h5 className="font-bold text-sm text-slate-900">Estimated Laundry Weight (KG)</h5>
          </div>
          <span className="text-xs font-semibold text-slate-500">Min 5.0 KG</span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min="5"
            max="40"
            step="0.5"
            value={weightKg}
            onChange={(e) => onWeightKgChange(parseFloat(e.target.value))}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 font-extrabold text-sky-800 text-sm whitespace-nowrap">
            {weightKg.toFixed(1)} KG
          </div>
        </div>

        <p className="text-xs text-slate-500">
          ℹ️ Our driver will weigh your laundry on a calibrated portable scale at pickup to verify final weight.
        </p>
      </div>
    );
  }

  // per_bag mode
  const isFreeDelivery = bagCount >= APP_CONFIG.pricing.freeDeliveryThresholdBags;

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-sky-600" />
            Select Laundry Bags
          </h5>
          <p className="text-xs text-slate-500 mt-0.5">$32.50 per 13-gallon bag (about 2 loads)</p>
        </div>

        {/* Quantity Stepper */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onBagCountChange(Math.max(1, bagCount - 1))}
            disabled={bagCount <= 1}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-40 transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>

          <span className="font-extrabold text-lg text-slate-900 w-8 text-center">
            {bagCount}
          </span>

          <button
            type="button"
            onClick={() => onBagCountChange(bagCount + 1)}
            className="h-9 w-9 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Free Delivery Trigger Banner */}
      <div
        className={cn(
          "p-3 rounded-xl border text-xs flex items-center justify-between transition-colors",
          isFreeDelivery
            ? "bg-emerald-50 border-emerald-200 text-emerald-800"
            : "bg-amber-50 border-amber-200 text-amber-800"
        )}
      >
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-rose-500 fill-rose-500 shrink-0" />
          {isFreeDelivery ? (
            <span>
              <strong>Superhero Bonus Unlocked!</strong> You have 2+ bags — Delivery is <strong>100% FREE ($0.00)</strong>!
            </span>
          ) : (
            <span>
              <strong>1 Bag Delivery Fee is $10.00.</strong> Add 1 more bag to unlock <strong>FREE Delivery ($0.00)</strong>!
            </span>
          )}
        </div>

        {!isFreeDelivery && (
          <button
            type="button"
            onClick={() => onBagCountChange(2)}
            className="text-xs font-bold text-sky-700 underline hover:text-sky-900 shrink-0 ml-2"
          >
            + Add Bag
          </button>
        )}
      </div>
    </div>
  );
}
