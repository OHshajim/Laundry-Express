"use client";

import * as React from "react";
import { Sliders, Clock, MapPin, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Unified Operations, Facility & Service Rates Settings
 * Consolidates live service rates, free delivery thresholds,
 * business pickup windows, and regional delivery zones into a single page.
 */
export function AdminSettingsManager() {
  const [bagPrice, setBagPrice] = React.useState<number>(32.5);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThresholdBags, setFreeThresholdBags] = React.useState<number>(2);
  const [kgPrice, setKgPrice] = React.useState<number>(2.75);
  const [minKgOrder, setMinKgOrder] = React.useState<number>(5);
  const [freeThresholdKg, setFreeThresholdKg] = React.useState<number>(15);

  const [slot1, setSlot1] = React.useState("8:00 AM – 12:00 PM");
  const [slot2, setSlot2] = React.useState("1:00 PM – 6:00 PM");
  const [daysOpen, setDaysOpen] = React.useState("Monday – Sunday (7 Days / Week)");

  const [zones, setZones] = React.useState([
    { zip: "60156", city: "Lake in the Hills" },
    { zip: "60102", city: "Algonquin" },
    { zip: "60110", city: "Carpentersville" },
    { zip: "60118", city: "Dundee" },
  ]);
  const [newZip, setNewZip] = React.useState("");
  const [newCity, setNewCity] = React.useState("");
  const [savedSuccess, setSavedSuccess] = React.useState(false);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZip.trim() || !newCity.trim()) return;
    setZones((prev) => [...prev, { zip: newZip.trim(), city: newCity.trim() }]);
    setNewZip("");
    setNewCity("");
  };

  const handleRemoveZone = (zip: string) => {
    setZones((prev) => prev.filter((z) => z.zip !== zip));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Operations, Facility &amp; Rate Settings</h3>
          <p className="text-xs text-slate-500">Configure live bag &amp; KG pricing, free delivery rules, hours, and service zones.</p>
        </div>
        <Button type="submit" variant="hero" size="sm" className="cursor-pointer text-xs shrink-0">
          <Save className="h-4 w-4 mr-1.5 shrink-0" />
          Save Settings &amp; Rates
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Live pricing, free delivery rules, and facility settings updated successfully!</span>
        </div>
      )}

      {/* 1. Live Service Rates & Free Delivery Rules */}
      <div className="space-y-4">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Sliders className="h-4 w-4 text-primary shrink-0" />
          <span>1. Live Service Rates &amp; Free Delivery Rules</span>
        </label>

        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">Bag Pricing &amp; Free Delivery</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Standard Bag Price ($)</label>
              <input type="number" step="0.5" value={bagPrice} onChange={(e) => setBagPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-slate-400 mt-1 block">Regular 13-gallon bag</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">1-Bag Delivery Fee ($)</label>
              <input type="number" step="0.5" value={deliveryFee} onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-slate-400 mt-1 block">Default fee when &lt; threshold</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery Bag Threshold</label>
              <input type="number" min="1" value={freeThresholdBags} onChange={(e) => setFreeThresholdBags(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">≥ {freeThresholdBags} Bags = FREE Delivery ($0.00)</span>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 block">Weight-Based (KG) Pricing &amp; Minimums</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Per-KG Rate ($/KG)</label>
              <input type="number" step="0.25" value={kgPrice} onChange={(e) => setKgPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-slate-400 mt-1 block">Commercial linen &amp; bulky items</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Minimum KG Intake</label>
              <input type="number" min="1" value={minKgOrder} onChange={(e) => setMinKgOrder(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-slate-400 mt-1 block">Minimum order weight</span>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Free Delivery KG Threshold</label>
              <input type="number" min="1" value={freeThresholdKg} onChange={(e) => setFreeThresholdKg(parseInt(e.target.value) || 1)} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-black text-sm" />
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">≥ {freeThresholdKg} KG = FREE Delivery ($0.00)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Operational Windows & Business Hours */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary shrink-0" />
          <span>2. Operational Windows &amp; Business Hours</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <span className="font-bold text-slate-700 block mb-1">Morning Pickup Window</span>
            <input type="text" value={slot1} onChange={(e) => setSlot1(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs" />
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <span className="font-bold text-slate-700 block mb-1">Afternoon Pickup Window</span>
            <input type="text" value={slot2} onChange={(e) => setSlot2(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs" />
          </div>
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <span className="font-bold text-slate-700 block mb-1">Days of Operation</span>
            <input type="text" value={daysOpen} onChange={(e) => setDaysOpen(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-xs" />
          </div>
        </div>
      </div>

      {/* 3. Supported Delivery Zones */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <label className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span>3. Supported Delivery Zones (McHenry County)</span>
        </label>
        <div className="flex gap-2">
          <input type="text" placeholder="Zip Code (e.g. 60156)" value={newZip} onChange={(e) => setNewZip(e.target.value)} className="w-36 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold" />
          <input type="text" placeholder="City / Municipality" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs" />
          <Button type="button" variant="outline" size="sm" onClick={handleAddZone} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Zone
          </Button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {zones.map((z) => (
            <div key={z.zip} className="p-3 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{z.zip}</span>
                <span className="text-[10px] text-slate-500 block truncate">{z.city}</span>
              </div>
              <button type="button" onClick={() => handleRemoveZone(z.zip)} className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors" title="Remove zip code">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
