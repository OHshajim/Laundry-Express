import { MapPin, Phone, Mail, Clock, ArrowRight, ShieldCheck } from "lucide-react";

// Address replaced with service-area radius per privacy review — confirm with client whether a specific address should ever be public.

export interface ContactLocationInfo {
  id: string;
  title: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapsUrl: string;
}

export const OFFICIAL_LOCATION: ContactLocationInfo = {
  id: "lake-in-the-hills",
  title: "Lake in the Hills Service Territory",
  // Address replaced with service-area radius per privacy review — confirm with client whether a specific address should ever be public.
  address: "Lake in the Hills & 30-Mile Service Territory (McHenry Co., IL)",
  phone: "815-575-9536",
  email: "customerservice@laundryexpressservices.com",
  hours: "8:00 AM – 6:00 PM",
  mapsUrl: "https://maps.google.com/?q=Lake+in+the+Hills,+IL",
};

interface LocationCardProps {
  location?: ContactLocationInfo;
}

/**
 * LocationCard Component
 *
 * Implements the attractive Bubble Pink contact showcase:
 * 1. Regional Service Territory with "View Coverage Map →"
 * 2. Click-to-call Phone with direct dialing (815-575-9536)
 * 3. Support Email (customerservice@laundryexpressservices.com)
 * 4. Structured Hours of Operation (8:00 AM – 6:00 PM)
 * 5. Attractive Bubble Pink Call Now button
 */
export function LocationCard({ location = OFFICIAL_LOCATION }: LocationCardProps) {
  return (
    <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-pink-200/90 shadow-[0_0_35px_rgba(236,72,153,0.12)] p-6 sm:p-8 space-y-7 transition-all">
      {/* Top Bubble Pink Hub Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-pink-100">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-primary-dark text-xs font-black shadow-xs">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
          <span>Regional Operations Hub</span>
        </div>

        <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-primary" />
          30-Mile Radius Service Territory
        </span>
      </div>

      {/* Main Contact Stack with Bubble Pink Accents */}
      <div className="space-y-6 text-slate-800">
        {/* Item 1: Service Territory & Address */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center shrink-0 shadow-xs border border-pink-200/60">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Service Area
            </h4>
            <p className="text-sm font-semibold text-slate-700 leading-snug">
              {location.address}
            </p>
            <a
              href={location.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-black text-primary hover:text-primary-dark hover:underline pt-0.5"
            >
              <span>Explore Coverage Map</span>
              <ArrowRight className="h-3 w-3 shrink-0" />
            </a>
          </div>
        </div>

        {/* Item 2: Phone with Hero Callout */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center shrink-0 shadow-xs border border-pink-200/60">
            <Phone className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Phone
            </h4>
            <a
              href={`tel:${location.phone}`}
              className="font-black text-primary text-2xl sm:text-3xl tracking-tight block hover:text-primary-dark drop-shadow-[0_0_12px_var(--primary-ghost)] transition-colors"
            >
              {location.phone}
            </a>
            <span className="text-xs text-slate-500 block font-medium">
              Tap to call directly
            </span>
          </div>
        </div>

        {/* Item 3: Email */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center shrink-0 shadow-xs border border-pink-200/60">
            <Mail className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Email
            </h4>
            <a
              href={`mailto:${location.email}`}
              className="text-sm font-bold text-slate-700 hover:text-primary hover:underline block break-all transition-colors"
            >
              {location.email}
            </a>
          </div>
        </div>

        {/* Item 4: Hours of Operation */}
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-pink-100 text-primary flex items-center justify-center shrink-0 shadow-xs border border-pink-200/60">
            <Clock className="h-5 w-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className="font-black text-slate-900 text-sm uppercase tracking-wider">
              Hours of Operation
            </h4>
            <p className="text-sm font-bold text-slate-800">
              All Week: <span className="text-primary font-black">{location.hours}</span>
            </p>
            <span className="text-xs text-slate-400 block font-normal">
              Morning (8am–12pm) &amp; Afternoon (1pm–6pm) Slots
            </span>
          </div>
        </div>

        {/* Item 5: Full-Width Prominent Bubble Pink Call Now Button */}
        <div className="pt-2 flex justify-center">
          <a
            href="/order"
            className="inline-flex justify-center w-full px-7 py-4 rounded-2xl bg-primary hover:bg-primary-dark text-white font-black text-sm shadow-lg shadow-primary/35 transition-all active:scale-[0.98] whitespace-nowrap"
          >
            Schedule Pickup Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default LocationCard;
