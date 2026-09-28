"use client";

import * as React from "react";
import {
  CheckCircle2, Printer, ArrowRight, MapPin,
  Calendar, Clock, CreditCard, Package, Shirt, Download,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string;
  paymentMethod: string;
  totalAmount: number;
  subtotal?: number;
  deliveryFee?: number;
  discountAmount?: number;
  customerName: string;
  customerEmail: string;
  address: string;
  orderDetails: {
    planName: string;
    quantity: string;
    detergent: string;
    temperature: string;
    specialRequest: string;
  };
}

interface OrderInvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 border-b border-slate-100 last:border-0">
      <span className="text-[11px] text-slate-500 font-semibold shrink-0">{label}</span>
      <span className={`text-[11px] text-slate-900 font-bold text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}

export function OrderInvoiceModal({ invoice, onClose }: OrderInvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => window.print();

  const methodLabel: Record<string, string> = {
    card: "Credit / Debit Card",
    apple_pay: "Apple Pay",
    cash_on_delivery: "Cash on Delivery",
  };

  return (
    <Dialog
      open={!!invoice}
      onOpenChange={onClose}
      title="Order Confirmed"
      description="Your laundry pickup has been scheduled. Save or print your invoice below."
    >
      <div className="space-y-5 py-1">
        {/* Success Banner */}
        <div className="rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-base tracking-tight">Booking Confirmed!</p>
              <p className="text-emerald-100 text-xs mt-0.5">We'll pick up your laundry as scheduled.</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Order ID</p>
              <p className="text-white font-mono font-black text-sm">{invoice.orderId}</p>
            </div>
          </div>
          {/* Mobile Order ID */}
          <div className="sm:hidden bg-emerald-600 px-5 py-2 flex justify-between items-center">
            <span className="text-emerald-100 text-[10px] font-bold uppercase">Order ID</span>
            <span className="text-white font-mono font-black text-xs">{invoice.orderId}</span>
          </div>
        </div>

        {/* Invoice Card */}
        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm print:shadow-none">
          {/* Invoice Header */}
          <div className="flex items-center justify-between px-5 py-4 bg-slate-50 border-b border-slate-200">
            <div>
              <p className="font-black text-slate-900 text-sm tracking-tight">LAUNDRY EXPRESS</p>
              <p className="text-[11px] text-slate-500">Premium Doorstep Wash & Fold</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
              <span className="inline-block text-[11px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 mt-0.5">
                Confirmed
              </span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {/* Billing Info */}
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
              <p className="text-xs font-bold text-slate-900">{invoice.customerName}</p>
              {invoice.customerEmail && <p className="text-[11px] text-slate-500">{invoice.customerEmail}</p>}
              {invoice.address && (
                <p className="text-[11px] text-slate-500 flex items-start gap-1 mt-1">
                  <MapPin className="h-3 w-3 shrink-0 mt-0.5 text-slate-400" />
                  {invoice.address}
                </p>
              )}
            </div>

            {/* Order Meta Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Calendar, label: "Order Date", value: invoice.orderDate },
                { icon: Clock, label: "Pickup", value: `${invoice.pickupDate} · ${invoice.pickupSlot}` },
                { icon: Clock, label: "Est. Delivery", value: invoice.deliveryDate },
                { icon: CreditCard, label: "Payment", value: methodLabel[invoice.paymentMethod] ?? invoice.paymentMethod.replace(/_/g, " ") },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Icon className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase">{label}</span>
                  </div>
                  <p className="text-[11px] font-bold text-slate-900 leading-tight">{value}</p>
                </div>
              ))}
            </div>

            {/* Service Details */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5">
                <Shirt className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Service Details</span>
              </div>
              <div className="px-4 divide-y divide-slate-100">
                <Row label="Plan" value={invoice.orderDetails.planName} />
                <Row label="Quantity" value={invoice.orderDetails.quantity} />
                <Row label="Detergent" value={invoice.orderDetails.detergent} />
                <Row label="Wash" value="Cold Gentle Cycle" />
                <Row label="Pickup" value={invoice.orderDetails.specialRequest} />
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-slate-500" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Price Breakdown</span>
              </div>
              <div className="px-4 divide-y divide-slate-100">
                {invoice.subtotal !== undefined && (
                  <Row label="Laundry Wash" value={formatCurrency(invoice.subtotal)} />
                )}
                {invoice.deliveryFee !== undefined && (
                  <Row
                    label="Doorstep Delivery"
                    value={invoice.deliveryFee === 0 ? <span className="text-emerald-600">FREE</span> : formatCurrency(invoice.deliveryFee)}
                  />
                )}
                {invoice.discountAmount !== undefined && invoice.discountAmount > 0 && (
                  <Row label="Coupon Discount" value={<span className="text-emerald-600">-{formatCurrency(invoice.discountAmount)}</span>} />
                )}
                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-bold text-slate-900">Total Paid</span>
                  <span className="text-xl font-black text-primary tracking-tight">{formatCurrency(invoice.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end print:hidden">
          <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="cursor-pointer gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Print / Save PDF
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="cursor-pointer gap-1.5">
            <Download className="h-3.5 w-3.5" />
            Download Invoice
          </Button>
          <Button type="button" variant="hero" size="sm" onClick={onClose} className="cursor-pointer gap-1.5">
            Go to Dashboard
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
