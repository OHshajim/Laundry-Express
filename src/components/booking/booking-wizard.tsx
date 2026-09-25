"use client";

import * as React from "react";
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import type { PricingMode } from "@/types";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";
import { StepPricingMode } from "./step-pricing-mode";
import { StepBagCounter } from "./step-bag-counter";
import { StepSlotPicker } from "./step-slot-picker";
import { StepDetergent } from "./step-detergent";
import { StepOutOfHome } from "./step-out-of-home";
import { OrderSummaryCard } from "./order-summary-card";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import type { User } from "@/types";

export interface BookingWizardProps {
  initialMode?: PricingMode;
  initialBagCount?: number;
  initialWeightKg?: number;
  initialPackageId?: string;
  currentUser?: User | null;
}

export function BookingWizard({
  initialMode = "per_bag",
  initialBagCount = 2,
  initialWeightKg = 8.0,
  initialPackageId = "pkg-saver-5",
  currentUser = null,
}: BookingWizardProps) {
  const [pricingMode, setPricingMode] = React.useState<PricingMode>(initialMode);
  const [bagCount, setBagCount] = React.useState<number>(initialBagCount);
  const [weightKg, setWeightKg] = React.useState<number>(initialWeightKg);
  const [selectedPackageId, setSelectedPackageId] = React.useState<string>(initialPackageId);
  const [selectedDetergentId, setSelectedDetergentId] = React.useState<string>("det-tide-pods");
  const [selectedDate, setSelectedDate] = React.useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = React.useState<"8am-12pm" | "1pm-6pm">("8am-12pm");
  const [isOutOfHome, setIsOutOfHome] = React.useState<boolean>(false);
  const [bagConfirmed, setBagConfirmed] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>("");
  const [notes, setNotes] = React.useState<string>("");
  const [promoCode, setPromoCode] = React.useState<string>("");
  const [appliedPromo, setAppliedPromo] = React.useState<string>("");
  const [promoError, setPromoError] = React.useState<string>("");
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [successOrder, setSuccessOrder] = React.useState<{ orderNumber: string; total: number } | null>(null);

  // Live price calculation (server-side logic mirrored for instant client feedback)
  const priceResult = React.useMemo(() => {
    return calculateOrderPrice({
      pricing_mode: pricingMode,
      bag_count: bagCount,
      estimated_weight_kg: weightKg,
      detergent_id: selectedDetergentId,
      promo_code: appliedPromo,
    });
  }, [pricingMode, bagCount, weightKg, selectedDetergentId, appliedPromo]);

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) {
      setPromoError("Please enter a code");
      return;
    }
    if (code === "HEROFRESH" || code === "FREESHIP") {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setPromoError("Invalid or expired coupon code");
    }
  };

  const isFormValid = address.trim().length > 5 && (!isOutOfHome || bagConfirmed);

  const handleCheckout = () => {
    if (!isFormValid) return;
    setIsProcessing(true);

    // Simulate server action creating order and mock Stripe payment
    setTimeout(() => {
      setIsProcessing(false);
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      setSuccessOrder({
        orderNumber: `LX-${new Date().getFullYear()}-${randomSeq}`,
        total: priceResult.total_amount,
      });
    }, 1200);
  };

  return (
    <div id="book-now" className="scroll-mt-24 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Form Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <StepPricingMode
            selectedMode={pricingMode}
            onSelectMode={(mode) => setPricingMode(mode)}
          />

          <StepBagCounter
            pricingMode={pricingMode}
            bagCount={bagCount}
            onBagCountChange={setBagCount}
            weightKg={weightKg}
            onWeightKgChange={setWeightKg}
          />

          <StepSlotPicker
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />

          <StepDetergent
            selectedDetergentId={selectedDetergentId}
            onSelectDetergent={setSelectedDetergentId}
          />

          <StepOutOfHome
            isOutOfHome={isOutOfHome}
            onIsOutOfHomeChange={setIsOutOfHome}
            bagConfirmed={bagConfirmed}
            onBagConfirmedChange={setBagConfirmed}
            address={address}
            onAddressChange={setAddress}
            notes={notes}
            onNotesChange={setNotes}
          />
        </div>

        {/* Right Summary Column (1 Col) */}
        <div className="lg:col-span-1">
          <OrderSummaryCard
            priceResult={priceResult}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            promoError={promoError}
            isProcessing={isProcessing}
            onProceedToCheckout={handleCheckout}
            disabled={!isFormValid}
          />
          {!isFormValid && (
            <p className="text-[11px] text-center text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200 mt-3">
              ⚠️ Please enter your address {isOutOfHome && "and confirm laundry bag placement"} to proceed.
            </p>
          )}
        </div>
      </div>

      {/* Success Dialog Modal */}
      {successOrder && (
        <Dialog
          open={!!successOrder}
          onOpenChange={() => setSuccessOrder(null)}
          title="💳 Upfront Payment Processed &amp; Pickup Confirmed!"
          description="Your Stripe payment succeeded and your pickup window is secured."
        >
          <div className="text-center space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-semibold uppercase">Assigned Order Code</span>
              <p className="text-2xl font-black text-slate-900">{successOrder.orderNumber}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-1.5 text-slate-700">
              <p><strong>Customer:</strong> {currentUser?.full_name || "Customer"} ({currentUser?.email})</p>
              <p><strong>Payment Status:</strong> Paid upfront via Stripe (${successOrder.total.toFixed(2)})</p>
              <p><strong>Scheduled Slot:</strong> {selectedSlot === "8am-12pm" ? "8:00 AM – 12:00 PM" : "1:00 PM – 6:00 PM"} on {selectedDate}</p>
              <p><strong>Pickup Address:</strong> {address}</p>
              <p><strong>Presence Mode:</strong> {isOutOfHome ? "Away (Contactless Doorstep Pickup)" : "Home (Doorbell rings)"}</p>
              <p><strong>Photo Proof Guarantee:</strong> Our driver will upload a photo upon pickup and drop-off!</p>
            </div>

            <Button
              variant="hero"
              className="w-full"
              onClick={() => setSuccessOrder(null)}
            >
              Back to Home
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
