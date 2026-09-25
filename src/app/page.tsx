import { SiteHeader } from "@/components/shared/site-header";
import { PromoBanner } from "@/components/shared/promo-banner";
import { HeroSection } from "@/components/shared/hero-section";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { PricingSection } from "@/components/shared/pricing-section";
import { PackagesSection } from "@/components/shared/packages-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { FaqSection } from "@/components/shared/faq-section";
import { SiteFooter } from "@/components/shared/site-footer";
import { getLocalBusinessSchema, getFaqSchema } from "@/lib/seo/jsonld-schemas";

import { APP_CONFIG } from "@/lib/constants";

export const metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: "Laundry Express — Superhero Doorstep Wash & Fold Laundry Service",
  description:
    "Professional doorstep laundry pickup & delivery. 1 Bag = $10.00 fee; 2+ Bags = FREE delivery! Operating daily 8am-12pm & 1pm-6pm with photo proof guarantee.",
  openGraph: {
    title: "Laundry Express — Fast Doorstep Laundry Service",
    description: "2+ Bags = FREE Delivery. 100% Photo Proof Guarantee.",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Logo" }],
  },
};

export default function HomePage() {
  const localBusinessJsonLd = getLocalBusinessSchema();
  const faqJsonLd = getFaqSchema();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Schema.org Structured Microdata for SEO & AI / LLM Agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Dismissible Promo Announcement Bar */}
      <PromoBanner />

      {/* Global Navigation Header */}
      <SiteHeader />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Superhero Mascot & Core Proposition Hero */}
        <HeroSection />

        {/* Live Booking Wizard Flow */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Schedule Your Laundry Pickup
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your service, choose your 8am–12pm or 1pm–6pm window, and confirm your doorstep presence.
              </p>
            </div>

            <BookingWizard />
          </div>
        </section>

        {/* Transparent Pricing ($10 vs Free) */}
        <PricingSection />

        {/* Pre-Paid Saver Packages */}
        <PackagesSection />

        {/* Moderated Customer Reviews & Photos */}
        <ReviewsSection />

        {/* Operational & Service FAQs */}
        <FaqSection />
      </main>

      {/* Semantic SEO-Rich Footer */}
      <SiteFooter />
    </div>
  );
}
