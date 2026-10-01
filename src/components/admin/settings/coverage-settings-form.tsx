"use client";

import * as React from "react";
import { MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SaveSettingsForm, useSettingsSave, postSettings } from "./save-settings-form";
import type { BusinessSettings } from "@/lib/services/content-service";

interface Zone {
  zip: string;
  city: string;
}

function parseZones(input: string[] | undefined): Zone[] {
  return (input || []).map((item) => {
    const match = item.match(/^(.+?)\s*\(([0-9]{5})\)$/);
    return match ? { city: match[1], zip: match[2] } : { city: item, zip: "" };
  });
}

export function CoverageSettingsForm({ initialSettings }: { initialSettings: BusinessSettings | null }) {
  const [zones, setZones] = React.useState(() => parseZones(initialSettings?.delivery_zones));
  const [city, setCity] = React.useState("");
  const [zip, setZip] = React.useState("");
  const [formError, setFormError] = React.useState("");
  const { isSaving, error, saved, save } = useSettingsSave();

  const addZone = () => {
    if (!city.trim() || !/^\d{5}$/.test(zip.trim())) {
      setFormError("Enter a city and a valid five-digit ZIP code.");
      return;
    }
    if (zones.some((zone) => zone.zip === zip.trim())) {
      setFormError("That ZIP code is already configured.");
      return;
    }
    setFormError("");
    setZones((current) => [...current, { city: city.trim(), zip: zip.trim() }]);
    setCity("");
    setZip("");
  };

  const handleAreaKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addZone();
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!zones.length || zones.some((zone) => !zone.city.trim() || !/^\d{5}$/.test(zone.zip))) {
      setFormError("Add at least one city with a valid five-digit ZIP code.");
      return;
    }
    setFormError("");
    void save(() => postSettings({ delivery_zones: zones.map((zone) => `${zone.city} (${zone.zip})`) }));
  };

  return (
    <SaveSettingsForm title="Delivery Areas" description="Manage the ZIP codes and cities you serve."
      isLoading={false} isSaving={isSaving} error={error || formError} saved={saved} onSubmit={handleSubmit}>
      <section className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3 text-xs">
        <div className="flex items-center justify-between gap-3">
          <h4 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wider">
            <MapPin className="h-4 w-4 text-primary" /> Active Coverage Zones
          </h4>
          <span className="font-bold text-slate-500">{zones.length} areas</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {zones.map((zone) => (
            <div key={zone.zip || zone.city} className="p-2 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-2">
              <span className="font-bold text-slate-800 break-words">{zone.city}{zone.zip ? ` (${zone.zip})` : ""}</span>
              <button type="button" aria-label={`Remove ${zone.city}`} onClick={() => setZones((current) => current.filter((item) => item.zip !== zone.zip))}
                className="text-slate-400 hover:text-rose-600 cursor-pointer shrink-0">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_9rem_auto] gap-2 pt-1">
          <input type="text" aria-label="City or area name" placeholder="City / Area Name" value={city}
            onKeyDown={handleAreaKeyDown} onChange={(event) => setCity(event.target.value)}
            className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs" />
          <input type="text" aria-label="ZIP code" maxLength={5} inputMode="numeric" placeholder="ZIP Code" value={zip}
            onKeyDown={handleAreaKeyDown} onChange={(event) => setZip(event.target.value.replace(/\D/g, ""))}
            className="w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs" />
          <Button type="button" size="sm" variant="outline" onClick={addZone} className="w-full sm:w-auto cursor-pointer text-xs">
            <Plus className="h-3.5 w-3.5 mr-1" /> Add ZIP Area
          </Button>
        </div>
      </section>
    </SaveSettingsForm>
  );
}
