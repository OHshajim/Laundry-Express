import Link from "next/link";
import { Phone, Mail, ExternalLink, ShieldCheck } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";
import { MascotBadge } from "@/components/shared/mascot-badge";
import { FloatingBubbles } from "./floating-bubbles";

/**
 * Footer Component
 *
 * Semantic, SEO-rich pure black footer featuring:
 * - Ambient low-density floating bubbles (count=8)
 * - Operating windows and transparent pricing overview
 * - Service area coverage (without exact GPS per privacy review)
 * - Direct links to Terms & Guarantee Policy and Customer Dashboard
 * - Strict adherence to the 100-250 lines rule
 */
export function Footer() {
  return (
    <footer className="relative bg-black text-slate-300 border-t border-neutral-900 pt-16 pb-12 overflow-hidden">
      {/* Ambient Bubble Background Effect (Lower-density count={8}) */}
      <FloatingBubbles variant="footer" count={8} className="opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-neutral-800">
          {/* Brand & Mascot */}
          <div className="md:col-span-1 space-y-4">
            <MascotBadge size="sm" withSpeech speechText="Clean clothes delivered fast!" />
            <p className="text-xs text-neutral-400 leading-relaxed">
              Laundry Express is your reliable doorstep wash &amp; fold hero. Pickup in minutes, washed with premium care, and returned fresh to your doorstep.
            </p>
            <Link
              href="/terms#guarantee-policy"
              className="text-xs text-[#EC4899] hover:text-[#F472B6] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="h-4 w-4 text-[#EC4899]" />
              <span>100% Satisfaction &amp; Clean Guarantee</span>
            </Link>
          </div>

          {/* Operating Windows */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Pickup &amp; Delivery Windows
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
                <span className="font-bold text-white block">Morning Window</span>
                8:00 AM – 12:00 PM (Daily)
              </li>
              <li className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/80">
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
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <strong className="text-white">1 Bag:</strong> $32.50 wash (about 2 loads) + $10.00 delivery fee
              </li>
              <li>
                <strong className="text-[#EC4899]">2+ Bags:</strong> $32.50/bag &amp;{" "}
                <span className="text-[#EC4899] font-bold uppercase drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]">
                  FREE Delivery ($0.00)
                </span>
              </li>
              <li>
                <strong className="text-white">By Weight (KG):</strong> $2.75/KG (5KG minimum)
              </li>
              <li>
                <strong className="text-white">Saver Packs:</strong> 5 Bags for $145.00
              </li>
            </ul>
          </div>

          {/* Service Area & Direct Contact (GPS removed per privacy review) */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white tracking-wide uppercase">
              Service Area (30-Mile Radius)
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Lake in the Hills, Algonquin, Crystal Lake, Huntley, Cary, Elgin, Schaumburg &amp; Northwest Suburbs.
            </p>
            <div className="pt-1 space-y-1.5 text-xs">
              <a
                href={`tel:${APP_CONFIG.supportPhone}`}
                className="text-white hover:text-[#EC4899] font-semibold flex items-center gap-1.5 transition-all"
              >
                <Phone className="h-3.5 w-3.5 text-[#EC4899]" />
                {APP_CONFIG.supportPhone}
              </a>
              <a
                href={`mailto:${APP_CONFIG.supportEmail}`}
                className="text-neutral-400 hover:text-[#EC4899] font-medium flex items-center gap-1.5 truncate transition-all"
              >
                <Mail className="h-3.5 w-3.5 text-[#EC4899]" />
                {APP_CONFIG.supportEmail}
              </a>
              <a
                href={APP_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-300 hover:text-[#EC4899] font-semibold flex items-center gap-1.5 pt-0.5 transition-all"
              >
                <span className="h-3.5 w-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">f</span>
                Follow on Facebook
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Legal */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Laundry Express. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Link href="/" className="hover:text-[#EC4899] transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-[#EC4899] transition-colors">
              Plans &amp; Bags
            </Link>
            <Link href="/dashboard" className="hover:text-[#EC4899] transition-colors font-bold text-slate-300">
              Customer Portal
            </Link>
            <Link href="/terms" className="hover:text-[#EC4899] transition-colors">
              Terms &amp; Guarantees
            </Link>
            <Link href="/contact" className="hover:text-[#EC4899] transition-colors">
              Contact Us
            </Link>
            <Link href="/#faq" className="hover:text-[#EC4899] transition-colors">
              FAQ
            </Link>
          </div>
          <p className="text-[11px] text-neutral-500">
            Powered by{" "}
            <a
              href="https://strixdevs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-neutral-300 hover:text-[#EC4899] underline underline-offset-2 transition-all hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.7)]"
            >
              STRIX DEVS
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// Backward compatibility alias for any existing references
export const SiteFooter = Footer;
export default Footer;
