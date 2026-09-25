import * as React from "react";
import Link from "next/link";
import { Check, ShieldCheck, Sparkles, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const COMPARISON_FEATURES = [
  {
    feature: "Base Pricing Rate",
    bag: "$15.00 / 13-gal bag",
    kg: "$2.75 / kg (5kg min)",
    package: "From $12.50 / bag (prepaid)",
  },
  {
    feature: "Delivery Fee Policy",
    bag: "1 Bag = $10.00 | 2+ Bags = FREE ($0.00)",
    kg: "Free on orders over $40 (else $10)",
    package: "100% FREE on all included pickups",
  },
  {
    feature: "Pickup & Drop-off Windows",
    bag: "8am–12pm or 1pm–6pm Daily",
    kg: "8am–12pm or 1pm–6pm Daily",
    package: "Priority reservation on all slots",
  },
  {
    feature: "Detergent Choice",
    bag: "Tide, Eco-Plant, or Fragrance-Free",
    kg: "Tide, Eco-Plant, or Fragrance-Free",
    package: "All detergents included at no extra charge",
  },
  {
    feature: "Photo Proof Guarantee",
    bag: "Instant pickup & drop-off photo",
    kg: "Pickup, scale weight, & drop-off photo",
    package: "Complete visual tracking on every load",
  },
  {
    feature: "Best Suited For",
    bag: "Individuals, couples, weekly family laundry",
    kg: "Airbnb hosts, hotels, heavy duvets, gyms",
    package: "Frequent wash households & roommates",
  },
];

export function PlanComparison() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-900">
          Compare Laundry Plans Side-by-Side
        </h3>
        <p className="text-sm text-slate-600 mt-1">
          Pick what works best for your schedule and budget. Zero hidden fees.
        </p>
      </div>

      {/* Comparison Table: Desktop full table, Mobile responsive cards */}
      <div className="hidden md:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
              <th className="py-4 px-6 font-bold w-1/4">Feature</th>
              <th className="py-4 px-6 font-bold text-sky-700 w-1/4">By the Bag</th>
              <th className="py-4 px-6 font-bold text-slate-800 w-1/4">By the KG</th>
              <th className="py-4 px-6 font-bold text-rose-700 w-1/4">Saver Packages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COMPARISON_FEATURES.map((item, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-bold text-slate-900">{item.feature}</td>
                <td className="py-4 px-6 text-slate-700 font-medium">{item.bag}</td>
                <td className="py-4 px-6 text-slate-700 font-medium">{item.kg}</td>
                <td className="py-4 px-6 text-slate-700 font-medium">{item.package}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card Stack View */}
      <div className="md:hidden space-y-4">
        {COMPARISON_FEATURES.map((item, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
            <span className="font-bold text-slate-900 block pb-1 border-b border-slate-100">
              {item.feature}
            </span>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">By Bag:</span>
                <span className="font-semibold text-sky-700 text-right">{item.bag}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">By KG:</span>
                <span className="font-semibold text-slate-800 text-right">{item.kg}</span>
              </div>
              <div className="flex justify-between items-start">
                <span className="text-slate-500 font-medium">Saver Pack:</span>
                <span className="font-semibold text-rose-700 text-right">{item.package}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Trust Guarantee Callout */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">100% Satisfaction or Free Re-Wash</h4>
            <p className="text-xs text-slate-600">
              Every garment is backed by our Happiness Guarantee and real-time driver photo verification.
            </p>
          </div>
        </div>

        <Link href="/order" className="shrink-0 w-full sm:w-auto">
          <Button variant="hero" size="sm" className="w-full sm:w-auto">
            <span>Book Your Laundry Pickup</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
