"use client";

import * as React from "react";
import { Lock, Tag, CreditCard, Banknote, ShieldCheck, Smartphone } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { CalculatedPriceResult } from "@/lib/stripe/pricing-calc";

interface StepPaymentProps {
  priceResult: CalculatedPriceResult;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onApplyPromo: () => void;
  promoError?: string;
  paymentMethod: "card" | "apple_pay" | "cash_on_delivery";
  onSelectPaymentMethod: (m: "card" | "apple_pay" | "cash_on_delivery") => void;
  isProcessing: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

const METHODS = [
  { id: "card" as const, label: "Credit / Debit Card", icon: CreditCard },
  { id: "apple_pay" as const, label: "Apple Pay", icon: Smartphone },
  { id: "cash_on_delivery" as const, label: "Cash on Delivery", icon: Banknote },
];

export function StepPayment({
  priceResult,
  promoCode,
  onPromoCodeChange,
  onApplyPromo,
  promoError,
  paymentMethod,
  onSelectPaymentMethod,
  isProcessing,
  onConfirm,
  onBack,
}: StepPaymentProps) {
  const { subtotal, delivery_fee, discount_amount, total_amount } = priceResult;
  const isFreeDelivery = delivery_fee === 0 && subtotal > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="p-6 rounded-3xl bg-white border-2 border-slate-100 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            Payment & Checkout
          </h4>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 uppercase">
            Step 5 of 5
          </span>
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Laundry Wash</span>
            <span className="font-semibold text-slate-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between items-center text-slate-600">
            <span>Doorstep Delivery {isFreeDelivery && <span className="text-[10px] font-bold text-emerald-700 ml-1">FREE</span>}</span>
            <span className={isFreeDelivery ? "font-bold text-emerald-600" : "font-semibold text-slate-900"}>
              {isFreeDelivery ? "$0.00" : formatCurrency(delivery_fee)}
            </span>
          </div>
          {discount_amount > 0 && (
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Coupon Discount</span>
              <span>-{formatCurrency(discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between font-black text-slate-900 text-sm border-t border-slate-200 pt-2 mt-1">
            <span>Total Payable</span>
            <span>{formatCurrency(total_amount)}</span>
          </div>
        </div>

        {/* Promo Code */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
            <Tag className="h-3 w-3 text-primary" /> Coupon Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => onPromoCodeChange(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="button"
              onClick={onApplyPromo}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Apply
            </button>
          </div>
          {promoError && <p className="text-[11px] text-rose-500">{promoError}</p>}
          {discount_amount > 0 && !promoError && (
            <p className="text-[11px] text-emerald-600 font-semibold">Coupon applied — {formatCurrency(discount_amount)} saved!</p>
          )}
        </div>

        {/* Payment Method */}
        <div className="space-y-2">
          <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">Payment Method</label>
          <div className="space-y-2">
            {METHODS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onSelectPaymentMethod(id)}
                className={`w-full p-3.5 rounded-xl border-2 text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  paymentMethod === id
                    ? "border-primary bg-pink-50/50 ring-2 ring-primary/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 ${paymentMethod === id ? "bg-pink-100 text-primary" : "bg-slate-100 text-slate-500"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span className={`font-bold text-xs ${paymentMethod === id ? "text-slate-900" : "text-slate-600"}`}>{label}</span>
                {paymentMethod === id && <div className="ml-auto h-4 w-4 rounded-full bg-primary flex items-center justify-center"><div className="h-2 w-2 rounded-full bg-white" /></div>}
              </button>
            ))}
          </div>
          {paymentMethod === "card" && (
            <p className="text-[11px] text-slate-500 text-center pt-1">Powered by Stripe — you will be redirected to complete payment securely.</p>
          )}
          {paymentMethod === "cash_on_delivery" && (
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
              Cash payment is collected by the driver upon drop-off delivery.
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" onClick={onBack} className="cursor-pointer">
          Back to Review
        </Button>
        <Button
          variant="hero"
          size="lg"
          disabled={isProcessing}
          isLoading={isProcessing}
          onClick={onConfirm}
          className="shadow-lg shadow-pink-500/25 cursor-pointer flex-1 sm:flex-none"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          {isProcessing ? "Processing..." : `Confirm & Pay ${formatCurrency(total_amount)}`}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>256-bit SSL Encrypted · PCI-DSS Compliant</span>
      </div>
    </div>
  );
}
