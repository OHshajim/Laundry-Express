"use client";

import * as React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { PricingMode, User, PricingConfig } from "@/types";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";
import { StepPricingMode } from "./step-pricing-mode";
import { StepBagCounter } from "./step-bag-counter";
import { StepSlotPicker } from "./step-slot-picker";
import { StepDetergent } from "./step-detergent";
import { StepOutOfHome, type AddressDetails } from "./step-out-of-home";
import { StepReview } from "./step-review";
import { OrderSummaryCard } from "./order-summary-card";
import { OrderInvoiceModal } from "./order-invoice-modal";
import { Button } from "@/components/ui/button";
import { useBookingCheckout } from "./use-booking-checkout";

export interface BookingWizardProps {
  initialMode?: PricingMode;
  initialBagCount?: number;
  initialWeightLbs?: number;
  initialPackageId?: string;
  initialPricing?: Partial<PricingConfig>;
  currentUser?: User | null;
  currentStep?: number;
  onStepChange?: (step: number) => void;
}

export function BookingWizard({
  initialMode = "per_bag",
  initialBagCount = 2,
  initialWeightLbs,
  initialPricing,
  currentUser = null,
  currentStep: externalStep,
  onStepChange,
}: BookingWizardProps) {
  const [internalStep, setInternalStep] = React.useState<number>(1);
  const activeStep = externalStep ?? internalStep;
  const setStep = (s: number) => { setInternalStep(s); onStepChange?.(s); };

  const [pricingMode, setPricingMode] = React.useState<PricingMode>(initialMode);
  const [bagCount, setBagCount] = React.useState<number>(initialBagCount);
  const [weightLbs, setWeightLbs] = React.useState<number>(() => Number(initialWeightLbs ?? initialPricing?.min_lbs ?? 15));
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
  const [rates, setRates] = React.useState({
    bagPrice: Number(initialPricing?.bag_price ?? 32.50),
    poundPrice: Number(initialPricing?.pound_price ?? 1.99),
    deliveryFee: Number(initialPricing?.standard_delivery_fee ?? 10.0),
    freeDeliveryBags: Number(initialPricing?.free_delivery_threshold ?? 2),
    freeDeliveryLbs: Number(initialPricing?.free_delivery_lbs ?? 30),
    minLbs: Number(initialPricing?.min_lbs ?? 10),
    maxLbs: Number(initialPricing?.max_lbs ?? 100),
  });

  React.useEffect(() => {
    fetch("/api/pricing").then((r) => r.json()).then((d) => {
      if (d?.pricing) {
        setRates({
          bagPrice: Number(d.pricing.bag_price ?? 32.50),
          poundPrice: Number(d.pricing.pound_price ?? 1.99),
          deliveryFee: Number(d.pricing.standard_delivery_fee ?? 10.0),
          freeDeliveryBags: Number(d.pricing.free_delivery_threshold ?? 2),
          freeDeliveryLbs: Number(d.pricing.free_delivery_lbs ?? 30),
          minLbs: Number(d.pricing.min_lbs ?? 10),
          maxLbs: Number(d.pricing.max_lbs ?? 100),
        });
      }
    }).catch(() => {});
  }, []);

  const { checkout, isProcessing, invoice, setInvoice } = useBookingCheckout();

  const priceResult = React.useMemo(() => {
    return calculateOrderPrice({
      pricing_mode: pricingMode,
      bag_count: bagCount,
      estimated_weight_lbs: weightLbs,
      detergent_id: selectedDetergentId,
      promo_code: appliedPromo,
      base_bag_price: rates.bagPrice,
      base_pound_price: rates.poundPrice,
      min_lbs: rates.minLbs,
      max_lbs: rates.maxLbs,
      free_delivery_lbs: rates.freeDeliveryLbs,
      one_bag_delivery_fee: rates.deliveryFee,
      free_delivery_threshold: rates.freeDeliveryBags,
    });
  }, [pricingMode, bagCount, weightLbs, selectedDetergentId, appliedPromo, rates]);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}&subtotal=${priceResult.subtotal}`);
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedPromo(code);
        setPromoError("");
      } else {
        setPromoError(data.error || "Invalid coupon code.");
      }
    } catch {
      setPromoError("Failed to validate promo code.");
    }
  };

  const isStep3Valid = address.trim().length >= 6 && (!isOutOfHome || bagConfirmed);

  const handleCheckout = () => {
    if (!isStep3Valid) return;
    checkout({
      currentUser,
      pricingMode,
      bagCount,
      weightLbs,
      selectedDetergentId,
      selectedTemp,
      selectedDate,
      selectedSlot,
      dropoffDate,
      address,
      addressDetails,
      isOutOfHome,
      bagConfirmed,
      notes,
      priceResult,
      paymentMethod,
    });
  };

  return (
    <div id="book-now" className="scroll-mt-24 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepPricingMode
                selectedMode={pricingMode}
                onSelectMode={setPricingMode}
                bagPrice={rates.bagPrice}
                poundPrice={rates.poundPrice}
                minLbs={rates.minLbs}
                freeDeliveryBags={rates.freeDeliveryBags}
                freeDeliveryLbs={rates.freeDeliveryLbs}
              />
              <StepBagCounter
                pricingMode={pricingMode}
                bagCount={bagCount}
                onBagCountChange={setBagCount}
                weightLbs={weightLbs}
                onWeightLbsChange={setWeightLbs}
                bagPrice={rates.bagPrice}
                freeDeliveryBags={rates.freeDeliveryBags}
                minLbs={rates.minLbs}
                maxLbs={rates.maxLbs}
                freeDeliveryLbs={rates.freeDeliveryLbs}
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
                selectedDetergentId={selectedDetergentId} onSelectDetergent={setSelectedDetergentId}
                selectedTemp={selectedTemp} onSelectTemp={setSelectedTemp}
              />
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-2" /><span>Back to Plan</span></Button>
                <Button variant="hero" size="lg" onClick={() => setStep(3)}><span>Continue to Pickup &amp; Address</span><ArrowRight className="h-4 w-4 ml-2" /></Button>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepSlotPicker
                selectedDate={selectedDate} onSelectDate={setSelectedDate}
                selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot}
                dropoffDate={dropoffDate} onSelectDropoffDate={setDropoffDate}
              />
              <StepOutOfHome
                isOutOfHome={isOutOfHome} onIsOutOfHomeChange={setIsOutOfHome}
                bagConfirmed={bagConfirmed} onBagConfirmedChange={setBagConfirmed}
                address={address} onAddressChange={setAddress}
                addressDetails={addressDetails} onAddressDetailsChange={setAddressDetails}
                notes={notes} onNotesChange={setNotes}
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
              pricingMode={pricingMode} bagCount={bagCount} weightLbs={weightLbs}
              selectedDate={selectedDate} selectedSlot={selectedSlot}
              address={address} isOutOfHome={isOutOfHome}
              onEditStep={setStep} onBack={() => setStep(3)}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard
            pricingMode={pricingMode} bagCount={bagCount} weightLbs={weightLbs}
            priceResult={priceResult} promoCode={promoCode} promoError={promoError}
            onPromoCodeChange={setPromoCode} onApplyPromo={handleApplyPromo}
            selectedPaymentMethod={paymentMethod as any} onSelectPaymentMethod={setPaymentMethod}
            onProceedToCheckout={handleCheckout} isProcessing={isProcessing} disabled={activeStep !== 4}
          />
        </div>
      </div>

      <OrderInvoiceModal invoice={invoice} onClose={() => setInvoice(null)} />
    </div>
  );
}
