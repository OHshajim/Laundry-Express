import * as React from "react";
import Link from "next/link";
import { Shirt, Scale, Bed, Clock, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ServiceItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  badgeVariant?: "default" | "success" | "warning" | "danger";
  priceText: string;
  features: string[];
  ctaText: string;
  ctaHref: string;
  icon: React.ComponentType<{ className?: string }>;
}

const SERVICES: ServiceItem[] = [
  {
    id: "wash-and-fold-bags",
    title: "Standard Bag Wash & Fold",
    subtitle: "Everyday Laundry Simplified",
    description:
      "Fill our standard 13-gallon bag with clothes, towels, and day-to-day wear. Washed with your choice of detergent and folded crisp.",
    badge: "2+ Bags = FREE Delivery",
    badgeVariant: "success",
    priceText: "$15.00 / bag",
    features: [
      "Whites & darks separated",
      "Choice of 3 premium detergents",
      "Folded or hung to perfection",
      "1 Bag = $10 delivery, 2+ Bags = $0",
    ],
    ctaText: "Select Bag Plan",
    ctaHref: "/pricing",
    icon: Shirt,
  },
  {
    id: "bulk-kg-commercial",
    title: "Weighed Laundry By the KG",
    subtitle: "For Bulky Loads & Commercial",
    description:
      "Best value for large families, Airbnb hosts, sports teams, and salons. We weigh your laundry accurately upon facility intake.",
    badge: "$2.75 / KG",
    badgeVariant: "default",
    priceText: "$2.75 / kg",
    features: [
      "Precision digital scale intake",
      "Free delivery on orders over $40",
      "Stain pre-treatment included",
      "Photo proof on scale upload",
    ],
    ctaText: "Calculate KG Price",
    ctaHref: "/pricing",
    icon: Scale,
  },
  {
    id: "bedding-delicates",
    title: "Bedding, Linens & Delicates",
    subtitle: "Gentle Fabric Treatment",
    description:
      "Comforters, duvet covers, bedsheets, and sensitive wool or silk garments treated with gentle wash cycles and low-heat tumble drying.",
    badge: "Hypoallergenic",
    badgeVariant: "warning",
    priceText: "From $18.00",
    features: [
      "Zero harsh fragrances or bleach",
      "Low temperature fiber preservation",
      "Ozone sanitization for deep hygiene",
      "Individually inspected and bagged",
    ],
    ctaText: "Book Linens Care",
    ctaHref: "/order",
    icon: Bed,
  },
  {
    id: "express-24h",
    title: "24-Hour Express Turnaround",
    subtitle: "Hero Speed at Your Door",
    description:
      "Need clothes ready for tomorrow morning's flight or business meeting? We pick up today and deliver fresh within 24 hours.",
    badge: "Guaranteed 24h",
    badgeVariant: "danger",
    priceText: "Fast Delivery",
    features: [
      "Morning (8am–12pm) or afternoon (1pm–6pm)",
      "Real-time driver arrival notifications",
      "Pickup & drop-off photo proof",
      "SMS & email status updates",
    ],
    ctaText: "Book Express Pickup",
    ctaHref: "/order",
    icon: Clock,
  },
];

export function ServicesSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-sky-50/40 border-b border-sky-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <Badge variant="outline" className="mb-3 text-sky-700 bg-sky-50 border-sky-200">
            Professional Laundry Services
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Hero Care for Every Garment
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            From single bag apartment pickups to full Airbnb commercial loads, our superheroes wash, dry, and fold with perfection.
          </p>
        </div>

        {/* 4 Cards Grid - Responsive: 1 col on mobile, 2 col on tablet, 4 col on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-sky-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-12 w-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6" />
                    </div>
                    <Badge variant={srv.badgeVariant || "default"}>{srv.badge}</Badge>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                    {srv.title}
                  </h3>
                  <p className="text-xs font-semibold text-sky-600 mb-2">{srv.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {srv.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 mb-4">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Highlights
                    </p>
                    <ul className="space-y-1.5">
                      {srv.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900">{srv.priceText}</span>
                  <Link href={srv.ctaHref}>
                    <Button variant="outline" size="sm" className="text-xs group-hover:bg-sky-600 group-hover:text-white group-hover:border-sky-600">
                      <span>{srv.ctaText}</span>
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
