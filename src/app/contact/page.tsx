import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { PromoBanner } from "@/components/shared/promo-banner";
import { SiteFooter } from "@/components/shared/site-footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { LocationCard } from "@/components/contact/location-card";
import { ContactForm } from "@/components/contact/contact-form";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, MapPin, Sparkles } from "lucide-react";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us & Operations Hub — Laundry Express",
  description:
    "Get in touch with Laundry Express. Visit our central wash facility at 1244 Hero Way, call (555) 123-4567, or send us a message. Operating daily 8am-12pm & 1pm-6pm.",
  keywords: [
    "contact laundry express",
    "laundry express location",
    "wash and fold facility",
    "customer support laundry",
    "commercial laundry inquiry",
  ],
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Laundry Express — Doorstep Laundry Heroes",
    description: "Location, operating pickup windows, and direct support.",
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
 * Dedicated contact and operations location page.
 * Provides physical address, operating slots, phone/email, and direct contact form.
 */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 overflow-x-hidden pb-16 md:pb-0">
      {/* Dismissible Promo Banner */}
      <PromoBanner />

      {/* Global Navigation Header */}
      <SiteHeader />

      <main className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header Title */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200">
              <Sparkles className="h-3.5 w-3.5 text-sky-600" />
              <span>We're Here For You 7 Days a Week</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Contact Our{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-rose-600">
                Laundry Superheroes
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Have a question about your order, want to inquire about Airbnb bulk commercial accounts, or need help with a pickup? Reach out anytime.
            </p>
          </div>

          {/* 2-Column Responsive Layout: Left Location Card, Right Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6">
              <LocationCard />
            </div>

            <div className="lg:col-span-6">
              <ContactForm />
            </div>
          </div>

          {/* Quick Resolution Notice */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500 shadow-2xs">
            <p>
              Looking for quick answers about bag capacity, pickup slots, or billing? Visit our{" "}
              <a href="/#faq" className="text-sky-600 font-bold hover:underline">
                Frequently Asked Questions
              </a>{" "}
              or explore our{" "}
              <a href="/pricing" className="text-sky-600 font-bold hover:underline">
                Plans &amp; Pricing Page
              </a>
              .
            </p>
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
