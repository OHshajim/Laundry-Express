"use client";

import * as React from "react";
import { Sliders, Clock, MapPin, CheckCircle2, Plus, Trash2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSettingsManager() {
  const [bagPrice, setBagPrice] = React.useState<number>(32.5);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThresholdBags, setFreeThresholdBags] = React.useState<number>(2);
  const [poundPrice, setPoundPrice] = React.useState<number>(1.99);
  const [minLbsOrder, setMinLbsOrder] = React.useState<number>(10);
  const [maxLbsOrder, setMaxLbsOrder] = React.useState<number>(100);
  const [freeThresholdLbs, setFreeThresholdLbs] = React.useState<number>(30);

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
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/pricing")
      .then((res) => res.json())
      .then((data) => {
        if (data.pricing) {
          setBagPrice(data.pricing.bag_price);
          setDeliveryFee(data.pricing.standard_delivery_fee);
          setFreeThresholdBags(data.pricing.free_delivery_threshold);
          setPoundPrice(data.pricing.pound_price ?? 1.99);
          setMinLbsOrder(data.pricing.min_lbs ?? 10);
          setMaxLbsOrder(data.pricing.max_lbs ?? 100);
          setFreeThresholdLbs(data.pricing.free_delivery_lbs ?? 30);
        }
      })
      .catch(() => {});

    fetch("/api/content?type=settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.operating_hours) setDaysOpen(data.settings.operating_hours);
      })
      .catch(() => {});
  }, []);

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

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await Promise.all([
        fetch("/api/pricing", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            bag_price: bagPrice,
            standard_delivery_fee: deliveryFee,
            free_delivery_threshold: freeThresholdBags,
            pound_price: poundPrice,
            min_lbs: minLbsOrder,
            max_lbs: maxLbsOrder,
            free_delivery_lbs: freeThresholdLbs,
          }),
        }),
        fetch("/api/content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            section: "settings",
            item: {
              operating_hours: daysOpen,
              delivery_zones: zones.map((z) => `${z.city} (${z.zip})`),
              min_order_bag: 1,
              min_order_lbs: minLbsOrder,
              free_delivery_bags: freeThresholdBags,
              free_delivery_lbs: freeThresholdLbs,
              standard_delivery_fee: deliveryFee,
            },
          }),
        }),
      ]);

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch {} finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-black text-slate-900">Operations, Facility &amp; Rate Settings</h3>
          <p className="text-xs text-slate-500">Live database configuration for bag &amp; pound pricing, free delivery rules, hours, and service zones.</p>
        </div>
        <Button type="submit" variant="hero" size="sm" disabled={isSaving} className="cursor-pointer text-xs shrink-0">
          <Save className="h-4 w-4 mr-1.5 shrink-0" />
          <span>{isSaving ? "Saving to Database..." : "Save Settings to Database"}</span>
        </Button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Operational settings successfully saved and synced to live database!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
            <Sliders className="h-4 w-4 text-primary" />
            <span>Service Pricing &amp; Delivery Thresholds</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Per-Bag Rate ($)</label>
              <input type="number" step="0.5" value={bagPrice} onChange={(e) => setBagPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Free Delivery (Bags)</label>
              <input type="number" value={freeThresholdBags} onChange={(e) => setFreeThresholdBags(parseInt(e.target.value, 10) || 1)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Delivery Fee ($)</label>
              <input type="number" step="0.5" value={deliveryFee} onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Per-Pound Rate ($/lb)</label>
              <input type="number" step="0.05" value={poundPrice} onChange={(e) => setPoundPrice(parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Min Pounds (lbs)</label>
              <input type="number" step="1" value={minLbsOrder} onChange={(e) => setMinLbsOrder(parseInt(e.target.value, 10) || 1)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-1">Max Pounds (lbs)</label>
              <input type="number" step="1" value={maxLbsOrder} onChange={(e) => setMaxLbsOrder(parseInt(e.target.value, 10) || 10)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div className="col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Free Delivery Threshold (Pounds / lbs)</label>
              <input type="number" step="1" value={freeThresholdLbs} onChange={(e) => setFreeThresholdLbs(parseInt(e.target.value, 10) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
            <Clock className="h-4 w-4 text-primary" />
            <span>Operational Pickup Windows &amp; Hours</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Daily Facility Schedule</label>
              <input type="text" value={daysOpen} onChange={(e) => setDaysOpen(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Morning Slot</label>
                <input type="text" value={slot1} onChange={(e) => setSlot1(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Afternoon Slot</label>
                <input type="text" value={slot2} onChange={(e) => setSlot2(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-primary" />
            <span>Active Delivery Coverage Zones (30-Mile Radius)</span>
          </div>
          <span className="font-bold text-slate-500">{zones.length} Municipalities Covered</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {zones.map((z) => (
            <div key={z.zip} className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-800">{z.city} ({z.zip})</span>
              <button type="button" onClick={() => handleRemoveZone(z.zip)} className="text-slate-400 hover:text-rose-600 cursor-pointer">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
