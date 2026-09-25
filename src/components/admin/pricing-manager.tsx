"use client";

import * as React from "react";
import { Sliders, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackagesManager } from "./packages-manager";
import { DetergentsManager } from "./detergents-manager";
import { CouponsManager } from "./coupons-manager";

export type PricingSubSection = "rates" | "packages" | "detergents" | "coupons";

interface PricingManagerProps {
  currentSection?: PricingSubSection;
}

/**
 * PricingManager Component
 *
 * Operations hub for base pricing rules, packages, detergents, and coupons.
 * Supports configurable free delivery thresholds for BOTH Bags and KG.
 */
export function PricingManager({ currentSection = "rates" }: PricingManagerProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<PricingSubSection>(currentSection);

  // Sync with prop if passed from sidebar
  React.useEffect(() => {
    setActiveSubTab(currentSection);
  }, [currentSection]);

  // Live rates state
  const [bagPrice, setBagPrice] = React.useState<number>(15.0);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThresholdBags, setFreeThresholdBags] = React.useState<number>(2);
  const [kgPrice, setKgPrice] = React.useState<number>(2.75);
  const [freeThresholdKg, setFreeThresholdKg] = React.useState<number>(15);
  const [minKgOrder, setMinKgOrder] = React.useState<number>(5);
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab 1: Base Rates & Delivery Rules */}
      {activeSubTab === "rates" && (
        <form
          onSubmit={handleSaveRates}
          className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-6 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#B9E1F5]/40 text-[#1E88C7] flex items-center justify-center shrink-0">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Live Service Rates &amp; Free Delivery Rules
                </h4>
                <p className="text-xs text-slate-500">
                  Configure Bag pricing, KG rates, and automated Free Delivery thresholds.
                </p>
              </div>
            </div>

            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <Check className="h-4 w-4 shrink-0" />
                Live Rules Applied &amp; Active!
              </span>
            )}
          </div>

          {/* Bag Pricing Rules */}
          <div className="space-y-3">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              1. Bag Measurement Pricing
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Standard Bag Price ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bagPrice}
                  onChange={(e) => setBagPrice(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Regular wash &amp; fold bag</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  1-Bag Delivery Fee ($)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Default fee when &lt; threshold</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Free Delivery Bag Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={freeThresholdBags}
                  onChange={(e) => setFreeThresholdBags(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                  ≥ {freeThresholdBags} Bags = FREE Delivery ($0.00)
                </span>
              </div>
            </div>
          </div>

          {/* Weight (KG) Pricing Rules */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 block">
              2. Weight-Based (KG) Pricing &amp; Free Delivery
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Per-KG Rate ($/KG)
                </label>
                <input
                  type="number"
                  step="0.25"
                  value={kgPrice}
                  onChange={(e) => setKgPrice(parseFloat(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Commercial linen &amp; bulky items</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Free Delivery KG Threshold
                </label>
                <input
                  type="number"
                  min="1"
                  value={freeThresholdKg}
                  onChange={(e) => setFreeThresholdKg(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
                  ≥ {freeThresholdKg} KG = FREE Delivery ($0.00)
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <label className="block font-bold text-slate-700 uppercase mb-1">
                  Minimum KG Order
                </label>
                <input
                  type="number"
                  min="1"
                  value={minKgOrder}
                  onChange={(e) => setMinKgOrder(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Minimum required weight intake</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <Button type="submit" variant="hero" size="sm">
              <Save className="h-4 w-4 mr-1.5 shrink-0" />
              Apply Live Price &amp; Delivery Updates
            </Button>
          </div>
        </form>
      )}

      {/* Sub-tab 2: Packages & Bundles */}
      {activeSubTab === "packages" && <PackagesManager />}

      {/* Sub-tab 3: Detergents Catalog */}
      {activeSubTab === "detergents" && <DetergentsManager />}

      {/* Sub-tab 4: Coupons & Discounts */}
      {activeSubTab === "coupons" && <CouponsManager />}
    </div>
  );
}

export default PricingManager;
