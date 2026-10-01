"use client";

import * as React from "react";
import { Sliders, Clock, MapPin, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSettingsManager() {
  const [bagPrice, setBagPrice] = React.useState("");
  const [minBagsOrder, setMinBagsOrder] = React.useState("");
  const [maxBagsOrder, setMaxBagsOrder] = React.useState("");
  const [deliveryFee, setDeliveryFee] = React.useState("");
  const [freeThresholdBags, setFreeThresholdBags] = React.useState("");
  const [poundPrice, setPoundPrice] = React.useState("");
  const [minLbsOrder, setMinLbsOrder] = React.useState("");
  const [maxLbsOrder, setMaxLbsOrder] = React.useState("");
  const [freeThresholdLbs, setFreeThresholdLbs] = React.useState("");
  const [slot1Start, setSlot1Start] = React.useState("");
  const [slot1End, setSlot1End] = React.useState("");
  const [slot2Start, setSlot2Start] = React.useState("");
  const [slot2End, setSlot2End] = React.useState("");
  const [daysOpen, setDaysOpen] = React.useState("");
  const [zones, setZones] = React.useState<{ zip: string; city: string }[]>([]);
  const [newZip, setNewZip] = React.useState("");
  const [newCity, setNewCity] = React.useState("");
  const [savedSuccess, setSavedSuccess] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState("");
  const [saveError, setSaveError] = React.useState("");

  React.useEffect(() => {
    Promise.all([
      fetch("/api/pricing", { cache: "no-store" }),
      fetch("/api/content?type=settings", { cache: "no-store" }),
    ]).then(async ([pricingResponse, settingsResponse]) => {
      const pricingData = await pricingResponse.json();
      const settingsData = await settingsResponse.json();
      if (!pricingResponse.ok || !pricingData.success) throw new Error(pricingData.error || "Unable to load pricing settings.");
      if (!settingsResponse.ok || !settingsData.success) throw new Error(settingsData.error || "Unable to load business settings.");
      if (pricingData.pricing) {
        const p = pricingData.pricing;
        setBagPrice(String(p.bag_price)); setMinBagsOrder(String(p.min_bags)); setMaxBagsOrder(String(p.max_bags));
        setDeliveryFee(String(p.standard_delivery_fee)); setFreeThresholdBags(String(p.free_delivery_threshold));
        setPoundPrice(String(p.pound_price)); setMinLbsOrder(String(p.min_lbs)); setMaxLbsOrder(String(p.max_lbs));
        setFreeThresholdLbs(String(p.free_delivery_lbs));
      }
      const s = settingsData.settings;
      if (s) {
        setDaysOpen(s.operating_hours || "");
        setSlot1Start(s.slot1_start || ""); setSlot1End(s.slot1_end || "");
        setSlot2Start(s.slot2_start || ""); setSlot2End(s.slot2_end || "");
        setZones(Array.isArray(s.delivery_zones) ? s.delivery_zones.map((item: string) => {
          const match = item.match(/^(.+?)\s*\(([0-9]{5})\)$/);
          return match ? { city: match[1], zip: match[2] } : { city: item, zip: "" };
        }) : []);
      }
    }).catch((error: unknown) => {
      setLoadError(error instanceof Error ? error.message : "Unable to load settings.");
    }).finally(() => setIsLoading(false));
  }, []);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{5}$/.test(newZip.trim()) || !newCity.trim()) {
      setSaveError("Enter a city and a valid five-digit ZIP code.");
      return;
    }
    if (zones.some((zone) => zone.zip === newZip.trim())) {
      setSaveError("That ZIP code is already configured.");
      return;
    }
    setSaveError("");
    setZones((prev) => [...prev, { zip: newZip.trim(), city: newCity.trim() }]);
    setNewZip(""); setNewCity("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");
    const numbers = [bagPrice, minBagsOrder, maxBagsOrder, deliveryFee, freeThresholdBags, poundPrice, minLbsOrder, maxLbsOrder, freeThresholdLbs].map(Number);
    if (numbers.some((value) => !Number.isFinite(value) || value < 0) ||
      numbers[0] <= 0 || numbers[1] <= 0 || numbers[2] < numbers[1] || numbers[5] <= 0 ||
      numbers[6] <= 0 || numbers[7] < numbers[6] || !daysOpen.trim() ||
      !slot1Start || !slot1End || !slot2Start || !slot2End ||
      zones.length === 0 || zones.some((zone) => !zone.city.trim() || !/^\d{5}$/.test(zone.zip))) {
      setSaveError("Complete all pricing, operating hours, pickup windows, and at least one coverage zone before saving.");
      return;
    }
    setIsSaving(true);
    try {
      const [pricingResponse, settingsResponse] = await Promise.all([
        fetch("/api/pricing", {
          method: "PUT", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bag_price: numbers[0], min_bags: numbers[1], max_bags: numbers[2], standard_delivery_fee: numbers[3], free_delivery_threshold: numbers[4], pound_price: numbers[5], min_lbs: numbers[6], max_lbs: numbers[7], free_delivery_lbs: numbers[8] }),
        }),
        fetch("/api/content", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "settings",
            item: {
              operating_hours: daysOpen, slot1_start: slot1Start, slot1_end: slot1End, slot2_start: slot2Start, slot2_end: slot2End,
              delivery_zones: zones.map((z) => `${z.city} (${z.zip})`), min_order_bag: numbers[1], max_order_bag: numbers[2], min_order_lbs: numbers[6], max_order_lbs: numbers[7], free_delivery_bags: numbers[4], free_delivery_lbs: numbers[8], standard_delivery_fee: numbers[3],
            },
          }),
        }),
      ]);
      const [pricingResult, settingsResult] = await Promise.all([pricingResponse.json(), settingsResponse.json()]);
      if (!pricingResponse.ok || !pricingResult.success) throw new Error(pricingResult.error || "Unable to save pricing settings.");
      if (!settingsResponse.ok || !settingsResult.success) throw new Error(settingsResult.error || "Unable to save business settings.");
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (error: unknown) {
      setSaveError(error instanceof Error ? error.message : "Unable to save settings.");
    } finally { setIsSaving(false); }
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      {isLoading && <p className="text-sm text-slate-600">Loading saved settings...</p>}
      {loadError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{loadError}</p>}
      {saveError && <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{saveError}</p>}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Operations, Schedule &amp; Rate Settings</h3>
          <p className="text-xs text-slate-500">Service rates, minimum &amp; maximum pound limitations, clock pickup slots, and coverage areas.</p>
        </div>
        <Button type="submit" variant="hero" size="sm" disabled={isSaving || isLoading} className="cursor-pointer text-xs shrink-0">
          <Save className="h-4 w-4 mr-1.5 shrink-0" />
          <span>{isSaving ? "Saving..." : "Save Settings to Database"}</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Operational settings successfully saved and synced!</span>
        </div>
      )}

      {/* Pricing & Threshold Rules (With Min & Max Pound Limitation) */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider">
          <Sliders className="h-4 w-4 text-primary" />
          <span>Pricing &amp; Threshold Rules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Per-Bag Rate ($)</label>
            <input required min="0.01" type="number" step="0.01" value={bagPrice} onChange={(e) => setBagPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Min Bags</label>
            <input required min="1" type="number" step="1" value={minBagsOrder} onChange={(e) => setMinBagsOrder(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Max Bags</label>
            <input required min="1" type="number" step="1" value={maxBagsOrder} onChange={(e) => setMaxBagsOrder(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Free Delivery (Bags)</label>
            <input required min="0" type="number" value={freeThresholdBags} onChange={(e) => setFreeThresholdBags(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Standard Delivery Fee ($)</label>
            <input required min="0" type="number" step="0.01" value={deliveryFee} onChange={(e) => setDeliveryFee(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Per-Pound Rate ($/lb)</label>
            <input required min="0.01" type="number" step="0.01" value={poundPrice} onChange={(e) => setPoundPrice(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Min Pound Limit (lbs) *</label>
            <input required min="1" type="number" step="1" value={minLbsOrder} onChange={(e) => setMinLbsOrder(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Max Pound Limit (lbs) *</label>
            <input required min="1" type="number" step="1" value={maxLbsOrder} onChange={(e) => setMaxLbsOrder(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <label className="font-bold text-slate-700 block mb-1">Free Delivery Threshold (lbs)</label>
            <input required min="0" type="number" step="1" value={freeThresholdLbs} onChange={(e) => setFreeThresholdLbs(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
        </div>
      </div>

      {/* Operating Schedule with Native Clock Pickers */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
          <Clock className="h-4 w-4 text-primary" />
          <span>Operational Schedule &amp; Clock Windows</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Operating Days</label>
            <input type="text" value={daysOpen} onChange={(e) => setDaysOpen(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Morning Pickup Window (Clock)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={slot1Start} onChange={(e) => setSlot1Start(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
              <input type="time" value={slot1End} onChange={(e) => setSlot1End(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-1">Afternoon Pickup Window (Clock)</label>
            <div className="grid grid-cols-2 gap-2">
              <input type="time" value={slot2Start} onChange={(e) => setSlot2Start(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
              <input type="time" value={slot2End} onChange={(e) => setSlot2End(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Zones */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Active Coverage Zones (Users Pick from These Areas)</span>
          </div>
          <span className="font-bold text-slate-500">{zones.length} Municipalities</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {zones.map((z) => (
            <div key={z.zip} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">{z.city} ({z.zip})</span>
              <button type="button" onClick={() => setZones((p) => p.filter((x) => x.zip !== z.zip))} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input type="text" required placeholder="City / Area Name" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs" />
          <input type="text" required maxLength={5} inputMode="numeric" placeholder="ZIP Code" value={newZip} onChange={(e) => setNewZip(e.target.value)} className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs" />
          <Button type="button" size="sm" variant="outline" onClick={handleAddZone} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Area
          </Button>
        </div>
      </div>
    </form>
  );
}
