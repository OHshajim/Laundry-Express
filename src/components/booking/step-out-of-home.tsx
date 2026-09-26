"use client";

import * as React from "react";
import { Home, UserX, AlertCircle, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AddressDetails {
  street: string;
  apt?: string;
  city: string;
  state: string;
  zip: string;
}

interface StepOutOfHomeProps {
  isOutOfHome: boolean;
  onIsOutOfHomeChange: (isOut: boolean) => void;
  bagConfirmed: boolean;
  onBagConfirmedChange: (confirmed: boolean) => void;
  address: string;
  onAddressChange: (addr: string) => void;
  addressDetails?: AddressDetails;
  onAddressDetailsChange?: (details: AddressDetails) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
}

/**
 * StepOutOfHome Component
 * Implements AGENTS.md 4.c & 4.e:
 * - Structured address: Street, Apt, City, State, Zip
 * - Will you be home during pickup? (Yes / No)
 * - Required Doorstep Confirmation if Away
 * - Special pickup request notes
 */
export function StepOutOfHome({
  isOutOfHome,
  onIsOutOfHomeChange,
  bagConfirmed,
  onBagConfirmedChange,
  onAddressChange,
  addressDetails,
  onAddressDetailsChange,
  notes,
  onNotesChange,
}: StepOutOfHomeProps) {
  const [street, setStreet] = React.useState(addressDetails?.street || "");
  const [apt, setApt] = React.useState(addressDetails?.apt || "");
  const [city, setCity] = React.useState(addressDetails?.city || "Lake in the Hills");
  const [state, setState] = React.useState(addressDetails?.state || "IL");
  const [zip, setZip] = React.useState(addressDetails?.zip || "60156");

  const update = (s: string, a: string, c: string, st: string, z: string) => {
    onAddressChange([s, a ? `Apt ${a}` : "", c, st, z].filter(Boolean).join(", "));
    onAddressDetailsChange?.({ street: s, apt: a, city: c, state: st, zip: z });
  };

  return (
    <div className="space-y-6 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200">
      {/* 1. Pickup & Delivery Address */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Pickup &amp; Delivery Address</span>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Street Number &amp; Name *</label>
            <input
              type="text"
              required
              placeholder="742 Evergreen Terrace"
              value={street}
              onChange={(e) => { setStreet(e.target.value); update(e.target.value, apt, city, state, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Apt / Unit (Optional)</label>
            <input
              type="text"
              placeholder="Apt 4B"
              value={apt}
              onChange={(e) => { setApt(e.target.value); update(street, e.target.value, city, state, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">City *</label>
            <input
              type="text"
              required
              value={city}
              onChange={(e) => { setCity(e.target.value); update(street, apt, e.target.value, state, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">State *</label>
            <input
              type="text"
              required
              maxLength={2}
              value={state}
              onChange={(e) => { const s = e.target.value.toUpperCase(); setState(s); update(street, apt, city, s, zip); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium uppercase text-center focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Zip Code *</label>
            <input
              type="text"
              required
              maxLength={10}
              value={zip}
              onChange={(e) => { setZip(e.target.value); update(street, apt, city, state, e.target.value); }}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white font-medium text-center focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* 2. Presence Radio */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
          Will you be home during the pickup window?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onIsOutOfHomeChange(false)}
            className={cn(
              "p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer",
              !isOutOfHome ? "border-primary bg-pink-50/50 ring-2 ring-primary/20" : "border-slate-200 bg-white"
            )}
          >
            <div className="p-2 rounded-lg bg-pink-100 text-primary shrink-0"><Home className="h-4 w-4" /></div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">Yes, I will be Home</span>
              <span className="text-[11px] text-slate-500">Driver rings bell upon arrival</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onIsOutOfHomeChange(true)}
            className={cn(
              "p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer",
              isOutOfHome ? "border-primary bg-pink-50/50 ring-2 ring-primary/20" : "border-slate-200 bg-white"
            )}
          >
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0"><UserX className="h-4 w-4" /></div>
            <div>
              <span className="font-bold text-xs text-slate-900 block">No, I will be Away</span>
              <span className="text-[11px] text-slate-500">Contactless doorstep pickup</span>
            </div>
          </button>
        </div>
      </div>

      {/* 3. Doorstep Confirmation if Away */}
      {isOutOfHome && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs animate-in fade-in">
          <label className="flex items-start gap-2.5 cursor-pointer text-amber-900 leading-relaxed">
            <input
              type="checkbox"
              required
              checked={bagConfirmed}
              onChange={(e) => onBagConfirmedChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded text-primary focus:ring-primary border-slate-300"
            />
            <div>
              <span className="font-bold flex items-center gap-1 mb-0.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                Required Doorstep Confirmation:
              </span>
              I confirm that my laundry bag(s) are placed securely outside my front door / porch for pickup.
            </div>
          </label>
        </div>
      )}

      {/* 4. Special Instructions */}
      <div className="space-y-1">
        <label className="block text-xs font-semibold text-slate-700">Special Pickup Instructions (Optional)</label>
        <textarea
          rows={2}
          placeholder="e.g. Ring bell or gate code #1234."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-primary"
        />
      </div>
    </div>
  );
}
