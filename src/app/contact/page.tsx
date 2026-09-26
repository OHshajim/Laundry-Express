import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { ContactView } from "@/components/contact/contact-view";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us & Operations Hub — Laundry Express",
  description:
    "Get in touch with Laundry Express. Located in McHenry Co., Lake in the Hills, IL (42.1903, -88.383743). Call 815-575-9536 for doorstep pickup & delivery.",
  keywords: [
    "contact laundry express",
    "laundry express location",
    "lake in the hills laundry service",
    "mchenry county wash and fold",
    "customer support laundry",
    "doorstep laundry pickup",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Laundry Express — Doorstep Laundry Heroes",
    description: "Lake in the Hills facility, operating pickup windows, and direct telephone support.",
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
 * Left: Physical address with directions, direct tap-to-call phone (815-575-9536),
 *       support email, and daily operating windows (8am-6pm).
 * Right: High-resolution interactive Google Map centered on Lake in the Hills, IL.
 * Static navigation header ensures natural scrolling experience.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 overflow-x-clip pb-16 md:pb-0">
      {/* Sticky Global Navigation Navbar */}
      <Navbar />

      <main className="flex-1 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header Title & Hero Positioning */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-block px-3.5 py-1 rounded-full bg-pink-50 text-[#E91E63] text-xs font-black border border-pink-200 uppercase tracking-wider shadow-xs">
              Doorstep Service 7 Days a Week • 8am – 6pm
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Contact Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-[#E91E63] to-rose-600">
                Laundry Superheroes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Ready for clean clothes delivered fresh to your door? View our central facility, operating
              hours, or connect with our customer care dispatchers directly.
            </p>
          </div>

          {/* Interactive 2-Column Contact Showcase (Left Details, Right Google Map) */}
          <ContactView />

          {/* Service Guarantee Banner in Dark Theme with Punch Pink CTA */}
          <div className="rounded-3xl bg-gradient-to-r from-black via-neutral-900 to-black text-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-neutral-800 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-xs font-bold text-[#E91E63] uppercase tracking-wider block drop-shadow-[0_0_8px_rgba(233,30,99,0.5)]">
                The Laundry Express Guarantee
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Spotless Wash, Fast Turnaround, Guaranteed Photo Proof
              </h3>
              <p className="text-xs text-neutral-400">
                Pickups scheduled daily: 8:00 AM – 12:00 PM and 1:00 PM – 6:00 PM. 2+ bags enjoy 100% free delivery.
              </p>
            </div>

            <a
              href="/order"
              className="shrink-0 px-7 py-4 rounded-2xl bg-[#E91E63] hover:bg-[#d81557] text-white font-black text-sm shadow-lg shadow-pink-500/35 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              Schedule Pickup Now
            </a>
          </div>
        </div>
      </main>

      {/* Semantic Pure Black Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
