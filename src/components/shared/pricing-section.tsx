import Link from "next/link";
import { Check, ShoppingBag, Scale, Zap, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FloatingBubbles } from "./floating-bubbles";

export function PricingSection() {
  return (
    <section id="pricing" className="relative overflow-hidden py-20 bg-slate-50/70 scroll-mt-20">
      <FloatingBubbles variant="banner" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-3">
            <Zap className="h-3.5 w-3.5 fill-rose-600 text-rose-600" />
            <span>Clear &amp; Transparent</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
            Simple, Fair Pricing with Zero Surprises
          </h2>
          <p className="text-sm text-slate-600 mt-3 leading-relaxed">
            Order by the bag or by weight. The more laundry you bundle, the more you save.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Bag Pricing Card */}
          <div className="rounded-3xl p-8 bg-white border-2 border-sky-500 shadow-xl relative flex flex-col justify-between">
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md">
              Most Popular
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-sky-100 text-sky-700">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Standard Bag Wash &amp; Fold</h3>
                  <p className="text-xs text-slate-500">13-gallon bag (about 2 loads)</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$32.50</span>
                <span className="text-xs text-slate-500 font-semibold">/ bag</span>
              </div>

              {/* Delivery Fee highlight */}
              <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-100 mb-6 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700 font-semibold">
                  <span>1 Bag Delivery:</span>
                  <span className="text-slate-900 font-bold">$10.00 pickup &amp; delivery</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-100/80 p-2 rounded-xl">
                  <span>2 or More Bags (≥ 2):</span>
                  <span className="uppercase text-emerald-700">FREE Pickup &amp; Delivery</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Washed, dried, and neatly machine folded</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Choice of premium Tide or plant-based detergents</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Pickup &amp; drop-off photo proof included</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Scheduled slots: 8am-12pm or 1pm-6pm</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link href="#book-now" className="block w-full">
                <Button variant="hero" size="lg" className="w-full">
                  Book Laundry by Bag
                </Button>
              </Link>
            </div>
          </div>

          {/* KG Pricing Card */}
          <div className="rounded-3xl p-8 bg-white border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-slate-100 text-slate-700">
                  <Scale className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">By Weight (Per KG)</h3>
                  <p className="text-xs text-slate-500">Commercial &amp; bulk laundry</p>
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900">$2.75</span>
                <span className="text-xs text-slate-500 font-semibold">/ KG (5KG min)</span>
              </div>

              {/* Delivery Fee highlight */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-6 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700 font-semibold">
                  <span>Orders under $40:</span>
                  <span className="text-slate-900 font-bold">$10.00 delivery fee</span>
                </div>
                <div className="flex justify-between items-center text-emerald-800 font-bold bg-emerald-100/80 p-2 rounded-xl">
                  <span>Orders $40 and over:</span>
                  <span className="uppercase text-emerald-700">FREE ($0.00) Delivery</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Precision weighed on calibrated driver scale</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Perfect for bedding, duvets, towels, and bulk</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Estimated upfront, verified at intake facility</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>Pickup &amp; drop-off photo proof included</span>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <Link href="#book-now" className="block w-full">
                <Button variant="outline" size="lg" className="w-full">
                  Book Laundry by KG
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
