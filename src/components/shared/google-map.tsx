"use client";

import * as React from "react";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { Navigation, ExternalLink } from "lucide-react";

export interface GoogleMapProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  title?: string;
  address?: string;
  className?: string;
}

/**
 * GoggleMap Component
 *
 * Implements interactive Google Maps via @vis.gl/react-google-maps.
 * Supports environment API key (NEXT_PUBLIC_GOGGLE_MAP_KEY or NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)
 * with a high-fidelity interactive fallback to ensure zero runtime breaks if no key is supplied.
 * Styled with soft rounded edges matching the superhero brand design system.
 */
export function GoggleMap({
  latitude = 33.8369,
  longitude = -118.1988,
  zoom = 16,
  title = "5210 Long Beach Blvd, Long Beach, CA 90805, United States",
  address = "5210 Long Beach Blvd, Long Beach, CA 90805, United States",
  className = "",
}: GoogleMapProps) {
  const apiKey =
    process.env.NEXT_PUBLIC_GOGGLE_MAP_KEY ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "";

  const location = React.useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  const [hasError, setHasError] = React.useState(false);

  // If no API key is configured or API throws, render interactive Google Maps iframe fallback
  if (!apiKey || hasError) {
    const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=${zoom}&output=embed`;

    return (
      <div
        className={`relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-xl ${className}`}
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

        {/* Floating Quick Action */}
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={`https://maps.google.com/?q=${latitude},${longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E88C7] hover:bg-[#1670a5] text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
          >
            <Navigation className="h-3.5 w-3.5 shrink-0" />
            <span>Get Directions</span>
            <ExternalLink className="h-3 w-3 shrink-0 ml-0.5" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full min-h-[480px] rounded-3xl overflow-hidden border border-slate-200/80 bg-slate-100 shadow-xl ${className}`}
    >
      <div className="w-full h-full min-h-[480px]">
        <APIProvider apiKey={apiKey} onError={() => setHasError(true)}>
          <Map
            style={{ width: "100%", height: "100%", minHeight: "480px" }}
            defaultCenter={location}
            defaultZoom={zoom}
            gestureHandling="greedy"
            disableDefaultUI
          >
            <Marker position={location} title={title} />
          </Map>
        </APIProvider>
      </div>

      {/* Floating Quick Action */}
      <div className="absolute bottom-4 right-4 z-10">
        <a
          href={`https://maps.google.com/?q=${latitude},${longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1E88C7] hover:bg-[#1670a5] text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
        >
          <Navigation className="h-3.5 w-3.5 shrink-0" />
          <span>Get Directions</span>
          <ExternalLink className="h-3 w-3 shrink-0 ml-0.5" />
        </a>
      </div>
    </div>
  );
}

export default GoggleMap;
