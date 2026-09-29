"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, ArrowRight, FileText, Loader2, Home, Truck, Clock, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { downloadInvoiceAsPdf } from "@/lib/invoice/pdf-invoice-generator";
import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import type { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { OrderSummaryCard } from "./order-summary-card";

function resolveDetergent(id?: string): string {
  if (!id) return "Standard Eco Detergent";
  const catalog: Record<string, string> = {
    "det-tide-pods": "Tide Original Power Pods",
    "det-eco-plant": "Seventh Generation Eco-Plant",
    "det-hypoallergenic": "All Free & Clear (Hypoallergenic)",
    "det-persil": "Persil ProClean Intense",
    "det-lavender": "Mrs. Meyer's Clean Day",
  };
  return catalog[id] || id.replace(/^det-/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id") || "LX-CONFIRMED";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [paid, setPaid] = React.useState(true);
  const autoEmailSentRef = React.useRef(false);

  React.useEffect(() => {
    const url = `/api/checkout?order_id=${encodeURIComponent(orderId)}${sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ""}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => {
        if (d?.order) setOrder(d.order);
        if (d?.paid !== undefined) setPaid(d.paid);
      })
      .catch(() => {});
  }, [sessionId, orderId]);

  React.useEffect(() => {
    if (order && paid && !autoEmailSentRef.current) {
      autoEmailSentRef.current = true;
      fetch("/api/orders/email-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number || orderId,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          totalAmount: order.total_amount,
        }),
      })
        .then((r) => r.json())
        .then((res) => { if (res.success) setEmailSent(true); })
        .catch(() => {});
    }
  }, [order, paid, orderId]);

  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
        <h2 className="text-base font-black text-slate-900">Verifying Payment &amp; Retrieving Order...</h2>
        <p className="text-xs text-slate-500">Connecting securely with Stripe to retrieve your confirmed booking details.</p>
      </div>
    );
  }

  const customerName = order.customer_name || "Valued Customer";
  const customerEmail = order.customer_email || "";
  const fullAddress = [order.street_address, order.apt_unit ? `Apt ${order.apt_unit}` : "", order.city, order.state, order.zip_code].filter(Boolean).join(", ") || order.pickup_address || "Doorstep Address";
  const slotLabel = order.pickup_slot === "8am-12pm" ? "8:00 AM – 12:00 PM" : order.pickup_slot === "1pm-6pm" ? "1:00 PM – 6:00 PM" : order.pickup_slot || "Scheduled Window";

  const getInvoiceData = (): InvoiceData => ({
    orderId: order.order_number || orderId,
    orderDate: order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    pickupDate: order.pickup_date || new Date().toISOString().split("T")[0],
    pickupSlot: slotLabel,
    deliveryDate: order.delivery_date || new Date(Date.now() + 86400000).toISOString().split("T")[0],
    paymentMethod: order.payment_method === "card" ? "Credit / Debit Card (Stripe)" : "Stripe 256-bit Secure Checkout",
    totalAmount: Number(order.total_amount || 0),
    subtotal: Number(order.subtotal || order.total_amount || 0),
    deliveryFee: Number(order.delivery_fee || 0),
    discountAmount: Number(order.discount_amount || 0),
    customerName,
    customerEmail,
    customerPhone: order.customer_phone || "",
    address: fullAddress,
    orderDetails: {
      planName: order.pricing_mode === "per_bag" ? "By The Bag Wash & Fold (13 Gal)" : order.pricing_mode === "package" ? "Saver Package Credit" : "By The Pound (lb) Wash & Fold",
      quantity: order.pricing_mode === "per_bag" ? `${order.bag_count || 1} Bag(s)` : `${order.final_weight_lbs || order.estimated_weight_lbs || 15} lbs`,
      detergent: resolveDetergent(order.detergent_id),
      temperature: "Standard Cold Eco-Wash (30°C)",
      specialRequest: order.is_out_of_home ? "Away — Contactless Doorstep Pickup" : "Home — Driver Rings Bell",
    },
  });

  const handleDownloadPdf = async () => {
    try {
      setIsPdfGenerating(true);
      await downloadInvoiceAsPdf(getInvoiceData(), `LaundryExpress-Invoice-${order.order_number || orderId}.pdf`);
    } catch {
      window.print();
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setIsSendingEmail(true);
      const res = await fetch("/api/orders/email-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          orderNumber: order.order_number || orderId,
          customerEmail: order.customer_email,
          customerName: order.customer_name,
          totalAmount: order.total_amount,
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
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
      <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden border-2 border-slate-200 shadow-md">
        <Image src="/brand/logo-badge.jpg" alt="Laundry Express" fill className="object-cover" sizes="64px" priority />
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

      {/* Real Order Info Card */}
      <OrderSummaryCard
        order={order}
        orderId={orderId}
        paid={paid}
        customerName={customerName}
        customerEmail={customerEmail}
        fullAddress={fullAddress}
        slotLabel={slotLabel}
      />

      {/* Actions: Download Invoice PDF & Send Email */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Button
          type="button" variant="outline" onClick={handleDownloadPdf} disabled={isPdfGenerating}
          className="w-full sm:w-auto cursor-pointer gap-2 border-primary/30 text-primary hover:bg-pink-50 font-bold"
        >
          {isPdfGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
          Download Invoice (PDF)
        </Button>

        <Button
          type="button" variant="outline" onClick={handleSendEmail} disabled={isSendingEmail}
          className="w-full sm:w-auto cursor-pointer gap-2 border-slate-300 text-slate-700 hover:bg-slate-50 font-bold"
        >
          {isSendingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : emailSent ? <Check className="h-4 w-4 text-emerald-600" /> : <Mail className="h-4 w-4" />}
          {emailSent ? "Sent to Email!" : "Send to Email"}
        </Button>

        <Link href="/dashboard/orders" className="w-full sm:w-auto">
          <Button variant="hero" className="w-full sm:w-auto cursor-pointer gap-2">
            <span>Track in Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {emailSent && (
        <p className="text-xs text-emerald-600 font-semibold flex items-center justify-center gap-1">
          <Check className="h-3.5 w-3.5" /> Official tax invoice PDF sent to {customerEmail || "your email"} and admin.
        </p>
      )}

      <div className="pt-2">
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
