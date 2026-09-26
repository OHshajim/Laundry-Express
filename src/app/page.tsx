import type { Metadata } from "next";
import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/components/shared/hero-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { ReviewsSection } from "@/components/reviews/reviews-section";
import { FaqSection } from "@/components/shared/faq-section";
import { HomeCtaBanner } from "@/components/home/home-cta-banner";
import { Footer } from "@/components/shared/footer";
import { MobileBottomNav } from "@/components/shared/mobile-bottom-nav";
import { getLocalBusinessSchema, getFaqSchema } from "@/lib/seo/jsonld-schemas";
import { APP_CONFIG } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.url),
  title: "Laundry Express — Pick Up • Wash • Fold • Deliver | More Time For What Matters",
  description:
    "Laundry Piling Up? $32.50 per 13-gallon bag (about 2 loads). $10 pickup & delivery, or FREE on 2+ bags! Serving Lake in the Hills, Algonquin, Crystal Lake, Huntley, Cary, Elgin & Schaumburg (30-mile radius).",
  keywords: [
    "laundry pickup and delivery",
    "wash and fold service",
    "doorstep laundry service",
    "lake in the hills laundry",
    "algonquin laundry pickup",
    "per bag laundry pricing",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "Laundry Piling Up? $32.50 per 13-gal bag (about 2 loads). FREE pickup & delivery on 2+ bags! Serving Lake in the Hills & 30-mile radius.",
    url: APP_CONFIG.url,
    siteName: "Laundry Express",
    images: [{ url: "/brand/logo-badge.jpg", width: 1200, height: 630, alt: "Laundry Express Logo" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laundry Express — Pick Up • Wash • Fold • Deliver",
    description: "More Time For What Matters. $32.50 per 13-gallon bag. FREE delivery on 2+ bags. Daily slots: 8am–12pm & 1pm–6pm.",
    images: ["/brand/logo-badge.jpg"],
  },
};

export default function HomePage() {
  const localBusinessJsonLd = getLocalBusinessSchema();
  const faqJsonLd = getFaqSchema();

  /**
   * HomePage Shell
   * Clean, high-converting layout featuring superhero brand alignment,
   * static primary navigation bar, and structured schema microdata.
   * Merges services & 4-step process into single animated HowItWorksSection.
   */
  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-clip pb-16 md:pb-0">
      {/* Schema.org Structured Microdata for SEO & AI / LLM Agents */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Sticky Main Navigation Bar */}
      <Navbar />

      {/* Main Content Sections — Streamlined & Useful */}
      <main className="flex-1">
        {/* Superhero Mascot & Core Proposition Hero */}
        <HeroSection />

        {/* Unified Interactive Services & Process Journey */}
        <div id="services">
          <div id="process">
            <HowItWorksSection />
          </div>
        </div>

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

      {/* Semantic SEO-Rich Pure Black Footer */}
      <Footer />

      {/* Native Mobile Bottom App Bar */}
      <MobileBottomNav />
    </div>
  );
}
