"use client";

import * as React from "react";
import { Sliders, Clock, MapPin, CheckCircle2, Plus, Trash2, Save, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminSettingsManager() {
  const [bagPrice, setBagPrice] = React.useState<number>(32.5);
  const [deliveryFee, setDeliveryFee] = React.useState<number>(10.0);
  const [freeThresholdBags, setFreeThresholdBags] = React.useState<number>(2);
  const [poundPrice, setPoundPrice] = React.useState<number>(1.99);
  const [minLbsOrder, setMinLbsOrder] = React.useState<number>(10);
  const [maxLbsOrder, setMaxLbsOrder] = React.useState<number>(100);
  const [freeThresholdLbs, setFreeThresholdLbs] = React.useState<number>(30);

  // Time pickers (clocks)
  const [slot1Start, setSlot1Start] = React.useState("08:00");
  const [slot1End, setSlot1End] = React.useState("12:00");
  const [slot2Start, setSlot2Start] = React.useState("13:00");
  const [slot2End, setSlot2End] = React.useState("18:00");
  const [daysOpen, setDaysOpen] = React.useState("Monday – Sunday (7 Days / Week)");

  // Facility Address
  const [facilityName, setFacilityName] = React.useState("Laundry Express Main Hub");
  const [facilityStreet, setFacilityStreet] = React.useState("100 Industrial Pkwy");
  const [facilityCity, setFacilityCity] = React.useState("Lake in the Hills");
  const [facilityState, setFacilityState] = React.useState("IL");
  const [facilityZip, setFacilityZip] = React.useState("60156");

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
        if (data.settings) {
          const s = data.settings;
          if (s.operating_hours) setDaysOpen(s.operating_hours);
          if (s.slot1_start) setSlot1Start(s.slot1_start);
          if (s.slot1_end) setSlot1End(s.slot1_end);
          if (s.slot2_start) setSlot2Start(s.slot2_start);
          if (s.slot2_end) setSlot2End(s.slot2_end);
          if (s.facility_address) {
            setFacilityName(s.facility_address.facility_name || "Laundry Express Main Hub");
            setFacilityStreet(s.facility_address.street || "");
            setFacilityCity(s.facility_address.city || "Lake in the Hills");
            setFacilityState(s.facility_address.state || "IL");
            setFacilityZip(s.facility_address.zip || "60156");
          }
          if (Array.isArray(s.delivery_zones) && s.delivery_zones.length > 0) {
            setZones(
              s.delivery_zones.map((item: string) => {
                const match = item.match(/^(.+?)\s*\(([0-9]{5})\)$/);
                return match ? { city: match[1], zip: match[2] } : { city: item, zip: "60156" };
              })
            );
          }
        }
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
              slot1_start: slot1Start,
              slot1_end: slot1End,
              slot2_start: slot2Start,
              slot2_end: slot2End,
              facility_address: {
                facility_name: facilityName,
                street: facilityStreet,
                city: facilityCity,
                state: facilityState,
                zip: facilityZip,
              },
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
          <p className="text-xs text-slate-500">Configure facility location, time pickers, bag &amp; pound rates, and coverage zones.</p>
        </div>
        <Button type="submit" variant="hero" size="sm" disabled={isSaving} className="cursor-pointer text-xs shrink-0">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Facility Address */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
            <Building className="h-4 w-4 text-primary" />
            <span>Facility Physical Address</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Facility / Depot Name</label>
              <input type="text" value={facilityName} onChange={(e) => setFacilityName(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Street Address</label>
              <input type="text" value={facilityStreet} onChange={(e) => setFacilityStreet(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">City</label>
                <input type="text" value={facilityCity} onChange={(e) => setFacilityCity(e.target.value)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">State</label>
                <input type="text" value={facilityState} onChange={(e) => setFacilityState(e.target.value)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-0.5">ZIP</label>
                <input type="text" value={facilityZip} onChange={(e) => setFacilityZip(e.target.value)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
              </div>
            </div>
          </div>
        </div>

        {/* Operating Hours with Native Clock Inputs */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-wider">
            <Clock className="h-4 w-4 text-primary" />
            <span>Operational Schedule &amp; Clock Windows</span>
          </div>
          <div className="space-y-2 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Operating Days</label>
              <input type="text" value={daysOpen} onChange={(e) => setDaysOpen(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium" />
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Morning Pickup Window (Clock)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={slot1Start} onChange={(e) => setSlot1Start(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
                <input type="time" value={slot1End} onChange={(e) => setSlot1End(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
              </div>
            </div>
            <div>
              <label className="font-bold text-slate-700 block mb-0.5">Afternoon Pickup Window (Clock)</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="time" value={slot2Start} onChange={(e) => setSlot2Start(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
                <input type="time" value={slot2End} onChange={(e) => setSlot2End(e.target.value)} className="w-full px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Rules */}
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider">
          <Sliders className="h-4 w-4 text-primary" />
          <span>Pricing &amp; Threshold Rules</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="font-bold text-slate-700 block mb-0.5">Per-Bag ($)</label>
            <input type="number" step="0.5" value={bagPrice} onChange={(e) => setBagPrice(parseFloat(e.target.value) || 0)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-0.5">Free Bags Threshold</label>
            <input type="number" value={freeThresholdBags} onChange={(e) => setFreeThresholdBags(parseInt(e.target.value, 10) || 1)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-0.5">Per-Pound ($/lb)</label>
            <input type="number" step="0.05" value={poundPrice} onChange={(e) => setPoundPrice(parseFloat(e.target.value) || 0)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
          </div>
          <div>
            <label className="font-bold text-slate-700 block mb-0.5">Free Lbs Threshold</label>
            <input type="number" value={freeThresholdLbs} onChange={(e) => setFreeThresholdLbs(parseInt(e.target.value, 10) || 0)} className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white font-bold" />
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
          <input type="text" placeholder="City / Area Name" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs" />
          <input type="text" placeholder="ZIP Code" value={newZip} onChange={(e) => setNewZip(e.target.value)} className="w-28 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs" />
          <Button type="button" size="sm" variant="outline" onClick={handleAddZone} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Area
          </Button>
        </div>
      </div>
    </form>
  );
}
