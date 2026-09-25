import { Sparkles, Check } from "lucide-react";
import { DEFAULT_DETERGENTS } from "@/lib/constants";
import { formatCurrency, cn } from "@/lib/utils";

interface StepDetergentProps {
  selectedDetergentId: string;
  onSelectDetergent: (id: string) => void;
}

export function StepDetergent({
  selectedDetergentId,
  onSelectDetergent,
}: StepDetergentProps) {
  return (
    <div className="space-y-3 p-5 rounded-2xl bg-white border border-slate-200">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-sky-600" />
        <h5 className="font-bold text-sm text-slate-900">Choose Wash Detergent Formula</h5>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {DEFAULT_DETERGENTS.map((detergent) => {
          const isSelected = selectedDetergentId === detergent.id;
          return (
            <button
              key={detergent.id}
              type="button"
              onClick={() => onSelectDetergent(detergent.id)}
              className={cn(
                "p-3.5 rounded-xl border-2 text-left transition-all duration-150 flex items-start justify-between",
                isSelected
                  ? "border-sky-600 bg-sky-50/60 ring-2 ring-sky-500/20 shadow-xs"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50"
              )}
            >
              <div className="pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{detergent.name}</span>
                  {detergent.price_adjustment > 0 ? (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                      +{formatCurrency(detergent.price_adjustment)}
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                      Included
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1">{detergent.description}</p>
              </div>

              <span
                className={cn(
                  "h-5 w-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                  isSelected ? "bg-sky-600 border-sky-600 text-white" : "border-slate-300 bg-white"
                )}
              >
                {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
