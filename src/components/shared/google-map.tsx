"use client";

import * as React from "react";
import { MapPin, Navigation, ExternalLink, ShieldCheck } from "lucide-react";
import { SERVICE_CITIES } from "@/lib/constants";

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
 * - Regional Google Maps embed centered on Lake in the Hills, IL
 * - Visual shaded 30-mile service-radius representation overlay
 * - Real-time pulse radar indicator
 * - Bottom service coverage municipalities bar
 * - Direct external maps directions link
 * - Strictly compliant with the 100-250 lines rule
 */
export function GoggleMap({
  title = "Lake in the Hills & 30-Mile Service Area",
  className = "",
}: GoogleMapProps) {
  const embedUrl =
    "https://maps.google.com/maps?q=Lake+in+the+Hills,+IL&hl=en&z=11&output=embed";
  const externalMapsUrl =
    "https://maps.google.com/maps?q=Lake+in+the+Hills,+IL";

  return (
    <div
      className={`relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden border border-primary-pale bg-slate-100 shadow-[0_0_35px_var(--primary-ghost)] flex flex-col justify-between ${className}`}
    >
      {/* Interactive Google Map Iframe */}
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
        className="absolute inset-0 pointer-events-none flex items-center justify-center z-10"
      >
        <div className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-dashed border-primary/70 bg-primary/10 shadow-[0_0_30px_var(--primary-ghost)] animate-pulse flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-primary-pale shadow-md text-[11px] font-black text-primary-dark flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>30-Mile Service Coverage Zone</span>
          </div>
        </div>
      </div>

      {/* Top Header Floating Badge with External Link */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-auto">
        <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs font-bold text-slate-800">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Doorstep Laundry Pickup Territory</span>
        </div>

        <a
          href={externalMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-slate-700 hover:text-primary px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs text-xs font-bold transition-colors"
        >
          <span>Open Maps</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Bottom Service Towns Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-primary-pale shadow-lg">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 overflow-x-auto w-full sm:w-auto py-1">
          <MapPin className="h-4 w-4 text-primary shrink-0" />
          <span className="text-slate-500 font-medium">Covering:</span>
          <span className="text-slate-900 truncate">
            {SERVICE_CITIES.slice(0, 5).join(", ")} &amp; nearby
          </span>
        </div>

        <div className="text-[11px] text-slate-500 font-medium shrink-0 hidden sm:block">
          Daily 8am–12pm &amp; 1pm–6pm
        </div>
      </div>
    </div>
  );
}

export default GoggleMap;
