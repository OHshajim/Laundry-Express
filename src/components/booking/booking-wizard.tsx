"use client";

import * as React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { PricingMode, User } from "@/types";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";
import { StepPricingMode } from "./step-pricing-mode";
import { StepBagCounter } from "./step-bag-counter";
import { StepSlotPicker } from "./step-slot-picker";
import { StepDetergent } from "./step-detergent";
import { StepOutOfHome, type AddressDetails } from "./step-out-of-home";
import { StepReview } from "./step-review";
import { OrderSummaryCard } from "./order-summary-card";
import { OrderInvoiceModal, type InvoiceData } from "./order-invoice-modal";
import { Button } from "@/components/ui/button";

export interface BookingWizardProps {
  initialMode?: PricingMode;
  initialBagCount?: number;
  initialWeightKg?: number;
  initialPackageId?: string;
  currentUser?: User | null;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export function BookingWizard({
  initialMode = "per_bag",
  initialBagCount = 2,
  initialWeightKg = 8.0,
  currentUser = null,
  currentStep: externalStep,
  onStepChange,
}: BookingWizardProps) {
  const [internalStep, setInternalStep] = React.useState<number>(1);
  const activeStep = externalStep ?? internalStep;
  const setStep = (s: number) => {
    setInternalStep(s);
    onStepChange?.(s);
  };

  const [pricingMode, setPricingMode] = React.useState<PricingMode>(initialMode);
  const [bagCount, setBagCount] = React.useState<number>(initialBagCount);
  const [weightKg, setWeightKg] = React.useState<number>(initialWeightKg);
  const [selectedDetergentId, setSelectedDetergentId] = React.useState<string>("det-tide-pods");
  const [selectedTemp, setSelectedTemp] = React.useState<"cold" | "warm" | "hot">("cold");
  const [selectedDate, setSelectedDate] = React.useState<string>(() => new Date().toISOString().split("T")[0]);
  const [dropoffDate, setDropoffDate] = React.useState<string>("");
  const [selectedSlot, setSelectedSlot] = React.useState<"8am-12pm" | "1pm-6pm">("8am-12pm");
  const [isOutOfHome, setIsOutOfHome] = React.useState<boolean>(false);
  const [bagConfirmed, setBagConfirmed] = React.useState<boolean>(false);
  const [address, setAddress] = React.useState<string>("");
  const [addressDetails, setAddressDetails] = React.useState<AddressDetails>();
  const [notes, setNotes] = React.useState<string>("");
  const [promoCode, setPromoCode] = React.useState<string>("");
  const [appliedPromo, setAppliedPromo] = React.useState<string>("");
  const [promoError, setPromoError] = React.useState<string>("");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "apple_pay" | "cash_on_delivery">("card");
  const [isProcessing, setIsProcessing] = React.useState<boolean>(false);
  const [invoice, setInvoice] = React.useState<InvoiceData | null>(null);

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
    if (code === "HEROFRESH" || code === "FREESHIP") {
      setAppliedPromo(code);
      setPromoError("");
    } else {
      setPromoError("Invalid or expired coupon code");
    }
  };

  const isStep3Valid = address.trim().length >= 6 && (!isOutOfHome || bagConfirmed);

  const handleCheckout = () => {
    if (!isStep3Valid) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomSeq = Math.floor(1000 + Math.random() * 9000);
      const delivery = dropoffDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0];
      setInvoice({
        orderId: `LX-${new Date().getFullYear()}-${randomSeq}`,
        orderDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pickupDate: selectedDate,
        pickupSlot: selectedSlot === "8am-12pm" ? "8am – 12pm" : "1pm – 6pm",
        deliveryDate: delivery,
        paymentMethod,
        totalAmount: priceResult.total_amount,
        customerName: currentUser?.full_name || "Customer",
        customerEmail: currentUser?.email || "customer@laundryexpress.com",
        address,
        orderDetails: {
          planName: pricingMode === "per_bag" ? "By The Bag (13 Gal)" : "By The KG",
          quantity: pricingMode === "per_bag" ? `${bagCount} Bag(s)` : `${weightKg} KG`,
          detergent: selectedDetergentId,
          temperature: selectedTemp,
          specialRequest: isOutOfHome ? "Away (Contactless Doorstep)" : "Home (Ring Bell)",
        },
      });
    }, 1000);
  };

  return (
    <div id="book-now" className="scroll-mt-24 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepPricingMode selectedMode={pricingMode} onSelectMode={setPricingMode} />
              <StepBagCounter
                pricingMode={pricingMode}
                bagCount={bagCount}
                onBagCountChange={setBagCount}
                weightKg={weightKg}
                onWeightKgChange={setWeightKg}
              />
              <div className="flex justify-end pt-2">
                <Button variant="hero" size="lg" onClick={() => setStep(2)}>
                  <span>Continue to Detergent Choice</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepDetergent
                selectedDetergentId={selectedDetergentId}
                onSelectDetergent={setSelectedDetergentId}
                selectedTemperature={selectedTemp}
                onSelectTemperature={setSelectedTemp}
              />
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Back to Bags</span>
                </Button>
                <Button variant="hero" size="lg" onClick={() => setStep(3)}>
                  <span>Continue to Schedule &amp; Address</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepSlotPicker
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                selectedSlot={selectedSlot}
                onSelectSlot={setSelectedSlot}
                dropoffDate={dropoffDate}
                onSelectDropoffDate={setDropoffDate}
              />
              <StepOutOfHome
                isOutOfHome={isOutOfHome}
                onIsOutOfHomeChange={setIsOutOfHome}
                bagConfirmed={bagConfirmed}
                onBagConfirmedChange={setBagConfirmed}
                address={address}
                onAddressChange={setAddress}
                addressDetails={addressDetails}
                onAddressDetailsChange={setAddressDetails}
                notes={notes}
                onNotesChange={setNotes}
              />
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  <span>Back to Detergent</span>
                </Button>
                <Button variant="hero" size="lg" disabled={!isStep3Valid} onClick={() => setStep(4)}>
                  <span>Review &amp; Checkout</span>
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <StepReview
              pricingMode={pricingMode}
              bagCount={bagCount}
              weightKg={weightKg}
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              address={address}
              isOutOfHome={isOutOfHome}
              onEditStep={setStep}
              onBack={() => setStep(3)}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard
            priceResult={priceResult}
            pricingMode={pricingMode}
            bagCount={bagCount}
            weightKg={weightKg}
            selectedPaymentMethod={paymentMethod}
            onSelectPaymentMethod={setPaymentMethod}
            promoCode={promoCode}
            onPromoCodeChange={setPromoCode}
            onApplyPromo={handleApplyPromo}
            promoError={promoError}
            isProcessing={isProcessing}
            onProceedToCheckout={activeStep === 4 ? handleCheckout : () => setStep(Math.min(4, activeStep + 1))}
            disabled={activeStep === 3 && !isStep3Valid}
          />
        </div>
      </div>

      <OrderInvoiceModal invoice={invoice} onClose={() => { setInvoice(null); setStep(1); }} />
    </div>
  );
}
