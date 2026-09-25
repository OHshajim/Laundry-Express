import { ShoppingBag, Scale, Package, Sparkles } from "lucide-react";
import type { PricingMode } from "@/types";
import { cn } from "@/lib/utils";

interface StepPricingModeProps {
  selectedMode: PricingMode;
  onSelectMode: (mode: PricingMode) => void;
}

export function StepPricingMode({ selectedMode, onSelectMode }: StepPricingModeProps) {
  const modes: Array<{
    id: PricingMode;
    title: string;
    badge: string;
    description: string;
    priceLabel: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      id: "per_bag",
      title: "By the Bag (Most Popular)",
      badge: "2+ Bags = Free Delivery",
      description: "Fill our standard laundry bag. Flat rate per bag. $10 fee for 1 bag, $0 fee for 2+ bags!",
      priceLabel: "$15.00 / bag",
      icon: ShoppingBag,
    },
    {
      id: "per_kg",
      title: "By Weight (Per KG)",
      badge: "Commercial & Bulk",
      description: "Pay purely by weighed volume. Weighed on precision scale at our facility.",
      priceLabel: "$2.75 / KG (5KG min)",
      icon: Scale,
    },
    {
      id: "package",
      title: "Pre-paid Saver Package",
      badge: "Save up to 20%",
      description: "Redeem pre-purchased credits from your active bundle with zero checkout hassle.",
      priceLabel: "Credit Redemption",
      icon: Package,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-amber-500" />
        <h4 className="text-base font-bold text-slate-900">
          Step 1: Choose Your Laundry Service Model
        </h4>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onSelectMode(mode.id)}
              className={cn(
                "relative text-left p-5 rounded-2xl border-2 transition-all duration-200 flex flex-col justify-between",
                isSelected
                  ? "border-sky-600 bg-sky-50/70 shadow-md ring-2 ring-sky-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div
                    className={cn(
                      "p-2.5 rounded-xl",
                      isSelected ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
                      isSelected
                        ? "bg-rose-100 text-rose-700 border-rose-200"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                    )}
                  >
                    {mode.badge}
                  </span>
                </div>

                <h5 className="font-bold text-slate-900 text-sm">{mode.title}</h5>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {mode.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-sm text-sky-700">{mode.priceLabel}</span>
                <span
                  className={cn(
                    "h-4 w-4 rounded-full border flex items-center justify-center",
                    isSelected ? "border-sky-600 bg-sky-600" : "border-slate-300 bg-white"
                  )}
                >
                  {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
