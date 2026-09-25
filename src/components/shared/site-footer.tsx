import Link from "next/link";
import { Phone, Mail, ExternalLink } from "lucide-react";
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
            <p className="text-xs text-sky-400 font-semibold">
              100% Satisfaction &amp; Clean Guarantee
            </p>
          </div>

          {/* Operating Windows */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
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
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
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

          {/* Service Area & Direct Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Location &amp; Service Radius
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lake in the Hills, McHenry Co. &amp; Northwest Suburbs of Illinois (42.1903, -88.383743) within a 30-mile radius.
            </p>
            <div className="pt-1 space-y-1.5 text-xs">
              <a href={`tel:${APP_CONFIG.supportPhone}`} className="text-sky-400 hover:underline font-semibold flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-sky-400" />
                {APP_CONFIG.supportPhone}
              </a>
              <a href={`mailto:${APP_CONFIG.supportEmail}`} className="text-slate-300 hover:text-sky-400 hover:underline font-medium flex items-center gap-1.5 truncate">
                <Mail className="h-3.5 w-3.5 text-rose-400" />
                {APP_CONFIG.supportEmail}
              </a>
              <a
                href={APP_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:underline font-semibold flex items-center gap-1.5 pt-0.5"
              >
                <span className="h-3.5 w-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">f</span>
                Follow on Facebook
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Laundry Express. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-slate-300">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-slate-300">
              Plans &amp; Bags
            </Link>
            <Link href="/contact" className="hover:text-slate-300">
              Contact Us
            </Link>
            <Link href="/order" className="hover:text-slate-300">
              Book Pickup
            </Link>
            <Link href="/#faq" className="hover:text-slate-300">
              FAQ
            </Link>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by{" "}
            <a
              href="https://strixdevs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-slate-300 hover:text-white underline underline-offset-2 transition-colors"
            >
              STRIX DEVS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
