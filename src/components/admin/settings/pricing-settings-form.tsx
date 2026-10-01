"use client";

import * as React from "react";
import { Sliders } from "lucide-react";
import { SaveSettingsForm, useSettingsSave, postSettings } from "./save-settings-form";
import type { PricingConfig } from "@/lib/services/pricing-plan-service";

export function PricingSettingsForm({ initialPricing }: { initialPricing: PricingConfig | null }) {
  const [bagPrice, setBagPrice] = React.useState(initialPricing ? String(initialPricing.bag_price) : "");
  const [minBags, setMinBags] = React.useState(initialPricing ? String(initialPricing.min_bags) : "");
  const [maxBags, setMaxBags] = React.useState(initialPricing ? String(initialPricing.max_bags) : "");
  const [deliveryFee, setDeliveryFee] = React.useState(initialPricing ? String(initialPricing.standard_delivery_fee) : "");
  const [freeBags, setFreeBags] = React.useState(initialPricing ? String(initialPricing.free_delivery_threshold) : "");
  const [poundPrice, setPoundPrice] = React.useState(initialPricing ? String(initialPricing.pound_price) : "");
  const [minLbs, setMinLbs] = React.useState(initialPricing ? String(initialPricing.min_lbs) : "");
  const [maxLbs, setMaxLbs] = React.useState(initialPricing ? String(initialPricing.max_lbs) : "");
  const [freeLbs, setFreeLbs] = React.useState(initialPricing ? String(initialPricing.free_delivery_lbs) : "");
  const { isSaving, error, saved, save } = useSettingsSave();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void save(async () => {
      const pricing = {
        bag_price: Number(bagPrice), min_bags: Number(minBags), max_bags: Number(maxBags),
        standard_delivery_fee: Number(deliveryFee), free_delivery_threshold: Number(freeBags),
        pound_price: Number(poundPrice), min_lbs: Number(minLbs), max_lbs: Number(maxLbs),
        free_delivery_lbs: Number(freeLbs),
      };
      const response = await fetch("/api/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pricing),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Unable to save pricing.");
      try {
        await postSettings({
          min_order_bag: pricing.min_bags, max_order_bag: pricing.max_bags,
          min_order_lbs: pricing.min_lbs, max_order_lbs: pricing.max_lbs,
          free_delivery_bags: pricing.free_delivery_threshold,
          free_delivery_lbs: pricing.free_delivery_lbs,
          standard_delivery_fee: pricing.standard_delivery_fee,
        });
      } catch {
        throw new Error("Pricing was saved, but business settings could not be synchronized.");
      }
    });
  };

  const fields = [
    ["Per-Bag Rate ($)", bagPrice, setBagPrice, "0.01", "0.01"],
    ["Min Bags", minBags, setMinBags, "1", "1"],
    ["Max Bags", maxBags, setMaxBags, "1", "1"],
    ["Free Delivery (Bags)", freeBags, setFreeBags, "0", "1"],
    ["Standard Delivery Fee ($)", deliveryFee, setDeliveryFee, "0", "0.01"],
    ["Per-Pound Rate ($/lb)", poundPrice, setPoundPrice, "0.01", "0.01"],
    ["Min Pound Limit (lbs)", minLbs, setMinLbs, "1", "1"],
    ["Max Pound Limit (lbs)", maxLbs, setMaxLbs, "1", "1"],
    ["Free Delivery Threshold (lbs)", freeLbs, setFreeLbs, "0", "1"],
  ] as const;

  return (
    <SaveSettingsForm title="Pricing" description="Manage bag and pound rates, order limits, and delivery fees."
      isLoading={false} isSaving={isSaving} error={error} saved={saved} onSubmit={handleSubmit}>
      <section className="min-w-0 p-3 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4 text-xs">
        <h4 className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-wide break-words">
          <Sliders className="h-4 w-4 text-primary" /> Pricing &amp; Threshold Rules
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {fields.map(([label, value, setValue, min, step]) => (
            <label key={label} className="min-w-0 font-bold leading-5 text-slate-700">
              {label}
              <input required min={min} type="number" step={step} value={value}
                onChange={(event) => setValue(event.target.value)}
                className="mt-1 block w-full min-w-0 px-3 py-2 rounded-xl border border-slate-200 bg-white font-bold" />
            </label>
          ))}
        </div>
      </section>
    </SaveSettingsForm>
  );
}
