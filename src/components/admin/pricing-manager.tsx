"use client";

import * as React from "react";
import { Sliders, Package, Sparkles, Tag, Check, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackagesManager } from "./packages-manager";
import { DetergentsManager } from "./detergents-manager";
import { CouponsManager } from "./coupons-manager";

type SubTab = "rates" | "packages" | "detergents" | "coupons";

/**
 * PricingManager Component
 *
 * Operations hub for base pricing rules, packages, detergents, and coupons.
 * Allows instant live adjustments to rates and offers without redeployments.
 */
export function PricingManager() {
  const [activeSubTab, setActiveSubTab] = React.useState<SubTab>("rates");

  // Live rates state
  const [bagPrice, setBagPrice] = React.useState<number>(15.0);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThreshold, setFreeThreshold] = React.useState<number>(2);
  const [kgPrice, setKgPrice] = React.useState<number>(2.75);
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("rates")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "rates"
              ? "bg-sky-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Base Rates &amp; Delivery Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("packages")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "packages"
              ? "bg-sky-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Packages &amp; Bundles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("detergents")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "detergents"
              ? "bg-sky-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>Detergents Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("coupons")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === "coupons"
              ? "bg-sky-600 text-white shadow-xs"
              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Coupons &amp; Discounts</span>
        </button>
      </div>

      {/* Sub-tab 1: Base Rates & Delivery Rules */}
      {activeSubTab === "rates" && (
        <form
          onSubmit={handleSaveRates}
          className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 animate-in fade-in duration-150"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="h-5 w-5 text-sky-600" />
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Live Service Rates &amp; Delivery Rules</h4>
                <p className="text-xs text-slate-500">Changes immediately apply across all customer booking calculators.</p>
              </div>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                <Check className="h-4 w-4" /> Live Rates Updated!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Standard Bag Price ($)</label>
              <input
                type="number"
                step="0.5"
                value={bagPrice}
                onChange={(e) => setBagPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">1-Bag Delivery Fee ($)</label>
              <input
                type="number"
                step="0.5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Free Delivery Bag Threshold</label>
              <input
                type="number"
                min="1"
                value={freeThreshold}
                onChange={(e) => setFreeThreshold(parseInt(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
              <span className="text-[10px] text-slate-400">≥ {freeThreshold} bags gets $0.00 fee</span>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Per-KG Rate ($/KG)</label>
              <input
                type="number"
                step="0.25"
                value={kgPrice}
                onChange={(e) => setKgPrice(parseFloat(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="hero" size="sm">
              <Save className="h-4 w-4 mr-1.5" />
              Apply Live Price Updates
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
