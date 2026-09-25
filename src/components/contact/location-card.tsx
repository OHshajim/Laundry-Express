"use client";

import * as React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

interface ContactLocationInfo {
  id: "long-beach" | "lake-in-the-hills";
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  mapsUrl: string;
  coordinates: { lat: number; lng: number };
}

const LOCATIONS: Record<string, ContactLocationInfo> = {
  "long-beach": {
    id: "long-beach",
    title: "Long Beach Operations & Express Facility",
    address: "5210 Long Beach Blvd, Long Beach, CA 90805, United States",
    phone: "+15623805780",
    email: "laundryroomcd@gmail.com",
    hours: {
      weekdays: "6:00 AM – 10:00 PM",
      saturday: "6:00 AM – 10:00 PM",
      sunday: "7:00 AM – 9:00 PM",
    },
    mapsUrl: "https://maps.google.com/?q=33.8369,-118.1988",
    coordinates: { lat: 33.8369, lng: -118.1988 },
  },
  "lake-in-the-hills": {
    id: "lake-in-the-hills",
    title: "Lake in the Hills Central Hub (30-Mile Radius)",
    address: "United States, IL · McHenry Co. · Lake in the Hills (42.1903, -88.383743)",
    phone: APP_CONFIG.supportPhone,
    email: APP_CONFIG.supportEmail,
    hours: {
      weekdays: "8:00 AM – 6:00 PM",
      saturday: "8:00 AM – 6:00 PM",
      sunday: "8:00 AM – 6:00 PM",
    },
    mapsUrl: "https://maps.google.com/?q=42.1903,-88.383743",
    coordinates: { lat: 42.1903, lng: -88.383743 },
  },
};

interface LocationCardProps {
  activeLocationId?: "long-beach" | "lake-in-the-hills";
  onLocationChange?: (loc: ContactLocationInfo) => void;
}

/**
 * LocationCard Component
 *
 * Implements the contact showcase matching the client specification:
 * 1. Physical Address with "Get Directions →"
 * 2. Click-to-call Phone with direct dialing
 * 3. Support Email
 * 4. Structured Hours of Operation
 * 5. Full-width Call Now action button
 */
export function LocationCard({
  activeLocationId = "long-beach",
  onLocationChange,
}: LocationCardProps) {
  const [selectedId, setSelectedId] = React.useState<"long-beach" | "lake-in-the-hills">(
    activeLocationId
  );

  const loc = LOCATIONS[selectedId];

  const handleSelect = (id: "long-beach" | "lake-in-the-hills") => {
    setSelectedId(id);
    if (onLocationChange) {
      onLocationChange(LOCATIONS[id]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Facility Switcher Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200/80 max-w-fit">
        <button
          type="button"
          onClick={() => handleSelect("long-beach")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedId === "long-beach"
              ? "bg-[#1E88C7] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Long Beach, CA
        </button>
        <button
          type="button"
          onClick={() => handleSelect("lake-in-the-hills")}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            selectedId === "lake-in-the-hills"
              ? "bg-[#1E88C7] text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Lake in the Hills, IL
        </button>
      </div>

      {/* Main Details Stack */}
      <div className="space-y-6 text-slate-800">
        {/* Item 1: Address */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#B9E1F5]/40 text-[#1E88C7] flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-base">Address</h4>
            <p className="text-sm text-slate-500 leading-snug">{loc.address}</p>
            <a
              href={loc.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs font-semibold text-[#1E88C7] hover:underline pt-0.5"
            >
              Get Directions →
            </a>
          </div>
        </div>

        {/* Item 2: Phone */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#B9E1F5]/40 text-[#1E88C7] flex items-center justify-center shrink-0">
            <Phone className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-base">Phone</h4>
            <a
              href={`tel:${loc.phone}`}
              className="font-black text-[#1E88C7] text-2xl tracking-tight block hover:opacity-85 transition-opacity"
            >
              {loc.phone}
            </a>
            <span className="text-xs text-slate-400 block font-normal">
              Tap to call directly
            </span>
          </div>
        </div>

        {/* Item 3: Email */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#B9E1F5]/40 text-[#1E88C7] flex items-center justify-center shrink-0">
            <Mail className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-900 text-base">Email</h4>
            <a
              href={`mailto:${loc.email}`}
              className="text-sm text-[#1E88C7] hover:underline font-medium block"
            >
              {loc.email}
            </a>
          </div>
        </div>

        {/* Item 4: Hours of Operation */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[#B9E1F5]/40 text-[#1E88C7] flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div className="flex-1 space-y-2">
            <h4 className="font-bold text-slate-900 text-base">Hours of Operation</h4>
            <div className="space-y-1.5 text-xs text-slate-600 max-w-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Monday – Friday</span>
                <span className="font-bold text-slate-900">{loc.hours.weekdays}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Saturday</span>
                <span className="font-bold text-slate-900">{loc.hours.saturday}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Sunday</span>
                <span className="font-bold text-slate-900">{loc.hours.sunday}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Item 5: Full-Width Prominent Call Now Button */}
        <div className="pt-2">
          <a
            href={`tel:${loc.phone}`}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl bg-[#1E88C7] hover:bg-[#1670a5] text-white font-black text-base shadow-lg shadow-sky-600/20 active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
          >
            <Phone className="h-5 w-5 shrink-0" />
            <span>Call Now — {loc.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
