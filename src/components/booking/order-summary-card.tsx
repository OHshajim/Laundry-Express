"use client";

import * as React from "react";
import { ShieldCheck, Tag, CreditCard, Sparkles, Lock, Check } from "lucide-react";
import type { CalculatedPriceResult } from "@/lib/stripe/pricing-calc";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderSummaryCardProps {
  priceResult: CalculatedPriceResult;
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

  const [paymentMethod, setPaymentMethod] = React.useState<"card" | "apple_pay">("card");
  const [cardNumber, setCardNumber] = React.useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = React.useState("12/28");
  const [cardCvc, setCardCvc] = React.useState("888");

  return (
    <div className="bg-white rounded-2xl border-2 border-sky-100 shadow-md p-6 space-y-4 sticky top-24">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <h4 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-sky-600" />
          Live Price &amp; Payment
        </h4>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
          Upfront Stripe Pay
        </span>
      </div>

      {/* Itemized Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex justify-between text-slate-600">
          <span>
            Laundry Wash ({breakdown.unit_count} {breakdown.unit_name})
          </span>
          <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
        </div>

        {detergent_fee > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Specialty Detergent Add-on</span>
            <span className="font-semibold text-slate-900">{formatCurrency(detergent_fee)}</span>
          </div>
        )}

        <div className="flex justify-between items-center text-slate-600">
          <span className="flex items-center gap-1">
            Doorstep Delivery Fee
            {isFreeDelivery && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                FREE
              </span>
            )}
          </span>
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
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
          <Tag className="h-3 w-3 text-sky-600" />
          Promo Code
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. HEROFRESH"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={onApplyPromo}
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Apply
          </button>
        </div>
        {promoError && <p className="text-[11px] text-rose-500 mt-1">{promoError}</p>}
      </div>

      {/* Upfront Payment Method Selector */}
      <div className="pt-2 border-t border-slate-100 space-y-2">
        <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
          <Lock className="h-3 w-3 text-sky-600" />
          Upfront Payment (Required to Confirm)
        </label>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => setPaymentMethod("card")}
            className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
              paymentMethod === "card"
                ? "border-sky-500 bg-sky-50/50 text-sky-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Credit / Debit Card
          </button>
          <button
            type="button"
            onClick={() => setPaymentMethod("apple_pay")}
            className={`p-2 rounded-xl border text-center font-bold transition-all cursor-pointer ${
              paymentMethod === "apple_pay"
                ? "border-sky-500 bg-sky-50/50 text-sky-900"
                : "border-slate-200 text-slate-600"
            }`}
          >
            Apple / Google Pay
          </button>
        </div>

        {paymentMethod === "card" ? (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Card Details</span>
              <input
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
                placeholder="MM/YY"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs"
              />
              <input
                type="text"
                value={cardCvc}
                onChange={(e) => setCardCvc(e.target.value)}
                placeholder="CVC"
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-xs"
              />
            </div>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center text-xs text-slate-600">
            <span className="font-bold text-slate-900 block">Instant Wallet Checkout</span>
            <span>Authenticate via Touch ID / Face ID upon clicking confirm.</span>
          </div>
        )}
      </div>

      {/* Total Due */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
        <div>
          <span className="text-xs text-slate-500 font-medium block">Total Payable Now</span>
          <span className="text-[10px] text-slate-400">Paid upfront via Stripe</span>
        </div>
        <span className="text-2xl font-black text-slate-900 tracking-tight">
          {formatCurrency(total_amount)}
        </span>
      </div>

      {/* Upfront Checkout & Confirm Button */}
      <Button
        type="button"
        variant="hero"
        size="lg"
        disabled={disabled || isProcessing}
        isLoading={isProcessing}
        onClick={onProceedToCheckout}
        className="w-full shadow-lg shadow-sky-500/25"
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isProcessing ? "Processing Stripe Payment..." : `Pay ${formatCurrency(total_amount)} & Confirm`}
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Secure 256-bit Encrypted Stripe Checkout</span>
      </div>
    </div>
  );
}
