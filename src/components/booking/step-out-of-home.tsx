"use client";

import * as React from "react";
import { Home, UserX, AlertCircle, MapPin, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AddressDetails {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

interface DeliveryZone {
  city: string;
  zip: string;
}

interface StepOutOfHomeProps {
  isOutOfHome: boolean;
  onIsOutOfHomeChange: (v: boolean) => void;
  isAwayForDropoff: boolean;
  onIsAwayForDropoffChange: (v: boolean) => void;
  bagConfirmed: boolean;
  onBagConfirmedChange: (v: boolean) => void;
  address: string;
  onAddressChange: (addr: string) => void;
  addressDetails?: AddressDetails;
  onAddressDetailsChange?: (d: AddressDetails) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  deliveryZones?: DeliveryZone[];
}

export function StepOutOfHome({
  isOutOfHome,
  onIsOutOfHomeChange,
  isAwayForDropoff,
  onIsAwayForDropoffChange,
  bagConfirmed,
  onBagConfirmedChange,
  onAddressChange,
  addressDetails,
  onAddressDetailsChange,
  notes,
  onNotesChange,
  deliveryZones = [],
}: StepOutOfHomeProps) {
  const defaultZone = deliveryZones[0] ?? { city: "Lake in the Hills", zip: "60156" };

  const [street, setStreet] = React.useState(addressDetails?.street ?? "");
  const [apt, setApt] = React.useState(addressDetails?.apt ?? "");
  const [city, setCity] = React.useState(addressDetails?.city ?? defaultZone.city);
  const [state] = React.useState(addressDetails?.state ?? "IL");
  const [zip, setZip] = React.useState(addressDetails?.zip ?? defaultZone.zip);

  const push = (s: string, a: string, c: string, z: string) => {
    onAddressChange([s, a ? `Apt ${a}` : "", c, state, z].filter(Boolean).join(", "));
    onAddressDetailsChange?.({ street: s, apt: a, city: c, state, zip: z });
  };

  const handleZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const zone = deliveryZones.find((z) => z.city === e.target.value);
    if (!zone) return;
    setCity(zone.city);
    setZip(zone.zip);
    push(street, apt, zone.city, zone.zip);
  };

  return (
    <div className="space-y-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      {/* Address */}
      <div className="space-y-3">
        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Pickup & Delivery Address
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Street */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Number & Name *</label>
            <input
              type="text"
              required
              placeholder="742 Evergreen Terrace"
              value={street}
              onChange={(e) => { setStreet(e.target.value); push(e.target.value, apt, city, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Apt */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Apt / Unit (Optional)</label>
            <input
              type="text"
              placeholder="Apt 4B"
              value={apt}
              onChange={(e) => { setApt(e.target.value); push(street, e.target.value, city, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* City dropdown — auto-fills zip */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City *</label>
            {deliveryZones.length > 0 ? (
              <select
                value={city}
                onChange={handleZoneChange}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
              >
                {deliveryZones.map((z) => (
                  <option key={z.zip} value={z.city}>{z.city}</option>
                ))}
                <option value="">Other city…</option>
              </select>
            ) : (
              <input
                type="text"
                required
                value={city}
                onChange={(e) => { setCity(e.target.value); push(street, apt, e.target.value, zip); }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            )}
          </div>

          {/* State — fixed IL */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">State</label>
            <input
              type="text"
              readOnly
              value={state}
              className="w-full px-3 py-2 rounded-xl border border-slate-100 bg-slate-50 font-bold text-center text-slate-700 cursor-default"
            />
          </div>

          {/* Zip — auto-filled from zone */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Zip Code *</label>
            <input
              type="text"
              required
              maxLength={10}
              value={zip}
              onChange={(e) => { setZip(e.target.value); push(street, apt, city, e.target.value); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Pickup Presence */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Will you be home during <span className="text-primary">pickup</span>?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { away: false, title: "Yes, I will be Home", sub: "Driver rings bell upon arrival", color: "primary", Icon: Home },
            { away: true, title: "No, I will be Away", sub: "Contactless doorstep pickup", color: "amber", Icon: UserX },
          ].map(({ away, title, sub, color, Icon }) => (
            <button
              key={String(away)}
              type="button"
              onClick={() => onIsOutOfHomeChange(away)}
              className={cn(
                "p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer",
                isOutOfHome === away
                  ? color === "primary" ? "border-primary bg-pink-50/50 ring-2 ring-primary/20" : "border-amber-400 bg-amber-50/50 ring-2 ring-amber-400/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className={cn("p-2 rounded-lg shrink-0", color === "primary" ? "bg-pink-100 text-primary" : "bg-amber-100 text-amber-700")}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">{title}</span>
                <span className="text-[11px] text-slate-500">{sub}</span>
              </div>
            </button>
          ))}
        </div>
        {isOutOfHome && (
          <label className="flex items-start gap-2.5 cursor-pointer p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-in fade-in">
            <input
              type="checkbox"
              required
              checked={bagConfirmed}
              onChange={(e) => onBagConfirmedChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary border-slate-300"
            />
            <div>
              <span className="font-bold flex items-center gap-1 mb-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" /> Required Doorstep Confirmation:
              </span>
              I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup.
            </div>
          </label>
        )}
      </div>

      {/* Dropoff Presence */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Will you be home during <span className="text-emerald-600">drop-off</span>?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { away: false, title: "Yes, I will be Home", sub: "Driver hands off clean laundry directly", Icon: Home, color: "emerald" },
            { away: true, title: "No, Leave at Door", sub: "Contactless doorstep drop-off", Icon: Truck, color: "slate" },
          ].map(({ away, title, sub, Icon, color }) => (
            <button
              key={String(away)}
              type="button"
              onClick={() => onIsAwayForDropoffChange(away)}
              className={cn(
                "p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer",
                isAwayForDropoff === away
                  ? "border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className={cn("p-2 rounded-lg shrink-0", color === "emerald" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">{title}</span>
                <span className="text-[11px] text-slate-500">{sub}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">Special Instructions (Optional)</label>
        <textarea
          rows={2}
          placeholder="e.g. Ring bell or gate code #1234."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>
    </div>
  );
}
