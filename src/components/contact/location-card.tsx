import * as React from "react";
import { MapPin, Clock, Phone, Mail, Navigation, ShieldCheck, CheckCircle2, Globe, ExternalLink } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const SERVICE_ZONES = [
  "Lake in the Hills (Central)",
  "Algonquin & Fox River Grove",
  "Crystal Lake & Cary",
  "Huntley & Lakewood",
  "McHenry & Woodstock",
  "Carpentersville & Dundee",
  "Elgin & South Elgin",
  "Barrington & Inverness",
  "Schaumburg & Hoffman Estates",
  "30-Mile Radius Northwest IL",
];

/**
 * LocationCard Component
 * Displays physical laundry operations hub, operating pickup/delivery windows,
 * live dispatch status, coverage zones, and contact credentials.
 */
export function LocationCard() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="outline" className="text-sky-700 bg-sky-50 border-sky-200">
            Operations &amp; Dispatch Facility
          </Badge>
          <Badge variant="outline" className="text-rose-700 bg-rose-50 border-rose-200">
            30-Mile Service Radius
          </Badge>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
          Laundry Express Central Hub
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Doorstep laundry pickup and delivery serving McHenry County and Northwest Suburbs of Illinois.
        </p>
      </div>

      {/* Physical Address & Coordinates */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
        <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="text-xs space-y-1">
          <span className="font-bold text-slate-900 block">Hub Location &amp; Region:</span>
          <p className="text-slate-700 font-semibold">
            United States, IL · McHenry Co. · Lake in the Hills
          </p>
          <p className="text-slate-500 font-medium">
            Northwest Suburbs of Illinois · Coordinates: 42.1903° N, 88.383743° W
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <a
              href="https://maps.google.com/?q=42.1903,-88.383743"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[11px] text-sky-600 hover:text-sky-700 font-bold hover:underline"
            >
              <Navigation className="h-3 w-3" />
              View on Google Maps (42.1903, -88.383743)
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Operating Pickup & Delivery Windows */}
      <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-sky-600 shrink-0" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
            Daily Operating Windows
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Morning Slot</span>
            <span className="text-sky-700 font-extrabold text-sm">8:00 AM – 12:00 PM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Monday through Sunday</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-sky-100 shadow-2xs">
            <span className="font-bold text-slate-900 block">Afternoon Slot</span>
            <span className="text-sky-700 font-extrabold text-sm">1:00 PM – 6:00 PM</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Monday through Sunday</span>
          </div>
        </div>
      </div>

      {/* Direct Contact Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <a
          href={`tel:${APP_CONFIG.supportPhone}`}
          className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-colors flex items-center gap-3 group"
        >
          <div className="h-8 w-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-600 group-hover:text-white transition-colors">
            <Phone className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-semibold block">Direct Hotline</span>
            <span className="font-bold text-slate-800 group-hover:text-sky-600 transition-colors">
              {APP_CONFIG.supportPhone}
            </span>
          </div>
        </a>

        <a
          href={`mailto:${APP_CONFIG.supportEmail}`}
          className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/40 transition-colors flex items-center gap-3 group"
        >
          <div className="h-8 w-8 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white transition-colors">
            <Mail className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <span className="text-[10px] text-slate-400 font-semibold block">Customer Service</span>
            <span className="font-bold text-slate-800 group-hover:text-rose-600 transition-colors truncate block">
              {APP_CONFIG.supportEmail}
            </span>
          </div>
        </a>
      </div>

      {/* Facebook Social Profile */}
      <a
        href={APP_CONFIG.facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40 hover:bg-blue-50 hover:border-blue-300 transition-colors flex items-center justify-between group text-xs"
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 font-bold text-base shadow-2xs">
            f
          </div>
          <div>
            <span className="font-bold text-slate-900 group-hover:text-blue-700 block">
              Connect on Facebook
            </span>
            <span className="text-[11px] text-slate-500">
              Latest promotions, customer photos &amp; announcements
            </span>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-blue-600 shrink-0" />
      </a>

      {/* Coverage Zones */}
      <div>
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          <span>Active 30-Mile Service Zones (Northwest Suburbs IL)</span>
        </h4>
        <div className="grid grid-cols-2 gap-1.5 text-xs text-slate-600">
          {SERVICE_ZONES.map((zone) => (
            <div key={zone} className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{zone}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
