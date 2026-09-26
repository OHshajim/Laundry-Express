"use client";

import * as React from "react";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import type { PricingMode } from "@/types";
import { Button } from "@/components/ui/button";

interface StepReviewProps {
  pricingMode: PricingMode;
  bagCount: number;
  weightKg: number;
  selectedDate: string;
  selectedSlot: string;
  address: string;
  isOutOfHome: boolean;
  onEditStep: (step: number) => void;
  onBack: () => void;
}

/**
 * StepReview Component
 *
 * Dedicated Step 4 review component in the laundry booking flow.
 * Displays a clean, structured overview of all customer selections before final payment.
 * Allows instant 1-click jump back to any previous step.
 * Strictly adheres to the 100-250 lines rule.
 */
export function StepReview({
  pricingMode,
  bagCount,
  weightKg,
  selectedDate,
  selectedSlot,
  address,
  isOutOfHome,
  onEditStep,
  onBack,
}: StepReviewProps) {
  const getPlanDescription = () => {
    if (pricingMode === "per_bag") {
      return `${bagCount} Standard 13-Gal Bag${bagCount > 1 ? "s" : ""}`;
    }
    if (pricingMode === "per_kg") {
      return `${weightKg} KG Weighed Volume`;
    }
    return "Pre-Paid Package Credit";
  };

  const getSlotLabel = () => {
    return selectedSlot === "8am-12pm" ? "8:00 AM – 12:00 PM" : "1:00 PM – 6:00 PM";
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-6 rounded-3xl bg-white border-2 border-sky-100 shadow-md space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-sky-600" />
            Review Your Order Summary
          </h4>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Step 4 of 4
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {/* Card 1: Service Plan */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Service Plan &amp; Volume</span>
            <p className="font-bold text-slate-900">{getPlanDescription()}</p>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="text-sky-600 font-semibold hover:underline cursor-pointer"
            >
              Edit Bags &amp; Quantity →
            </button>
          </div>

          {/* Card 2: Detergent & Care */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Detergent &amp; Cycle</span>
            <p className="font-bold text-slate-900">Premium Wash &amp; Cold Gentle Cycle</p>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="text-sky-600 font-semibold hover:underline cursor-pointer"
            >
              Edit Detergent Choice →
            </button>
          </div>

          {/* Card 3: Scheduled Pickup */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Scheduled Pickup Slot</span>
            <p className="font-bold text-slate-900">{selectedDate} ({getSlotLabel()})</p>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="text-sky-600 font-semibold hover:underline cursor-pointer"
            >
              Edit Pickup Slot →
            </button>
          </div>

          {/* Card 4: Address & Presence */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-slate-400 uppercase font-bold text-[10px]">Address &amp; Presence</span>
            <p className="font-bold text-slate-900 truncate">{address || "Address Provided"}</p>
            <span className="text-[11px] text-slate-500 block">
              {isOutOfHome ? "Away (Contactless Doorstep)" : "Home (Doorbell rings)"}
            </span>
          </div>
        </div>

        {/* Operational Photo Proof Guarantee Callout */}
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-xs text-emerald-900">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">100% Photo Proof Verification Guarantee</span>
            <span className="text-[11px] text-emerald-700">
              Our driver uploads a time-stamped photo at pickup and return. Visible immediately in your portal.
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-start">
        <Button
          variant="outline"
          onClick={onBack}
          className="cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to Schedule &amp; Address</span>
        </Button>
      </div>
    </div>
  );
}
