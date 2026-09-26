import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { SiteFooter } from "@/components/shared/site-footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { PlanSelector } from "@/components/pricing/plan-selector";
import { PlanComparison } from "@/components/pricing/plan-comparison";
import { FaqSection } from "@/components/shared/faq-section";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Plans & Pricing — Transparent Laundry Rates",
  description:
    "Honest doorstep laundry pricing. 1 Bag = $10.00 delivery fee; 2+ Bags = FREE ($0.00) delivery fee! Weighed laundry by the KG and discounted saver passes available.",
  keywords: [
    "laundry pricing",
    "wash and fold cost",
    "free laundry delivery",
    "per bag laundry pricing",
    "commercial laundry price per kg",
    "laundry packages",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Laundry Express — Plans & Pricing",
    description: "2+ Bags = FREE Delivery. Zero Hidden Fees.",
    url: `${APP_CONFIG.url}/pricing`,
    siteName: "Laundry Express",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Pricing" }],
    locale: "en_US",
    type: "website",
  },
};

/**
 * PricingPage Component
 *
 * Dedicated plans and pricing breakdown page.
 * Displays standard 13-gallon bag options, weighed bulk laundry by the KG,
 * prepaid saver packages, and detailed plan comparison matrix.
 * Includes instant calculator and side-by-side plan comparisons.
 * Main navigation stays static as users scroll.
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden pb-16 md:pb-0">
      {/* Static Global Navigation Header (Top Nav Removed) */}
      <SiteHeader />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Header Title & Core Delivery Fee Rule Callout */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 uppercase tracking-wide">
              Free Delivery On 2+ Bags Guaranteed
            </span>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Simple, Transparent Plans.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-rose-600">
                Zero Surprises.
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              No hidden service surcharges or surprise fees. Choose between standard bags, weighed bulk by the KG, or pre-paid discount saver packages.
            </p>

            {/* Visual Delivery Rule Highlight Box */}
            <div className="inline-grid grid-cols-1 sm:grid-cols-2 gap-3 p-2 bg-slate-50 border border-slate-200 rounded-2xl max-w-lg mx-auto text-xs text-left">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-slate-900 block mb-0.5">1 Bag (About 2 Loads)</span>
                <span className="text-slate-500">$32.50 wash + </span>
                <span className="font-extrabold text-amber-700">$10.00 delivery fee</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 shadow-2xs">
                <span className="font-bold text-emerald-950 block mb-0.5">2+ Bags Order</span>
                <span className="text-emerald-800">$32.50/bag &amp; </span>
                <span className="font-extrabold text-emerald-600 uppercase">FREE Pickup &amp; Delivery</span>
              </div>
            </div>
          </div>

          {/* Interactive Plan Selector: Bags vs KG vs Packages */}
          <PlanSelector />

          {/* Side-by-Side Comparison Matrix */}
          <PlanComparison />

          {/* Common Pricing Questions */}
          <FaqSection />
        </div>
      </main>

      {/* Semantic Footer */}
      <SiteFooter />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
}
