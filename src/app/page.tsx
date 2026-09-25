import type { Metadata } from "next";
import { SiteHeader } from "@/components/shared/site-header";
import { PromoBanner } from "@/components/shared/promo-banner";
import { HeroSection } from "@/components/shared/hero-section";
import { ServicesSection } from "@/components/home/services-section";
import { ProcessSection } from "@/components/home/process-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { FaqSection } from "@/components/shared/faq-section";
import { HomeCtaBanner } from "@/components/home/home-cta-banner";
import { SiteFooter } from "@/components/shared/site-footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { getLocalBusinessSchema, getFaqSchema } from "@/lib/seo/jsonld-schemas";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: "Laundry Express — Superhero Doorstep Wash & Fold Laundry Service",
  description:
    "Professional doorstep laundry pickup & delivery. 1 Bag = $10.00 fee; 2+ Bags = FREE delivery! Operating daily 8am-12pm & 1pm-6pm with photo proof guarantee.",
  keywords: [
    "laundry pickup and delivery",
    "wash and fold service",
    "doorstep laundry service",
    "same day laundry delivery",
    "per bag laundry pricing",
    "commercial laundry by kg",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Laundry Express — Fast Doorstep Laundry Service",
    description: "2+ Bags = FREE Delivery. 100% Photo Proof Guarantee.",
    url: APP_CONFIG.url,
    siteName: "Laundry Express",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laundry Express — Doorstep Laundry Service",
    description: "2+ Bags = FREE Delivery. Daily slots: 8am–12pm & 1pm–6pm.",
    images: ["/brand/logo-badge.jpg"],
  },
};

export default function HomePage() {
  const localBusinessJsonLd = getLocalBusinessSchema();
  const faqJsonLd = getFaqSchema();

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden pb-16 md:pb-0">
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

      {/* Main Content Sections — Streamlined & Useful */}
      <main className="flex-1">
        {/* Superhero Mascot & Core Proposition Hero */}
        <HeroSection />

        {/* Core Laundry Services */}
        <div id="services">
          <ServicesSection />
        </div>

        {/* 4-Step Process & Photo Proof Journey */}
        <ProcessSection />

        {/* Moderated Customer Reviews & Photos */}
        <div id="reviews">
          <ReviewsSection />
        </div>

        {/* Operational & Service FAQs */}
        <div id="faq">
          <FaqSection />
        </div>

        {/* High-Conversion Bottom Banner */}
        <HomeCtaBanner />
      </main>

      {/* Semantic SEO-Rich Footer */}
      <SiteFooter />

      {/* Native Mobile Bottom App Bar */}
      <MobileBottomNav />
    </div>
  );
}
