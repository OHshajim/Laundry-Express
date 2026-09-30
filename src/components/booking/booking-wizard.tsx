"use client";

import * as React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import type { PricingMode, User, PricingConfig } from "@/types";
import { calculateOrderPrice } from "@/lib/stripe/pricing-calc";
import { WizardStepper } from "./wizard-stepper";
import { StepPricingMode } from "./step-pricing-mode";
import { StepBagCounter } from "./step-bag-counter";
import { StepSlotPicker } from "./step-slot-picker";
import { StepDetergent } from "./step-detergent";
import { StepOutOfHome, type AddressDetails } from "./step-out-of-home";
import { StepReview } from "./step-review";
import { StepPayment } from "./step-payment";
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
}

const STEPS = ["Plan & Quantity", "Detergent", "Schedule", "Address", "Review", "Payment"];

export function BookingWizard({
  initialMode = "per_bag",
  initialBagCount = 2,
  initialWeightLbs,
  initialPricing,
  currentUser = null,
}: BookingWizardProps) {
  const [step, setStep] = React.useState(1);
  const [pricingMode, setPricingMode] = React.useState<PricingMode>(initialMode);
  const [bagCount, setBagCount] = React.useState(initialBagCount);
  const [weightLbs, setWeightLbs] = React.useState(() => Number(initialWeightLbs ?? initialPricing?.min_lbs ?? 15));
  const [selectedDetergentId, setSelectedDetergentId] = React.useState("");
  const [showStep2Errors, setShowStep2Errors] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [dropoffDate, setDropoffDate] = React.useState("");
  const [selectedSlot, setSelectedSlot] = React.useState<"8am-12pm" | "1pm-6pm">("8am-12pm");
  const [isOutOfHome, setIsOutOfHome] = React.useState(false);
  const [isAwayForDropoff, setIsAwayForDropoff] = React.useState(false);
  const [bagConfirmed, setBagConfirmed] = React.useState(false);
  const [address, setAddress] = React.useState("");
  const [addressDetails, setAddressDetails] = React.useState<AddressDetails>();
  const [phone, setPhone] = React.useState(currentUser?.phone || "");
  const [showStep4Errors, setShowStep4Errors] = React.useState(false);
  const [notes, setNotes] = React.useState("");
  const [promoCode, setPromoCode] = React.useState("");
  const [appliedPromo, setAppliedPromo] = React.useState("");
  const [promoError, setPromoError] = React.useState("");
  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "apple_pay" | "cash_on_delivery">("card");

  React.useEffect(() => {
    if (currentUser?.phone && !phone) setPhone(currentUser.phone);
  }, [currentUser?.phone, phone]);
  const [settings, setSettings] = React.useState({ slot1Start: "08:00", slot1End: "12:00", slot2Start: "13:00", slot2End: "18:00", deliveryZones: [] as { city: string; zip: string }[] });
  const [rates, setRates] = React.useState({ bagPrice: Number(initialPricing?.bag_price ?? 32.50), poundPrice: Number(initialPricing?.pound_price ?? 1.99), deliveryFee: Number(initialPricing?.standard_delivery_fee ?? 10.0), freeDeliveryBags: Number(initialPricing?.free_delivery_threshold ?? 2), freeDeliveryLbs: Number(initialPricing?.free_delivery_lbs ?? 30), minLbs: Number(initialPricing?.min_lbs ?? 10), maxLbs: Number(initialPricing?.max_lbs ?? 100) });

  React.useEffect(() => {
    fetch("/api/pricing").then((r) => r.json()).then((d) => {
      if (d?.pricing) setRates({
        bagPrice: Number(d.pricing.bag_price ?? 32.50), poundPrice: Number(d.pricing.pound_price ?? 1.99),
        deliveryFee: Number(d.pricing.standard_delivery_fee ?? 10.0), freeDeliveryBags: Number(d.pricing.free_delivery_threshold ?? 2),
        freeDeliveryLbs: Number(d.pricing.free_delivery_lbs ?? 30), minLbs: Number(d.pricing.min_lbs ?? 10), maxLbs: Number(d.pricing.max_lbs ?? 100),
      });
    }).catch(() => {});
    fetch("/api/content?type=settings").then((r) => r.json()).then((d) => {
      if (d?.settings) {
        const rawZones: string[] = Array.isArray(d.settings.delivery_zones) ? d.settings.delivery_zones : [];
        const zones = rawZones.map((item: string) => {
          const m = item.match(/^(.+?)\s*\(([0-9]{5})\)$/);
          return m ? { city: m[1].trim(), zip: m[2] } : { city: item, zip: "60156" };
        });
        setSettings({
          slot1Start: d.settings.slot1_start || "08:00", slot1End: d.settings.slot1_end || "12:00",
          slot2Start: d.settings.slot2_start || "13:00", slot2End: d.settings.slot2_end || "18:00", deliveryZones: zones,
        });
      }
    }).catch(() => {});
  }, []);

  const { checkout, isProcessing, invoice, setInvoice } = useBookingCheckout();

  const priceResult = React.useMemo(() => calculateOrderPrice({
    pricing_mode: pricingMode, bag_count: bagCount, estimated_weight_lbs: weightLbs,
    detergent_id: selectedDetergentId, promo_code: appliedPromo, base_bag_price: rates.bagPrice,
    base_pound_price: rates.poundPrice, min_lbs: rates.minLbs, max_lbs: rates.maxLbs,
    free_delivery_lbs: rates.freeDeliveryLbs, one_bag_delivery_fee: rates.deliveryFee,
    free_delivery_threshold: rates.freeDeliveryBags,
  }), [pricingMode, bagCount, weightLbs, selectedDetergentId, appliedPromo, rates]);

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    try {
      const res = await fetch(`/api/coupons?code=${encodeURIComponent(code)}&subtotal=${priceResult.subtotal}`);
      const data = await res.json();
      if (res.ok && data.valid) { setAppliedPromo(code); setPromoError(""); }
      else setPromoError(data.error || "Invalid coupon code.");
    } catch { setPromoError("Failed to validate coupon."); }
  };

  // Step validations
  const isStep1Valid = pricingMode === "package" ? true : pricingMode === "per_lb" ? (weightLbs >= rates.minLbs && weightLbs <= rates.maxLbs && !isNaN(weightLbs)) : (bagCount >= 1);
  const isStep2Valid = Boolean(selectedDetergentId);
  const isDateValid = Boolean(selectedDate && selectedDate >= new Date().toISOString().split("T")[0]);
  const isDropoffValid = !dropoffDate || dropoffDate >= selectedDate;
  const isStep3Valid = isDateValid && isDropoffValid && Boolean(selectedSlot);
  const isAddressValid = address.trim().length >= 5 && (!addressDetails?.zip || /^\d{5}(-\d{4})?$/.test(addressDetails.zip.trim()));
  const isPhoneValid = phone.trim().length >= 7;
  const isStep4Valid = Boolean(isAddressValid && isPhoneValid && (!isOutOfHome || bagConfirmed));

  const handleConfirm = () => {
    checkout({
      currentUser, pricingMode, bagCount, weightLbs, selectedDetergentId,
      selectedDate, selectedSlot, dropoffDate, address, phone, addressDetails, isOutOfHome,
      isAwayForDropoff, bagConfirmed, notes, priceResult, paymentMethod,
      slot1Start: settings.slot1Start, slot1End: settings.slot1End,
      slot2Start: settings.slot2Start, slot2End: settings.slot2End,
    });
  };

  return (
    <div id="book-now" className="scroll-mt-24 py-4 w-full max-w-full">
      <WizardStepper steps={STEPS} currentStep={step} onStepClick={(target) => target < step && setStep(target)} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepPricingMode selectedMode={pricingMode} onSelectMode={setPricingMode} bagPrice={rates.bagPrice} poundPrice={rates.poundPrice} minLbs={rates.minLbs} freeDeliveryBags={rates.freeDeliveryBags} freeDeliveryLbs={rates.freeDeliveryLbs} />
              <StepBagCounter pricingMode={pricingMode} bagCount={bagCount} onBagCountChange={setBagCount} weightLbs={weightLbs} onWeightLbsChange={setWeightLbs} bagPrice={rates.bagPrice} freeDeliveryBags={rates.freeDeliveryBags} minLbs={rates.minLbs} maxLbs={rates.maxLbs} freeDeliveryLbs={rates.freeDeliveryLbs} />
              <div className="flex justify-end pt-2">
                <Button variant="hero" size="lg" disabled={!isStep1Valid} onClick={() => isStep1Valid && setStep(2)}>
                  Continue to Detergent <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepDetergent
                selectedDetergentId={selectedDetergentId}
                onSelectDetergent={(id) => { setSelectedDetergentId(id); setShowStep2Errors(false); }}
                showError={showStep2Errors}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <Button variant="outline" onClick={() => setStep(1)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {!isStep2Valid && <span className="text-xs text-rose-500 font-semibold">Selection required</span>}
                  <Button
                    variant="hero" size="lg" disabled={!isStep2Valid}
                    onClick={() => { if (!isStep2Valid) { setShowStep2Errors(true); return; } setStep(3); }}
                  >
                    Continue to Schedule <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepSlotPicker
                selectedDate={selectedDate} onSelectDate={setSelectedDate}
                selectedSlot={selectedSlot} onSelectSlot={setSelectedSlot}
                dropoffDate={dropoffDate} onSelectDropoffDate={setDropoffDate}
                slot1Start={settings.slot1Start} slot1End={settings.slot1End}
                slot2Start={settings.slot2Start} slot2End={settings.slot2End}
              />
              {!isDropoffValid && (
                <p className="text-xs text-rose-600 font-semibold px-1">Drop-off date cannot be before pickup date ({selectedDate}).</p>
              )}
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(2)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                <Button variant="hero" size="lg" disabled={!isStep3Valid} onClick={() => isStep3Valid && setStep(4)}>
                  Continue to Address <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <StepOutOfHome
                currentUser={currentUser}
                phone={phone} onPhoneChange={setPhone}
                isOutOfHome={isOutOfHome} onIsOutOfHomeChange={setIsOutOfHome}
                isAwayForDropoff={isAwayForDropoff} onIsAwayForDropoffChange={setIsAwayForDropoff}
                bagConfirmed={bagConfirmed} onBagConfirmedChange={setBagConfirmed}
                address={address} onAddressChange={setAddress}
                addressDetails={addressDetails} onAddressDetailsChange={setAddressDetails}
                notes={notes} onNotesChange={setNotes}
                deliveryZones={settings.deliveryZones}
                showValidationErrors={showStep4Errors}
              />
              <div className="flex items-center justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(3)}><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                <Button variant="hero" size="lg" disabled={!isStep4Valid} onClick={() => { if (!isStep4Valid) { setShowStep4Errors(true); return; } setStep(5); }}>
                  Review Order <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {step === 5 && (
            <StepReview
              pricingMode={pricingMode} bagCount={bagCount} weightLbs={weightLbs}
              selectedDetergentId={selectedDetergentId} selectedDate={selectedDate} selectedSlot={selectedSlot}
              address={address} phone={phone} isOutOfHome={isOutOfHome}
              slot1Start={settings.slot1Start} slot1End={settings.slot1End}
              slot2Start={settings.slot2Start} slot2End={settings.slot2End}
              onEditStep={setStep} onBack={() => setStep(4)} onContinue={() => setStep(6)}
            />
          )}

          {step === 6 && (
            <StepPayment
              priceResult={priceResult} promoCode={promoCode} onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo} promoError={promoError}
              paymentMethod={paymentMethod} onSelectPaymentMethod={setPaymentMethod}
              isProcessing={isProcessing} onConfirm={handleConfirm} onBack={() => setStep(5)}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          <OrderSummaryCard
            pricingMode={pricingMode} bagCount={bagCount} weightLbs={weightLbs} priceResult={priceResult}
          />
        </div>
      </div>

      <OrderInvoiceModal invoice={invoice} onClose={() => setInvoice(null)} />
    </div>
  );
}
