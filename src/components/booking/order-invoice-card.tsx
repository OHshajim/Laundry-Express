"use client";

import * as React from "react";
import Image from "next/image";
import { MapPin, ShieldCheck, CheckCircle2 } from "lucide-react";
import type { InvoiceData } from "./order-invoice-modal";
import { formatCurrency, formatPhone, resolveDetergentName } from "@/lib/utils";
import { APP_CONFIG } from "@/lib/constants";

interface OrderInvoiceCardProps {
  invoice: InvoiceData;
  className?: string;
}

function InvoiceRow({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-500 font-semibold shrink-0">{label}</span>
      <span className={`text-[11px] text-slate-900 font-bold text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function OrderInvoiceCard({ invoice, className = "" }: OrderInvoiceCardProps) {
  const methodLabel: Record<string, string> = {
    card: "Credit / Debit Card (Stripe)",
    apple_pay: "Apple Pay (Stripe)",
    cash_on_delivery: "Cash on Delivery",
    stripe: "Stripe 256-bit Secure Checkout",
  };

  const paymentDisplay = methodLabel[invoice.paymentMethod] || invoice.paymentMethod.replace(/_/g, " ");
  const detergentName = resolveDetergentName(invoice.orderDetails.detergent);

  return (
      <div
          id="official-invoice-print-area"
          className={`rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm ${className}`}
      >
          {/* Brand Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-5 bg-linear-to-b from-slate-50 to-white border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-2xl overflow-hidden shrink-0 border border-slate-200 bg-white p-1 shadow-sm flex items-center justify-center">
                      <Image
                          src="/brand/logo-badge.jpg"
                          alt="Laundry Express"
                          width={64}
                          height={64}
                          className="object-contain rounded-xl"
                          priority
                      />
                  </div>
                  <div>
                      <h3 className="font-black text-slate-900 text-lg sm:text-xl tracking-tight leading-none">
                          LAUNDRY <span className="text-primary">EXPRESS</span>
                      </h3>
                      <p className="text-xs font-bold text-primary mt-1 tracking-wide uppercase">
                          Premium 24-Hour Wash &amp; Fold
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                          {APP_CONFIG.supportPhone}
                      </p>
                  </div>
              </div>

              <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      PAID &amp; CONFIRMED
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">
                      TAX INVOICE &bull; {invoice.orderId}
                  </p>
              </div>
          </div>

          <div className="p-6 space-y-5">
              {/* Customer & Schedule Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          Billed To Customer
                      </p>
                      <p className="text-xs font-black text-slate-900">
                          {invoice.customerName}
                      </p>
                      {invoice.customerEmail && (
                          <p className="text-[11px] text-slate-600 font-medium">
                              {invoice.customerEmail}
                          </p>
                      )}
                      {invoice.customerPhone && (
                          <p className="text-[11px] text-slate-600 font-medium">
                              Tel: {formatPhone(invoice.customerPhone)}
                          </p>
                      )}
                      {invoice.address && (
                          <p className="text-[11px] text-slate-600 flex items-start gap-1 mt-1 font-medium">
                              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-rose-500" />
                              {invoice.address}
                          </p>
                      )}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                      <p className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          Schedule &amp; Reference
                      </p>
                      <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">
                                  Order Number:
                              </span>
                              <span className="font-mono font-black text-slate-900">
                                  {invoice.orderId}
                              </span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">
                                  Order Placed:
                              </span>
                              <span className="font-bold text-slate-800">
                                  {invoice.orderDate}
                              </span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">
                                  Pickup Window:
                              </span>
                              <span className="font-bold text-slate-800">
                                  {invoice.pickupDate} ({invoice.pickupSlot})
                              </span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-[11px] text-slate-500 font-medium">
                                  Estimated Return:
                              </span>
                              <span className="font-bold text-emerald-700">
                                  {invoice.deliveryDate} (24hr Return)
                              </span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Itemized Service Breakdown */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Service Breakdown
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Amount
                      </span>
                  </div>
                  <div className="px-4 divide-y divide-slate-100">
                      <InvoiceRow
                          label="Selected Plan"
                          value={
                              <span className="text-slate-900 font-black">
                                  {invoice.orderDetails.planName}
                              </span>
                          }
                      />
                      <InvoiceRow
                          label="Order Intake Quantity"
                          value={invoice.orderDetails.quantity}
                      />
                      <InvoiceRow
                          label="Formula & Care"
                          value={`${detergentName} • Cold Water Gentle Care`}
                      />
                      <InvoiceRow
                          label="Doorstep Protocol"
                          value={
                              invoice.orderDetails.specialRequest ||
                              "Contactless Delivery"
                          }
                      />
                  </div>
              </div>

              {/* Financial Summary */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                          Financial Settlement
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">
                          Payment Summary
                      </span>
                  </div>
                  <div className="px-4 divide-y divide-slate-100">
                      {invoice.subtotal !== undefined && (
                          <InvoiceRow
                              label="Service Subtotal"
                              value={formatCurrency(invoice.subtotal)}
                          />
                      )}
                      {invoice.deliveryFee !== undefined && (
                          <InvoiceRow
                              label="Doorstep Logistics (Pickup & Return)"
                              value={
                                  invoice.deliveryFee === 0 ? (
                                      <span className="text-emerald-600 font-black">
                                          FREE ($0.00)
                                      </span>
                                  ) : (
                                      formatCurrency(invoice.deliveryFee)
                                  )
                              }
                          />
                      )}
                      {invoice.discountAmount !== undefined &&
                          invoice.discountAmount > 0 && (
                              <InvoiceRow
                                  label="Promotional Discount"
                                  value={
                                      <span className="text-emerald-600 font-black">
                                          -
                                          {formatCurrency(
                                              invoice.discountAmount,
                                          )}
                                      </span>
                                  }
                              />
                          )}
                      <InvoiceRow
                          label="Payment Method"
                          value={paymentDisplay}
                      />
                      <div className="flex items-center justify-between py-3.5">
                          <div>
                              <span className="text-xs font-black text-slate-900 block">
                                  Total Cleared &amp; Authorized
                              </span>
                              <span className="text-[10px] text-slate-400">
                                  Captured securely via Stripe TLS 1.3 gateway
                              </span>
                          </div>
                          <span className="text-2xl font-black text-primary tracking-tight">
                              {formatCurrency(invoice.totalAmount)}
                          </span>
                      </div>
                  </div>
              </div>

              {/* Satisfaction Guarantee Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-900 leading-relaxed">
                      <strong className="font-bold">
                          100% Satisfaction Guarantee:
                      </strong>{" "}
                      Washed individually in eco-conscious cold water, dried
                      gently, folded with care, and sealed in weatherproof
                      packaging for protected doorstep delivery.
                  </p>
              </div>
          </div>
      </div>
  );
}
