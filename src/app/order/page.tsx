import * as React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { OrderFlow } from "@/components/order/order-flow";
import { Sparkles, ShieldCheck, Truck } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Book Laundry Pickup & Pay — Fast Checkout",
  description:
    "Schedule your morning (8am–12pm) or afternoon (1pm–6pm) laundry pickup. 1 Bag = $10.00 fee; 2+ Bags = FREE delivery. Secure Stripe checkout with driver photo proof.",
  keywords: [
    "order laundry pickup",
    "book laundry online",
    "wash and fold checkout",
    "doorstep laundry payment",
    "free laundry delivery booking",
  ],
  alternates: {
    canonical: "/order",
  },
  openGraph: {
    title: "Laundry Express — Book Pickup & Stripe Checkout",
    description: "Book doorstep laundry pickup in 2 minutes. 2+ Bags = FREE Delivery.",
    url: `${APP_CONFIG.url}/order`,
    siteName: "Laundry Express",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Checkout" }],
    locale: "en_US",
    type: "website",
  },
};

function OrderLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse py-8">
      <div className="h-16 bg-slate-100 rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-32 bg-slate-100 rounded-2xl" />
          <div className="h-40 bg-slate-100 rounded-2xl" />
          <div className="h-48 bg-slate-100 rounded-2xl" />
        </div>
        <div className="h-96 bg-slate-100 rounded-2xl" />
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip pt-8 md:pt-10">
      {/* Sticky Global Navigation Navbar */}
      <Navbar />

      <main className="flex-1 py-10 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Header Title */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span>Step-by-Step Checkout &amp; Stripe Payment</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Schedule Your Pickup &amp; Wash
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Choose your wash preference, pickup slot, and enter your address. We pick up, professionally wash, crisp fold, and return to your door.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-500">
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <Truck className="h-3.5 w-3.5" /> Doorstep Pickup &amp; Return
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 font-semibold text-sky-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Photo Proof Guaranteed
              </span>
              <span>•</span>
              <span className="text-slate-600">Daily Slots: 8am-12pm &amp; 1pm-6pm</span>
            </div>
          </div>

          {/* Main Booking Wizard in Suspense Boundary */}
          <React.Suspense fallback={<OrderLoadingSkeleton />}>
            <OrderFlow />
          </React.Suspense>
        </div>
      </main>

      {/* Global Semantic Footer */}
      <Footer />

      {/* Native Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
}
