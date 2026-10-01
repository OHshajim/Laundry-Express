"use client";

import * as React from "react";
import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PricingConfig } from "@/types";
import { useSettings, useSlot1Label, useSlot2Label } from "@/hooks/use-settings";

interface PlanComparisonProps {
  initialRates?: Partial<PricingConfig>;
}

export function PlanComparison({ initialRates }: PlanComparisonProps) {
  const [rates, setRates] = React.useState({
    bagPrice: Number(initialRates?.bag_price ?? 0),
    poundPrice: Number(initialRates?.pound_price ?? 0),
    minLbs: Number(initialRates?.min_lbs ?? 0),
    freeDeliveryBags: Number(initialRates?.free_delivery_threshold ?? 0),
    freeDeliveryLbs: Number(initialRates?.free_delivery_lbs ?? 0),
    deliveryFee: Number(initialRates?.standard_delivery_fee ?? 0),
  });
  const settings = useSettings();
  const slot1 = useSlot1Label(settings);
  const slot2 = useSlot2Label(settings);

  React.useEffect(() => {
    fetch("/api/pricing")
      .then((r) => r.json())
      .then((d) => {
        if (d?.pricing) {
          setRates({
            bagPrice: Number(d.pricing.bag_price),
            poundPrice: Number(d.pricing.pound_price),
            minLbs: Number(d.pricing.min_lbs),
            freeDeliveryBags: Number(d.pricing.free_delivery_threshold),
            freeDeliveryLbs: Number(d.pricing.free_delivery_lbs),
            deliveryFee: Number(d.pricing.standard_delivery_fee),
          });
        }
      })
      .catch(() => {});
  }, []);

  const features = [
    {
      feature: "Base Pricing Rate",
      bag: `$${rates.bagPrice.toFixed(2)} / 13-gal bag (about 2 loads)`,
      pound: `$${rates.poundPrice.toFixed(2)} / lb (${rates.minLbs} lbs min)`,
      package: "From $12.50 / bag (prepaid saver)",
    },
    {
      feature: "Delivery Fee Policy",
      bag: `1 Bag = $${rates.deliveryFee.toFixed(2)} | ${rates.freeDeliveryBags}+ Bags = FREE`,
      pound: `Free over ${rates.freeDeliveryLbs} lbs (else $${rates.deliveryFee.toFixed(2)})`,
      package: "100% FREE on all included pickups",
    },
    {
      feature: "Pickup & Drop-off Windows",
      bag: `${slot1} or ${slot2} Daily`,
      pound: `${slot1} or ${slot2} Daily`,
      package: "Priority reservation on all slots",
    },
    {
      feature: "Detergent Choice",
      bag: "Tide, Eco-Plant, or Fragrance-Free",
      pound: "Tide, Eco-Plant, or Fragrance-Free",
      package: "All detergents included at no extra charge",
    },
    {
      feature: "Photo Proof Guarantee",
      bag: "Instant pickup & drop-off photo",
      pound: "Pickup, digital scale weight, & drop-off photo",
      package: "Complete visual tracking on every load",
    },
    {
      feature: "Best Suited For",
      bag: "Individuals, couples, weekly family laundry",
      pound: "Airbnb hosts, hotels, heavy duvets, gyms",
      package: "Frequent wash households & roommates",
    },
  ];

  return (
      <div className="space-y-8">
          <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-slate-900">
                  Compare Laundry Plans Side-by-Side
              </h3>
              <p className="text-sm text-slate-600 mt-1">
                  Pick what works best for your schedule and budget. Zero hidden
                  fees.
              </p>
          </div>

          {/* Desktop Comparison Table */}
          <div className="hidden md:block bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                  <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700">
                          <th className="py-4 px-6 font-bold w-1/4">Feature</th>
                          <th className="py-4 px-6 font-bold text-sky-700 w-1/4">
                              By the Bag
                          </th>
                          <th className="py-4 px-6 font-bold text-slate-800 w-1/4">
                              By the Pound
                          </th>
                          <th className="py-4 px-6 font-bold text-rose-700 w-1/4">
                              Saver Packages
                          </th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                      {features.map((item, i) => (
                          <tr
                              key={i}
                              className="hover:bg-slate-50/50 transition-colors"
                          >
                              <td className="py-4 px-6 font-bold text-slate-900">
                                  {item.feature}
                              </td>
                              <td className="py-4 px-6 text-slate-700 font-medium">
                                  {item.bag}
                              </td>
                              <td className="py-4 px-6 text-slate-700 font-medium">
                                  {item.pound}
                              </td>
                              <td className="py-4 px-6 text-slate-700 font-medium">
                                  {item.package}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Mobile/Tablet Card Stack View */}
          <div className="md:hidden space-y-4">
              {features.map((item, i) => (
                  <div
                      key={i}
                      className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs"
                  >
                      <span className="font-bold text-slate-900 block pb-1 border-b border-slate-100">
                          {item.feature}
                      </span>
                      <div className="grid grid-cols-1 gap-1.5 pt-1">
                          <div className="flex justify-between items-start">
                              <span className="text-slate-500 font-medium">
                                  By Bag:
                              </span>
                              <span className="font-semibold text-sky-700 text-right">
                                  {item.bag}
                              </span>
                          </div>
                          <div className="flex justify-between items-start">
                              <span className="text-slate-500 font-medium">
                                  By Pound:
                              </span>
                              <span className="font-semibold text-slate-800 text-right">
                                  {item.pound}
                              </span>
                          </div>
                          <div className="flex justify-between items-start">
                              <span className="text-slate-500 font-medium">
                                  Saver Pack:
                              </span>
                              <span className="font-semibold text-rose-700 text-right">
                                  {item.package}
                              </span>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Trust Guarantee Callout */}
          <div className="p-6 rounded-2xl bg-linear-to-r from-sky-50 to-blue-50 border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                      <h4 className="text-sm font-bold text-slate-900">
                          100% Satisfaction or Free Re-Wash
                      </h4>
                      <p className="text-xs text-slate-600">
                          Every garment is backed by our Happiness Guarantee and
                          real-time driver photo verification.
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
