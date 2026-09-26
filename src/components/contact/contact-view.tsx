"use client";

import * as React from "react";
import Link from "next/link";
import { MapPin, Clock, ShieldCheck } from "lucide-react";
import { LocationCard, OFFICIAL_LOCATION } from "@/components/contact/location-card";
import { GoggleMap } from "@/components/shared/google-map";

// Address replaced with service-area radius per privacy review — confirm with client whether a specific address should ever be public.

/**
 * ContactView Component
 *
 * Implements the responsive two-column contact showcase:
 * - Left side: Regional territory, click-to-call Phone (815-575-9536), Email, Hours of Operation,
 *   and high-converting Bubble Pink Call Now button.
 * - Right side: Clean Google Map displaying shaded 30-mile service radius.
 *
 * Features:
 * - Direct click-to-call integration with tel: protocols
 * - Approximate service territory display protecting operations privacy
 * - Bubble Pink highlights and glowing container borders
 * - Responsive anti-overflow wrapping across mobile, tablet, and desktop viewports
 */
export function ContactView() {
  return (
    <div className="w-full space-y-10">
      {/* 2-Column Responsive Layout: Left Details, Right Google Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
        {/* Left Column: Contact Details Cards & Operating Schedule */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <LocationCard location={OFFICIAL_LOCATION} />
        </div>

        {/* Right Column: Interactive Google Map with 30-Mile Shaded Radius */}
        <div className="lg:col-span-6 min-h-[460px] sm:min-h-[520px] flex">
          <GoggleMap
            title={OFFICIAL_LOCATION.title}
            className="w-full h-full min-h-[460px] sm:min-h-[520px]"
          />
        </div>
      </div>

      {/* Dispatch Area Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-100 text-[#EC4899] flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">30-Mile Service Territory</span>
            <span className="text-[11px] text-slate-500">Lake in the Hills, Algonquin, Crystal Lake, Huntley, Cary, Elgin &amp; Schaumburg</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-100 text-[#EC4899] flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">Daily 8am-6pm Operations</span>
            <span className="text-[11px] text-slate-500">Morning &amp; Afternoon Slots</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-pink-100 shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-pink-100 text-[#EC4899] flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-xs font-black text-slate-900 block">Guaranteed Photo Proof</span>
            <span className="text-[11px] text-slate-500">Pickup &amp; Porch Drop-off</span>
          </div>
        </div>
      </div>

      {/* Helpful Support Footer Strip & Direct Assistance */}
      <div className="p-6 rounded-3xl bg-white border border-pink-200/80 text-center text-xs text-slate-500 shadow-[0_0_25px_rgba(236,72,153,0.08)] space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-black text-slate-800">
          <span className="flex items-center gap-1.5 text-[#EC4899]">
            <span>⚡</span>
            <span>24-Hour Turnaround</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-slate-700">
            <span>📸</span>
            <span>Doorstep Photo Proof Guarantee</span>
          </span>
          <span className="text-slate-300">•</span>
          <span className="flex items-center gap-1.5 text-[#EC4899]">
            <span>🚚</span>
            <span>2+ Bags = 100% FREE Delivery</span>
          </span>
        </div>

        <p className="leading-relaxed text-slate-600 max-w-2xl mx-auto">
          Need a special pickup request or have delicate wash requirements? Explore our{" "}
          <Link href="/pricing" className="text-[#EC4899] font-black hover:underline">
            Plans &amp; Bags
          </Link>{" "}
          or inspect our{" "}
          <Link href="/#faq" className="text-[#EC4899] font-black hover:underline">
            Frequently Asked Questions
          </Link>
          . Our Lake in the Hills dispatch team is at your service 7 days a week from 8:00 AM to 6:00 PM.
        </p>
      </div>
    </div>
  );
}

export default ContactView;
