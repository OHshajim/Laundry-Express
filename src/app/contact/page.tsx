import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { PromoBanner } from "@/components/shared/promo-banner";
import { SiteFooter } from "@/components/shared/site-footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { ContactView } from "@/components/contact/contact-view";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us & Operations Hub — Laundry Express",
  description:
    "Get in touch with Laundry Express. Located at 5210 Long Beach Blvd, Long Beach, CA (33.8369, -118.1988) and Lake in the Hills, McHenry Co., IL (42.1903, -88.383743). Call +15623805780 or 815-575-9536.",
  keywords: [
    "contact laundry express",
    "laundry express location",
    "wash and fold facility long beach",
    "lake in the hills laundry service",
    "customer support laundry",
    "commercial laundry pickup",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Laundry Express — Doorstep Laundry Heroes",
    description: "Facility locations, operating pickup windows, and direct telephone support.",
    url: `${APP_CONFIG.url}/contact`,
    siteName: "Laundry Express",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Contact" }],
    locale: "en_US",
    type: "website",
  },
};

/**
 * ContactPage
 *
 * Dedicated operations & contact showcase page.
 * Implements the 2-column layout requested by the client:
 * Left: Physical address with directions, direct tap-to-call phone, email, and daily operating windows.
 * Right: High-resolution interactive Google Map powered by @vis.gl/react-google-maps.
 *
 * (Contact form removed per instructions).
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 overflow-x-hidden pb-16 md:pb-0">
      {/* Dismissible Promo Banner */}
      <PromoBanner />

      {/* Global Navigation Header */}
      <SiteHeader />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Title & Hero Positioning */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-[#B9E1F5]/40 text-[#141B2E] text-xs font-bold border border-[#B9E1F5] uppercase tracking-wider">
              Doorstep Service 7 Days a Week
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Contact Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E88C7] to-[#D63A3A]">
                Laundry Superheroes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Ready for clean clothes delivered fresh to your door? View our facilities, operating
              hours, or connect with our customer care dispatchers directly.
            </p>
          </div>

          {/* Interactive 2-Column Contact Showcase (Left Details, Right Google Map) */}
          <ContactView />

          {/* Service Guarantee Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-700/60 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-[#F5A623] uppercase tracking-wider block">
                The Laundry Express Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Spotless Wash, Fast Turnaround, Guaranteed Photo Proof
              </h3>
              <p className="text-xs text-slate-400">
                Pickups scheduled daily: 8:00 AM – 12:00 PM and 1:00 PM – 6:00 PM. 2+ bags enjoy 100% free delivery.
              </p>
            </div>

            <a
              href="/order"
              className="shrink-0 px-6 py-3.5 rounded-2xl bg-[#D63A3A] hover:bg-[#b82e2e] text-white font-black text-sm shadow-lg shadow-rose-600/30 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Schedule Pickup Now
            </a>
          </div>
        </div>
      </main>

      {/* Semantic Footer */}
      <SiteFooter />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
