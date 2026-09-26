"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";

interface PlanBagCardProps {
  bagCount: number;
  onBagCountChange: (count: number) => void;
}

/**
 * PlanBagCard Component
 *
 * Dedicated plan card for standard 13-gallon laundry bags.
 * Highlights the core business rule:
 * - 1 Bag = $10.00 delivery fee
 * - 2+ Bags = FREE ($0.00) delivery fee
 */
export function PlanBagCard({ bagCount, onBagCountChange }: PlanBagCardProps) {
  const bagSubtotal = bagCount * 32.50;
  const bagDeliveryFee = bagCount === 1 ? 10.0 : 0.0;
  const bagTotal = bagSubtotal + bagDeliveryFee;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-pink-200 shadow-xl max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-100 text-sky-700 mb-2 uppercase tracking-wide">
            Most Popular Choice
          </span>
          <h3 className="text-2xl font-black text-slate-900">Standard 13-Gallon Bags</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            $32.50 per 13-gallon bag (about 2 loads of clothes, towels &amp; daily wear).
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-3xl font-black text-slate-900">$32.50</span>
          <span className="text-xs text-slate-500 block">per bag</span>
        </div>
      </div>

      {/* Interactive Bag Counter with min touch target >= 44px */}
      <div className="p-4 sm:p-6 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">Select How Many Bags:</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onBagCountChange(Math.max(1, bagCount - 1))}
              disabled={bagCount <= 1}
              aria-label="Decrease bag count"
              className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
            >
              <Minus className="h-4 w-4" />
            </button>

            <span className="w-10 text-center text-2xl font-black text-slate-900">
              {bagCount}
            </span>

            <button
              type="button"
              onClick={() => onBagCountChange(Math.min(10, bagCount + 1))}
              disabled={bagCount >= 10}
              aria-label="Increase bag count"
              className="h-11 w-11 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Delivery Fee Status Callout */}
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
            bagCount >= 2
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-amber-50 border-amber-200 text-amber-900"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              {bagCount >= 2 ? (
                <strong>Awesome! 2+ Bags qualify for 100% FREE delivery.</strong>
              ) : (
                <span>
                  Add 1 more bag to get <strong>FREE delivery</strong> (save $10.00)!
                </span>
              )}
            </span>
          </div>
          <Badge variant={bagCount >= 2 ? "success" : "warning"}>
            {bagCount >= 2 ? "FREE ($0.00)" : "$10.00 Fee"}
          </Badge>
        </div>
      </div>

      {/* Pricing Calculation Summary */}
      <div className="space-y-2 pt-2 text-sm text-slate-600">
        <div className="flex justify-between">
          <span>{bagCount} Bag{bagCount > 1 ? "s" : ""} Wash &amp; Fold ($32.50/bag):</span>
          <span className="font-semibold text-slate-900">{formatCurrency(bagSubtotal)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Doorstep Pickup &amp; Delivery:</span>
          <span className={`font-bold ${bagCount >= 2 ? "text-emerald-600" : "text-slate-900"}`}>
            {bagCount >= 2 ? "FREE ($0.00)" : "$10.00"}
          </span>
        </div>
        <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
          <span>Estimated Total:</span>
          <span className="text-xl text-primary">{formatCurrency(bagTotal)}</span>
        </div>
      </div>

      {/* Guarantee Badge with Link to Policy */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="flex items-center gap-1.5 font-bold text-slate-700">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>Zero Lost-Garment Guarantee</span>
        </span>
        <Link
          href="/terms#zero-lost"
          className="text-xs font-bold text-primary hover:underline"
        >
          See full policy →
        </Link>
      </div>

      {/* CTA to Order with chosen count */}
      <Link href={`/order?mode=per_bag&bags=${bagCount}`} className="block">
        <Button variant="hero" size="lg" className="w-full shadow-lg shadow-primary/25">
          <span>Continue with {bagCount} Bag{bagCount > 1 ? "s" : ""}</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}
