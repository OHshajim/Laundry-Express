import * as React from "react";
import Link from "next/link";
import { ShieldCheck, Truck, Sparkles, HeartHandshake, XCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GUARANTEES = [
  {
    icon: Truck,
    title: "2+ Bags = 100% FREE Delivery",
    desc: "Single bags have a standard $10.00 delivery fee. Order 2 bags or more and your delivery fee drops straight to $0.00!",
    badge: "Smart Savings",
  },
  {
    icon: ShieldCheck,
    title: "Dual Photo Proof Guarantee",
    desc: "Every pickup and drop-off is photographed by your driver. Real-time visual tracking ensures zero lost items or mix-ups.",
    badge: "Visual Verification",
  },
  {
    icon: HeartHandshake,
    title: "100% Freshness Guarantee",
    desc: "If any load is not washed, dried, or folded to your satisfaction, we'll re-wash it completely free of charge.",
    badge: "Zero Risk",
  },
  {
    icon: Sparkles,
    title: "Hospital-Grade Hygiene",
    desc: "Commercial sanitize cycles, ozone treatment, and machines disinfected between every individual customer load.",
    badge: "Clean Living",
  },
];

const COMPARISON_ROWS = [
  {
    feature: "Time spent per week",
    traditional: "3 to 4 hours waiting at laundromats",
    express: "2 minutes scheduling on your phone",
  },
  {
    feature: "Delivery fee transparency",
    traditional: "Hidden fuel surcharges & service fees",
    express: "Clear: $10 for 1 bag, FREE for 2+ bags",
  },
  {
    feature: "Lost items & accountability",
    traditional: "Disclaimers & 'wash at your own risk'",
    express: "Full photo proof at pickup and delivery",
  },
  {
    feature: "Detergent customization",
    traditional: "Whatever cheap powder is in the machine",
    express: "Choose Tide, Eco-Plant, or Hypoallergenic",
  },
];

export function ExperienceSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-sky-50/40 via-white to-slate-50 border-b border-sky-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Badge variant="outline" className="mb-3 text-sky-700 bg-sky-50 border-sky-200">
            The Laundry Express Experience
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why Thousands Never Go to Laundromats Again
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Reclaim your weekends. We handle sorting, washing, drying, and folding with superhero precision.
          </p>
        </div>

        {/* Guarantees 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {GUARANTEES.map((g) => {
            const Icon = g.icon;
            return (
              <div
                key={g.title}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      {g.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{g.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Comparison Table: Desktop table, Mobile adaptive cards */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
            Laundromats vs. Laundry Express
          </h3>

          <div className="space-y-4">
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50/70 border border-slate-100 items-center text-xs"
              >
                <div className="font-bold text-slate-800">{row.feature}</div>
                <div className="flex items-center gap-2 text-slate-500">
                  <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                  <span>{row.traditional}</span>
                </div>
                <div className="flex items-center gap-2 font-semibold text-sky-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{row.express}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/pricing">
              <Button variant="hero" size="lg">
                <span>View Plans &amp; Pricing</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
