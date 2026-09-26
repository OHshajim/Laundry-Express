"use client";

import * as React from "react";
import { CheckCircle2, Printer, ArrowRight, ShieldCheck } from "lucide-react";
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

/**
 * OrderInvoiceModal Component
 * Implements AGENTS.md 4.g:
 * Generates an official invoice with Order ID, Order Date, Pickup Date,
 * Delivery Date, Payment Method, Total Amount, and Order Details.
 */
export function OrderInvoiceModal({ invoice, onClose }: OrderInvoiceModalProps) {
  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog
      open={!!invoice}
      onOpenChange={onClose}
      title="Order Confirmed & Official Invoice"
      description="Your laundry pickup order has been placed. You can view, save, or print your invoice below."
    >
      <div className="space-y-4 py-1 print:p-0">
        {/* Success Header */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
          <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-black text-emerald-950 text-sm">Pickup Confirmed!</h4>
            <span className="text-[11px] text-emerald-700">
              Assigned Order ID: <strong>{invoice.orderId}</strong>
            </span>
          </div>
        </div>

        {/* Printable Invoice Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 text-xs space-y-3 shadow-2xs">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3">
            <div>
              <span className="font-black text-slate-900 text-base block tracking-tight">LAUNDRY EXPRESS</span>
              <span className="text-[11px] text-slate-500">Premium Doorstep Wash &amp; Fold</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Status</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Confirmed / Paid
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 py-1 text-slate-700">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Order ID</span>
              <span className="font-mono font-bold text-slate-900">{invoice.orderId}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Order Date</span>
              <span className="font-semibold text-slate-900">{invoice.orderDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Pickup Date &amp; Window</span>
              <span className="font-semibold text-slate-900">{invoice.pickupDate} ({invoice.pickupSlot})</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Est. Delivery Date</span>
              <span className="font-semibold text-slate-900">{invoice.deliveryDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Payment Method</span>
              <span className="font-semibold text-slate-900 capitalize">{invoice.paymentMethod.replace(/_/g, " ")}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Amount</span>
              <span className="font-black text-slate-900 text-sm text-primary">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>
          </div>

          {/* Order Details Breakdown */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Order Details</span>
            <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700">
              <p><strong>Plan &amp; Quantity:</strong> {invoice.orderDetails.quantity} ({invoice.orderDetails.planName})</p>
              <p><strong>Detergent:</strong> {invoice.orderDetails.detergent}</p>
              <p><strong>Water Temp:</strong> {invoice.orderDetails.temperature}</p>
              <p><strong>Presence:</strong> {invoice.orderDetails.specialRequest}</p>
            </div>
            <p className="text-[11px] text-slate-600 pt-1 border-t border-slate-200/60 truncate">
              <strong>Address:</strong> {invoice.address}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-1">
          <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="cursor-pointer text-xs">
            <Printer className="h-3.5 w-3.5 mr-1" />
            <span>Print Invoice</span>
          </Button>

          <Button type="button" variant="hero" size="sm" onClick={onClose} className="cursor-pointer text-xs">
            <span>Done &amp; View Dashboard</span>
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
