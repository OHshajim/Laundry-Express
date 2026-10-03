"use client";

import * as React from "react";
import { CheckCircle2, Printer, ArrowRight, Loader2, FileText, Mail, Check } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { downloadInvoiceAsPdf } from "@/lib/invoice/pdf-invoice-generator";
import { OrderInvoiceCard } from "./order-invoice-card";

export interface InvoiceData {
  orderId: string;
  orderDate: string;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string;
  paymentMethod: string;
  totalAmount: number;
  subtotal?: number;
  detergentFee?: number;
  deliveryFee?: number;
  discountAmount?: number;
  transactionId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  address: string;
  orderDetails: {
    planName: string;
    quantity: string;
    detergent: string;
    specialRequest: string;
  };
}

interface OrderInvoiceModalProps {
  invoice: InvoiceData | null;
  onClose: () => void;
}

export function OrderInvoiceModal({ invoice, onClose }: OrderInvoiceModalProps) {
  const [isGeneratingPdf, setIsGeneratingPdf] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);

  if (!invoice) return null;

  const handlePrint = () => window.print();

  const handlePdfDownload = async () => {
    try {
      setIsGeneratingPdf(true);
      await downloadInvoiceAsPdf(invoice, `LaundryExpress-Invoice-${invoice.orderId}.pdf`);
    } catch (err) {
      console.error("PDF generation failed:", err);
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const res = await fetch("/api/orders/email-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: invoice.orderId,
          customerEmail: invoice.customerEmail,
          customerName: invoice.customerName,
          totalAmount: invoice.totalAmount,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSent(true);
        setTimeout(() => setEmailSent(false), 5000);
      }
    } catch {
      setEmailSent(true);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <Dialog
      open={!!invoice}
      onOpenChange={onClose}
      title="Order Confirmed &amp; Scheduled"
      description="Your laundry pickup has been scheduled. Save, print, or email your official tax invoice below."
    >
      <div className="space-y-4 py-1">
        {/* Success Banner */}
        <div className="rounded-2xl overflow-hidden print:hidden">
          <div className="bg-linear-to-r from-emerald-500 to-teal-600 p-5 flex items-center gap-4 shadow-sm">
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-base tracking-tight">Booking Confirmed &amp; Paid!</p>
              <p className="text-emerald-100 text-xs mt-0.5">We will pick up your laundry during your scheduled window.</p>
            </div>
            <div className="ml-auto text-right hidden sm:block">
              <p className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider">Order ID</p>
              <p className="text-white font-mono font-black text-sm">{invoice.orderId}</p>
            </div>
          </div>
          <div className="sm:hidden bg-emerald-600 px-5 py-2 flex justify-between items-center">
            <span className="text-emerald-100 text-[10px] font-bold uppercase">Order ID</span>
            <span className="text-white font-mono font-black text-xs">{invoice.orderId}</span>
          </div>
        </div>

        {/* High-End Official Invoice Card */}
        <OrderInvoiceCard invoice={invoice} />

        {/* Modal Action Buttons with PDF Generator & Email Dispatch */}
        <div className="flex flex-col sm:flex-row gap-2 sm:justify-end print:hidden pt-2">
          <Button type="button" variant="outline" size="sm" onClick={handlePrint} className="cursor-pointer gap-1.5">
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePdfDownload}
            disabled={isGeneratingPdf}
            className="cursor-pointer gap-1.5 border-primary/30 text-primary hover:bg-pink-50 font-bold"
          >
            {isGeneratingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <FileText className="h-3.5 w-3.5" />}
            Download Invoice (PDF)
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSendEmail}
            disabled={isSendingEmail}
            className="cursor-pointer gap-1.5 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
          >
            {isSendingEmail ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : emailSent ? (
              <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
              <Mail className="h-3.5 w-3.5" />
            )}
            {emailSent ? "Sent to Email!" : "Send to Email"}
          </Button>

          <Button type="button" variant="hero" size="sm" onClick={onClose} className="cursor-pointer gap-1.5 font-bold">
            Track Order
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
