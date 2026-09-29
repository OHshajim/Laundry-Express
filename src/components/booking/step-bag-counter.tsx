import { Plus, Minus, ShoppingBag, Zap, Scale, CheckCircle2 } from "lucide-react";
import type { PricingMode } from "@/types";
import { APP_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StepBagCounterProps {
  pricingMode: PricingMode;
  bagCount: number;
  onBagCountChange: (count: number) => void;
  weightLbs?: number;
  onWeightLbsChange?: (lbs: number) => void;
  bagPrice?: number;
  freeDeliveryBags?: number;
  minLbs?: number;
  maxLbs?: number;
  freeDeliveryLbs?: number;
}

export function StepBagCounter({
  pricingMode,
  bagCount,
  onBagCountChange,
  weightLbs,
  onWeightLbsChange,
  bagPrice = 32.50,
  freeDeliveryBags = 2,
  minLbs = 10,
  maxLbs = 100,
  freeDeliveryLbs = 30,
}: StepBagCounterProps) {
  const currentLbs = weightLbs ?? minLbs;
  const handleLbsChange = (val: number) => {
    onWeightLbsChange?.(val);
  };

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

  if (pricingMode === "per_lb") {
    const isFreePoundDelivery = currentLbs >= freeDeliveryLbs;

    return (
      <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-sky-600" />
            <h5 className="font-bold text-sm text-slate-900">Estimated Laundry Weight (lbs)</h5>
          </div>
          <span className="text-xs font-semibold text-slate-500">Min {minLbs} lbs • Max {maxLbs} lbs</span>
        </div>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min={minLbs}
            max={maxLbs}
            step="1"
            value={currentLbs}
            onChange={(e) => handleLbsChange(parseFloat(e.target.value) || minLbs)}
            className="w-full accent-sky-600 cursor-pointer h-2 bg-slate-100 rounded-lg"
          />
          <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 font-extrabold text-sky-800 text-sm whitespace-nowrap">
            {currentLbs.toFixed(0)} lbs
          </div>
        </div>

        <div className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
          isFreePoundDelivery ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-slate-50 border-slate-200 text-slate-600"
        }`}>
          <span>
            {isFreePoundDelivery
              ? `🎉 Awesome! Orders ${freeDeliveryLbs}+ lbs qualify for 100% FREE delivery.`
              : `Add ${freeDeliveryLbs - currentLbs} more lbs to unlock FREE delivery!`}
          </span>
          <span className="font-black">{isFreePoundDelivery ? "FREE ($0.00)" : "Std Fee"}</span>
        </div>

        <p className="text-xs text-slate-500">
          ℹ️ Our driver will weigh your laundry on a calibrated digital scale at pickup to verify final intake weight.
        </p>
      </div>
    );
  }

  // per_bag mode
  const isFreeDelivery = bagCount >= freeDeliveryBags;

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center justify-between">
        <div>
          <h5 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-sky-600" />
            Select Laundry Bags
          </h5>
          <p className="text-xs text-slate-500 mt-0.5">${bagPrice.toFixed(2)} per 13-gallon bag (about 2 loads)</p>
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
        <div className="flex items-center gap-2 min-w-0">
          <Zap className="h-4 w-4 text-emerald-600 fill-emerald-600 shrink-0" />
          {isFreeDelivery ? (
            <span className="leading-snug">
              <strong>Free Delivery Qualified!</strong> Orders with {freeDeliveryBags}+ bags qualify for <strong>$0.00 delivery</strong>.
            </span>
          ) : (
            <span className="leading-snug">
              Standard delivery fee applies. Add {Math.max(1, freeDeliveryBags - bagCount)} more bag to unlock <strong>Free Delivery ($0.00)</strong>!
            </span>
          )}
        </div>

        {!isFreeDelivery && (
          <button
            type="button"
            onClick={() => onBagCountChange(freeDeliveryBags)}
            className="text-xs font-bold text-sky-700 underline hover:text-sky-900 shrink-0 ml-2 whitespace-nowrap cursor-pointer"
          >
            + Add Bag
          </button>
        )}
      </div>
    </div>
  );
}
