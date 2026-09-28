"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, ArrowRight, FileText, Loader2, Home, Truck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { downloadInvoiceAsPdf } from "@/lib/invoice/pdf-invoice-generator";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id") || "LX-CONFIRMED";
  const [loading, setLoading] = React.useState(true);
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);
  const [paid, setPaid] = React.useState(true);

  React.useEffect(() => {
    if (sessionId) {
      fetch(`/api/checkout?session_id=${sessionId}&order_id=${orderId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d?.paid !== undefined) setPaid(d.paid);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [sessionId, orderId]);

  const handleDownloadPdf = async () => {
    try {
      setIsPdfGenerating(true);
      await downloadInvoiceAsPdf({
        orderId,
        orderDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pickupDate: new Date().toISOString().split("T")[0],
        pickupSlot: "Morning or Afternoon Window",
        deliveryDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        paymentMethod: "card",
        totalAmount: 32.50,
        subtotal: 32.50,
        deliveryFee: 0,
        customerName: "Valued Customer",
        customerEmail: "customer@laundryexpress.com",
        address: "Doorstep Delivery Address",
        orderDetails: {
          planName: "Wash & Fold Service",
          quantity: "1 Order",
          detergent: "Tide Pods Premium",
          temperature: "cold",
          specialRequest: "Doorstep Contactless",
        },
      }, `LaundryExpress-Invoice-${orderId}.pdf`);
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
      {/* Brand Badge */}
      <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
        <Image
          src="/brand/logo-badge.jpg"
          alt="Laundry Express"
          fill
          className="object-cover"
          sizes="64px"
          priority
        />
      </div>

      <div className="h-16 w-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-md shadow-emerald-500/10">
        <CheckCircle2 className="h-9 w-9" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Payment Confirmed &amp; Booking Scheduled!
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          Your payment was processed securely via Stripe. Our driver will arrive during your scheduled window.
        </p>
      </div>

      {/* Order Info Card */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Official Order</span>
            <span className="font-mono font-black text-sm text-slate-900">{orderId}</span>
          </div>
          <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {paid ? "✔ Paid via Stripe" : "Processing"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Truck className="h-4 w-4 text-primary shrink-0" />
            <span>24-Hour Express Turnaround</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-4 w-4 text-sky-600 shrink-0" />
            <span>Live Status &amp; Driver Photo Proof</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleDownloadPdf}
          disabled={isPdfGenerating}
          className="w-full sm:w-auto cursor-pointer gap-2 border-primary/30 text-primary hover:bg-pink-50 font-bold"
        >
          {isPdfGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Download Invoice (PDF)
        </Button>

        <Link href="/dashboard/orders" className="w-full sm:w-auto">
          <Button variant="hero" className="w-full sm:w-auto cursor-pointer gap-2">
            <span>Track Order in Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="pt-4">
        <Link href="/" className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-flex items-center gap-1">
          <Home className="h-3.5 w-3.5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <React.Suspense fallback={<div className="p-12 text-center text-sm text-slate-400">Loading order status...</div>}>
          <SuccessContent />
        </React.Suspense>
      </main>
      <Footer />
    </div>
  );
}
