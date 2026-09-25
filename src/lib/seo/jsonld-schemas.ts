import { APP_CONFIG } from "@/lib/constants";

/**
 * Generates Schema.org JSON-LD for Laundry Express (LocalBusiness / DryCleaningOrLaundryService).
 */
export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "DryCleaningOrLaundryService",
    name: APP_CONFIG.name,
    description: APP_CONFIG.description,
    url: APP_CONFIG.url,
    telephone: APP_CONFIG.supportPhone,
    priceRange: "$$",
    paymentAccepted: "Credit Card, Apple Pay, Google Pay",
    currenciesAccepted: "USD",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: APP_CONFIG.operatingHours.slot1.opens,
        closes: APP_CONFIG.operatingHours.slot1.closes,
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: APP_CONFIG.operatingHours.slot2.opens,
        closes: APP_CONFIG.operatingHours.slot2.closes,
      },
    ],
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Metropolitan Area & Suburbs",
    },
    makesOffer: [
      {
        "@type": "Offer",
        name: "Standard Bag Wash & Fold Service",
        description:
          "Full laundry wash, dry, and fold service. 1 bag delivery fee is $10.00; 2+ bags have FREE delivery.",
        price: APP_CONFIG.pricing.baseBagPrice,
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Per-Kilogram Commercial & Bulk Laundry",
        description: "Flexible weight-based laundry wash priced per KG with 5KG minimum.",
        price: APP_CONFIG.pricing.baseKgPrice,
        priceCurrency: "USD",
      },
    ],
  };
}

/**
 * Generates FAQ Schema for common customer questions.
 */
export function getFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much is delivery for laundry pickup and drop-off?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you schedule 1 bag, the delivery fee is $10.00. If you schedule 2 or more bags, delivery is 100% FREE ($0.00).",
        },
      },
      {
        "@type": "Question",
        name: "What time slots can I choose for laundry pickup?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "We offer two daily operational slots: Morning (8:00 AM – 12:00 PM) and Afternoon (1:00 PM – 6:00 PM).",
        },
      },
      {
        "@type": "Question",
        name: "What if I am away from home during the pickup window?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Simply select 'Away / Out of Home' when booking and check the box confirming your bags are placed outside your doorstep or porch. Our superhero drivers take a photo proof upon arrival.",
        },
      },
      {
        "@type": "Question",
        name: "How do I know my laundry was picked up and dropped off safely?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Our drivers snap photo proof upon pickup and drop-off. These photos are immediately viewable in both your customer portal and order timeline.",
        },
      },
    ],
  };
}
