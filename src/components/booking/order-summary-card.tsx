"use client";

import * as React from "react";
import { ShieldCheck, Tag, CreditCard, Sparkles, Lock, Scale, Banknote } from "lucide-react";
import type { CalculatedPriceResult } from "@/lib/stripe/pricing-calc";
import type { PricingMode } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderSummaryCardProps {
  priceResult: CalculatedPriceResult;
  pricingMode?: PricingMode;
  bagCount?: number;
  weightKg?: number;
  selectedPaymentMethod?: "card" | "apple_pay" | "cash_on_delivery";
  onSelectPaymentMethod?: (method: "card" | "apple_pay" | "cash_on_delivery") => void;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  promoError?: string;
  isProcessing: boolean;
  onProceedToCheckout: () => void;
  disabled?: boolean;
}

export function OrderSummaryCard({
  priceResult,
  pricingMode = "per_bag",
  bagCount = 2,
  weightKg = 8.0,
  selectedPaymentMethod = "card",
  onSelectPaymentMethod,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoError,
  isProcessing,
  onProceedToCheckout,
  disabled = false,
}: OrderSummaryCardProps) {
  const { subtotal, detergent_fee, delivery_fee, discount_amount, total_amount, breakdown } = priceResult;
  const isFreeDelivery = delivery_fee === 0 && subtotal > 0;
  const [method, setMethod] = React.useState<"card" | "apple_pay" | "cash_on_delivery">(selectedPaymentMethod);

  const handleMethodChange = (m: "card" | "apple_pay" | "cash_on_delivery") => {
    setMethod(m);
    onSelectPaymentMethod?.(m);
  };

  const weightDisplay = React.useMemo(() => {
    if (pricingMode === "per_bag") {
      return `${bagCount} Bag(s) • ${bagCount * 13} Gal (~${(bagCount * 6).toFixed(1)} kg)`;
    }
    if (pricingMode === "per_kg") {
      return `${weightKg.toFixed(1)} KG (~${(weightKg * 2.2).toFixed(1)} lbs)`;
    }
    return "Prepaid Bundle Credit";
  }, [pricingMode, bagCount, weightKg]);

  return (
    <div className="bg-white rounded-2xl border-2 border-pink-100 shadow-md p-6 space-y-4 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Live Price &amp; Weight
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
          Live Calculation
        </span>
      </div>

      {/* Live Estimated Weight Banner */}
      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Scale className="h-4 w-4 text-primary" />
          <span>Total Weight:</span>
        </div>
        <span className="font-black text-slate-900">{weightDisplay}</span>
      </div>

      {/* Itemized Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>Laundry Wash ({breakdown.unit_count} {breakdown.unit_name})</span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        {detergent_fee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Specialty Detergent Add-on</span>
            <span className="font-semibold text-slate-900">{formatCurrency(detergent_fee)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600">
          <span>Doorstep Delivery {isFreeDelivery && <span className="text-[10px] font-bold text-emerald-700 ml-1">FREE</span>}</span>
          <span className={isFreeDelivery ? "font-bold text-emerald-600" : "font-semibold text-slate-900"}>
            {isFreeDelivery ? "$0.00" : formatCurrency(delivery_fee)}
          </span>
        </div>

        {discount_amount > 0 && (
          <div className="flex justify-between text-emerald-600 font-medium">
            <span>Discount ({breakdown.promo_applied})</span>
            <span>-{formatCurrency(discount_amount)}</span>
          </div>
        )}
      </div>

      {/* Promo Code Input */}
      <div className="pt-2 border-t border-slate-100 flex gap-2">
        <input
          type="text"
          placeholder="Promo code (HEROFRESH)"
          value={promoCode}
          onChange={(e) => onPromoCodeChange(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <button
          type="button"
          onClick={onApplyPromo}
          className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
        >
          Apply
        </button>
      </div>
      {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}

      {/* Payment Method Selector */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Lock className="h-3 w-3 text-primary" /> Payment Method
        </label>

        <div className="grid grid-cols-3 gap-1.5 text-xs">
          {(["card", "apple_pay", "cash_on_delivery"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => handleMethodChange(m)}
              className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
                method === m ? "border-primary bg-pink-50/50 text-slate-900" : "border-slate-200 text-slate-600"
              }`}
            >
              {m === "card" ? "Card" : m === "apple_pay" ? "Apple Pay" : "Cash Drop"}
            </button>
          ))}
        </div>

        {method === "card" && (
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-mono">•••• •••• •••• 4242</span>
            <span className="text-[10px] text-slate-400 font-bold">12/28</span>
          </div>
        )}

        {method === "cash_on_delivery" && (
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-1.5">
            <Banknote className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Pay driver in cash upon doorstep delivery.</span>
          </div>
        )}
      </div>

      {/* Total Due */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">Total Payable</span>
        <span className="text-2xl font-black text-slate-900 tracking-tight">{formatCurrency(total_amount)}</span>
      </div>

      <Button
        type="button"
        variant="hero"
        size="lg"
        disabled={disabled || isProcessing}
        isLoading={isProcessing}
        onClick={onProceedToCheckout}
        className="w-full shadow-lg shadow-pink-500/25 cursor-pointer"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isProcessing ? "Processing..." : `Confirm Order (${formatCurrency(total_amount)})`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Secure 256-bit Encrypted Checkout</span>
      </div>
    </div>
  );
}
