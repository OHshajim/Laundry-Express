"use client";

import * as React from "react";
import { Settings, Clock, MapPin, DollarSign, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * AdminSettingsManager Component
 * Implements AGENTS.md 6.m:
 * Business hours, delivery zones, and minimum order values.
 */
export function AdminSettingsManager() {
  const [slot1, setSlot1] = React.useState("8:00 AM – 12:00 PM");
  const [slot2, setSlot2] = React.useState("1:00 PM – 6:00 PM");
  const [daysOpen, setDaysOpen] = React.useState("Monday – Sunday (7 Days / Week)");

  const [minBags, setMinBags] = React.useState(1);
  const [minKg, setMinKg] = React.useState(5);
  const [freeBagThreshold, setFreeBagThreshold] = React.useState(2);

  const [zones, setZones] = React.useState([
    { zip: "60156", city: "Lake in the Hills", fee: 0 },
    { zip: "60102", city: "Algonquin", fee: 0 },
    { zip: "60110", city: "Carpentersville", fee: 0 },
    { zip: "60118", city: "Dundee", fee: 0 },
  ]);
  const [newZip, setNewZip] = React.useState("");
  const [newCity, setNewCity] = React.useState("");

  const [saved, setSaved] = React.useState(false);

  const handleAddZone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newZip.trim() || !newCity.trim()) return;
    setZones((prev) => [...prev, { zip: newZip.trim(), city: newCity.trim(), fee: 0 }]);
    setNewZip("");
    setNewCity("");
  };

  const handleRemoveZone = (zip: string) => {
    setZones((prev) => prev.filter((z) => z.zip !== zip));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <form onSubmit={handleSave} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-black text-slate-900">Operations &amp; Facility Settings</h3>
          <p className="text-xs text-slate-500">Configure business hours, supported delivery zones, and minimum values.</p>
        </div>
        <Button type="submit" variant="hero" size="sm" className="cursor-pointer text-xs">
          Save All Settings
        </Button>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Operational settings successfully updated!</span>
        </div>
      )}

      {/* 1. Business Hours */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary" />
          <span>1. Operational Windows &amp; Business Hours</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Morning Pickup Window</span>
            <input
              type="text"
              value={slot1}
              onChange={(e) => setSlot1(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
            />
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Afternoon Pickup Window</span>
            <input
              type="text"
              value={slot2}
              onChange={(e) => setSlot2(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
            />
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Days of Operation</span>
            <input
              type="text"
              value={daysOpen}
              onChange={(e) => setDaysOpen(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
            />
          </div>
        </div>
      </div>

      {/* 2. Minimum Order Values */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign className="h-4 w-4 text-primary" />
          <span>2. Minimum Order Values &amp; Delivery Thresholds</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Min Bags per Order</span>
            <input
              type="number"
              min={1}
              value={minBags}
              onChange={(e) => setMinBags(parseInt(e.target.value) || 1)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
            />
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Min KG per Order</span>
            <input
              type="number"
              min={1}
              value={minKg}
              onChange={(e) => setMinKg(parseInt(e.target.value) || 5)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold"
            />
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="font-semibold text-slate-600 block mb-1">Free Delivery Threshold (Bags)</span>
            <input
              type="number"
              min={1}
              value={freeBagThreshold}
              onChange={(e) => setFreeBagThreshold(parseInt(e.target.value) || 2)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-bold text-emerald-700"
            />
          </div>
        </div>
      </div>

      {/* 3. Delivery Zones */}
      <div className="space-y-3 pt-3 border-t border-slate-100">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-primary" />
          <span>3. Supported Delivery Zones (Zip Codes)</span>
        </label>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Zip Code (e.g. 60156)"
            value={newZip}
            onChange={(e) => setNewZip(e.target.value)}
            className="w-32 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
          />
          <input
            type="text"
            placeholder="City Name"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs"
          />
          <Button type="button" variant="outline" size="sm" onClick={handleAddZone} className="cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add Zone
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          {zones.map((z) => (
            <div key={z.zip} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{z.zip}</span>
                <span className="text-[10px] text-slate-500 block truncate">{z.city}</span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveZone(z.zip)}
                className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                title="Remove zip"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
