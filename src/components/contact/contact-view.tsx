"use client";

import * as React from "react";
import { LocationCard } from "@/components/contact/location-card";
import { GoggleMap } from "@/components/shared/google-map";

interface SelectedLocation {
  id: "long-beach" | "lake-in-the-hills";
  title: string;
  address: string;
  coordinates: { lat: number; lng: number };
}

const DEFAULT_LOCATION: SelectedLocation = {
  id: "long-beach",
  title: "5210 Long Beach Blvd, Long Beach, CA 90805, United States",
  address: "5210 Long Beach Blvd, Long Beach, CA 90805, United States",
  coordinates: { lat: 33.8369, lng: -118.1988 },
};

/**
 * ContactView Component
 *
 * Implements the responsive two-column contact layout matching the client design:
 * Left side: Address, click-to-call Phone, Email, Hours of Operation, Call Now button.
 * Right side: Clean Google Map with soft rounded borders and marker.
 *
 * Features:
 * - Direct click-to-call integration
 * - Interactive Google Map provider via @vis.gl/react-google-maps
 * - Dynamic location facility switcher (Long Beach, CA and Lake in the Hills, IL)
 * - Anti-overflow responsive wrapping on mobile and tablets
 * - Custom scrollbar integration across the viewport
 *
 * (Contact form removed per instructions).
 */
export function ContactView() {
  const [activeLoc, setActiveLoc] = React.useState<SelectedLocation>(DEFAULT_LOCATION);

  const handleLocationChange = (loc: {
    id: "long-beach" | "lake-in-the-hills";
    title: string;
    address: string;
    coordinates: { lat: number; lng: number };
  }) => {
    setActiveLoc({
      id: loc.id,
      title: loc.title,
      address: loc.address,
      coordinates: loc.coordinates,
    });
  };

  return (
    <div className="w-full space-y-10">
      {/* 2-Column Responsive Layout: Left Details, Right Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left Column: Contact Details Cards & Operating Schedule */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <LocationCard
            activeLocationId={activeLoc.id}
            onLocationChange={handleLocationChange}
          />
        </div>

        {/* Right Column: Interactive Google Map */}
        <div className="lg:col-span-6 min-h-[460px] sm:min-h-[520px] flex">
          <GoggleMap
            latitude={activeLoc.coordinates.lat}
            longitude={activeLoc.coordinates.lng}
            zoom={activeLoc.id === "long-beach" ? 16 : 14}
            title={activeLoc.title}
            address={activeLoc.address}
            className="w-full h-full min-h-[460px] sm:min-h-[520px]"
          />
        </div>
      </div>

      {/* Helpful Support Footer Strip & Direct Assistance */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/80 text-center text-xs text-slate-500 shadow-2xs space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-700">
          <span>⚡ 24-Hour Wash &amp; Fold Turnaround</span>
          <span className="text-slate-300">•</span>
          <span>📸 Doorstep Photo Proof Guarantee</span>
          <span className="text-slate-300">•</span>
          <span>🚚 2+ Bags = 100% FREE Delivery</span>
        </div>
        <p className="leading-relaxed text-slate-500">
          Questions about bag capacity, pickup slots, or recurring service? Explore our{" "}
          <a href="/pricing" className="text-[#1E88C7] font-bold hover:underline">
            Plans &amp; Bags
          </a>{" "}
          or view our{" "}
          <a href="/#faq" className="text-[#1E88C7] font-bold hover:underline">
            Frequently Asked Questions
          </a>
          . We are at your service 7 days a week.
        </p>
      </div>
    </div>
  );
}

export default ContactView;
