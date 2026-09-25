import Link from "next/link";
import { Clock, ShieldCheck, MapPin, Sparkles, Heart } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { MascotBadge } from "@/components/shared/mascot-badge";

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Mascot */}
          <div className="md:col-span-1 space-y-4">
            <MascotBadge size="sm" withSpeech speechText="Clean clothes delivered fast!" />
            <p className="text-xs text-slate-400 leading-relaxed">
              Laundry Express is your reliable doorstep wash &amp; fold hero. Pickup in minutes, washed with premium care, and returned fresh to your doorstep.
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Satisfaction &amp; Clean Guarantee</span>
            </div>
          </div>

          {/* Operating Windows (Strict SEO Hours) */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" />
              Pickup &amp; Delivery Windows
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block">Morning Window</span>
                8:00 AM – 12:00 PM (Daily)
              </li>
              <li className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <span className="font-bold text-white block">Afternoon Window</span>
                1:00 PM – 6:00 PM (Daily)
              </li>
            </ul>
          </div>

          {/* Pricing Summary */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Transparent Pricing
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <strong className="text-white">1 Bag:</strong> $15.00 wash + $10.00 delivery fee
              </li>
              <li>
                <strong className="text-emerald-400">2+ Bags:</strong> $15.00/bag &amp;{" "}
                <span className="text-emerald-400 font-bold uppercase">Free Delivery ($0.00)</span>
              </li>
              <li>
                <strong className="text-white">By Weight (KG):</strong> $2.75/KG (5KG minimum)
              </li>
              <li>
                <strong className="text-white">Saver Packs:</strong> 5 Bags for $65.00
              </li>
            </ul>
          </div>

          {/* Service Area & Support */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wide uppercase flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-400" />
              Service Areas
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Serving the entire downtown metro area, north &amp; south suburbs, university campuses, and residential districts.
            </p>
            <div className="pt-2 text-xs">
              <span className="text-slate-500 block">Need custom bulk laundry?</span>
              <a href={`tel:${APP_CONFIG.supportPhone}`} className="text-sky-400 hover:underline font-semibold">
                Call {APP_CONFIG.supportPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Laundry Express. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#faq" className="hover:text-slate-300">
              FAQ
            </Link>
            <Link href="/llms.txt" className="hover:text-slate-300">
              llms.txt (AI Spec)
            </Link>
            <Link href="/admin" className="hover:text-slate-300">
              Admin Gateway
            </Link>
          </div>
          <p className="flex items-center gap-1 text-[11px] text-slate-600">
            Powered with <Heart className="h-3 w-3 text-rose-600 fill-rose-600" /> by STRIX DEVS
          </p>
        </div>
      </div>
    </footer>
  );
}
