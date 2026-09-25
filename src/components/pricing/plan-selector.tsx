"use client";

import * as React from "react";
import { ShoppingBag, Scale, Gift } from "lucide-react";
import { PlanBagCard } from "./plan-bag-card";
import { PlanKgCard } from "./plan-kg-card";
import { PlanPackagesGrid } from "./plan-packages-grid";

export type PlanCategory = "bag" | "kg" | "package";

/**
 * PlanSelector Component
 *
 * Provides a mobile-native segmented switcher allowing users to choose between:
 * 1. By the Bag (1 Bag = $10 fee, 2+ Bags = FREE)
 * 2. By the KG ($2.75/KG weighed intake)
 * 3. Saver Bundles (Discount pre-paid passes)
 */
export function PlanSelector() {
  const [activeTab, setActiveTab] = React.useState<PlanCategory>("bag");
  const [bagCount, setBagCount] = React.useState<number>(2); // Default to 2 for free delivery
  const [weightKg, setWeightKg] = React.useState<number>(10);

  return (
    <section aria-label="Laundry Plan Selector" className="space-y-8">
      {/* Native-feeling Segmented Switcher for Desktop, Tablet, and Mobile */}
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Pricing Categories"
          className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 shadow-inner max-w-md w-full"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bag"}
            onClick={() => setActiveTab("bag")}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer ${
              activeTab === "bag"
                ? "bg-white text-sky-700 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>By the Bag</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "kg"}
            onClick={() => setActiveTab("kg")}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer ${
              activeTab === "kg"
                ? "bg-white text-sky-700 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>By the KG</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "package"}
            onClick={() => setActiveTab("package")}
            className={`flex-1 min-h-[44px] py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer ${
              activeTab === "package"
                ? "bg-white text-sky-700 shadow-md scale-100"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Gift className="h-4 w-4" />
            <span>Saver Bundles</span>
          </button>
        </div>
      </div>

      {/* Tab 1: By the Bag */}
      {activeTab === "bag" && (
        <PlanBagCard
          bagCount={bagCount}
          onBagCountChange={setBagCount}
        />
      )}

      {/* Tab 2: By the KG */}
      {activeTab === "kg" && (
        <PlanKgCard
          weightKg={weightKg}
          onWeightKgChange={setWeightKg}
        />
      )}

      {/* Tab 3: Saver Bundles */}
      {activeTab === "package" && <PlanPackagesGrid />}
    </section>
  );
}
