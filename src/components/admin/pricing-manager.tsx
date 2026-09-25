"use client";

import * as React from "react";
import { Sliders, Plus, Tag, Package, Check, Save } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function PricingManager() {
  // Live rates state
  const [bagPrice, setBagPrice] = React.useState<number>(15.0);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThreshold, setFreeThreshold] = React.useState<number>(2);
  const [kgPrice, setKgPrice] = React.useState<number>(2.75);
  const [savedSuccess, setSavedSuccess] = React.useState<boolean>(false);

  // Offers state
  const [offers, setOffers] = React.useState([
    { code: "HEROFRESH", discount: "15% OFF", type: "percentage", active: true },
    { code: "FREESHIP", discount: "FREE Delivery", type: "free_delivery", active: true },
  ]);
  const [newCode, setNewCode] = React.useState("");
  const [newDiscount, setNewDiscount] = React.useState("");

  const handleSaveRates = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) return;
    setOffers((prev) => [
      ...prev,
      { code: newCode.trim().toUpperCase(), discount: newDiscount || "$5.00 OFF", type: "fixed_amount", active: true },
    ]);
    setNewCode("");
    setNewDiscount("");
  };

  return (
    <div className="space-y-8">
      {/* 1. Base Rates & Rules Editor */}
      <form onSubmit={handleSaveRates} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-sky-600" />
            <h4 className="font-bold text-slate-900 text-sm">Live Service Rates &amp; Delivery Rules</h4>
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

      {/* 2. Offers & Promo Codes Manager */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Tag className="h-5 w-5 text-rose-500" />
          <h4 className="font-bold text-slate-900 text-sm">Coupon Offers &amp; Discounts</h4>
        </div>

        {/* Create new offer form */}
        <form onSubmit={handleAddOffer} className="flex flex-col sm:flex-row gap-3 text-xs">
          <input
            type="text"
            placeholder="COUPON CODE (e.g. FLASH20)"
            value={newCode}
            onChange={(e) => setNewCode(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-mono uppercase"
          />
          <input
            type="text"
            placeholder="Discount description (e.g. $5.00 OFF or 20% OFF)"
            value={newDiscount}
            onChange={(e) => setNewDiscount(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200"
          />
          <Button type="submit" variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Coupon Offer
          </Button>
        </form>

        {/* Existing offers list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          {offers.map((offer) => (
            <div key={offer.code} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <span className="font-mono font-extrabold text-slate-900 block">{offer.code}</span>
                <span className="text-slate-500 text-[11px]">{offer.discount}</span>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                Active
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
