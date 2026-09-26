"use client";

import * as React from "react";
import { Navigation, ExternalLink, ShieldCheck, MapPin } from "lucide-react";
import { SERVICE_CITIES } from "@/lib/constants";

// Address replaced with service-area radius per privacy review — confirm with client whether a specific address should ever be public.

export interface GoogleMapProps {
  title?: string;
  className?: string;
}

/**
 * GoggleMap Component
 *
 * Approximate service-area map view with a shaded 30-mile service-radius coverage indicator.
 * Protects facility privacy by displaying regional territory rather than an exact pinpoint address.
 *
 * Included Features:
 * - Regional Google Maps overview centered on Lake in the Hills, IL
 * - Shaded 30-mile service-radius visual indicator overlay
 * - Service area township badge list
 * - Direct external maps linking
 */
export function GoggleMap({
  title = "Lake in the Hills & 30-Mile Service Area",
  className = "",
}: GoogleMapProps) {
  // Approximate regional map centered on Lake in the Hills / Northwest Chicago Suburbs
  const embedUrl = "https://maps.google.com/maps?q=Lake+in+the+Hills,+IL&hl=en&z=11&output=embed";

  return (
    <div
      className={`relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden border border-pink-200/90 bg-slate-100 shadow-[0_0_35px_rgba(236,72,153,0.12)] flex flex-col justify-between ${className}`}
    >
      <iframe
        title={title}
        src={embedUrl}
        width="100%"
        height="100%"
        className="w-full h-full min-h-[480px] border-0"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />

      {/* Visual Shaded 30-Mile Service-Radius Representation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-[#EC4899]/70 bg-[#EC4899]/10 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-pulse flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-200 shadow-md text-[11px] font-black text-[#BE185D] flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#EC4899]" />
            <span>30-Mile Service Coverage Zone</span>
          </div>
        </div>
      </div>

      {/* Top Coverage Indicator Badge */}
      <div className="absolute top-4 left-4 z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-pink-200 shadow-md text-xs font-black text-slate-800">
          <ShieldCheck className="h-4 w-4 text-[#EC4899]" />
          <span>Lake in the Hills &amp; 30-Mile Territory</span>
        </div>
      </div>

      {/* Bottom Service Towns Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-pink-200 shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 overflow-x-auto w-full sm:w-auto py-1">
          <MapPin className="h-4 w-4 text-[#EC4899] shrink-0" />
          <span className="text-slate-500 font-medium">Covering:</span>
          <span className="text-slate-900 truncate">
            {SERVICE_CITIES.slice(0, 4).join(", ")} &amp; nearby
          </span>
        </div>

        <a
          href="https://maps.google.com/?q=Lake+in+the+Hills,+IL"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#EC4899] hover:bg-[#BE185D] text-white font-black text-xs shadow-md shadow-pink-500/25 transition-all active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0"
        >
          <Navigation className="h-3.5 w-3.5 shrink-0" />
          <span>View Territory Map</span>
          <ExternalLink className="h-3 w-3 shrink-0 ml-0.5" />
        </a>
      </div>
    </div>
  );
}

export default GoggleMap;
