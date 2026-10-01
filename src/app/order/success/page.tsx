"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CheckCircle2, ArrowRight, FileText, Loader2, Home, Clock, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { downloadInvoiceAsPdf } from "@/lib/invoice/pdf-invoice-generator";
import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import type { Order } from "@/types";
import { formatSlotLabel, resolveDetergentName } from "@/lib/utils";
import { OrderSummaryCard } from "./order-summary-card";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id") || "LX-CONFIRMED";
  const [order, setOrder] = React.useState<Order | null>(null);
  const [isPdfGenerating, setIsPdfGenerating] = React.useState(false);
  const [isSendingEmail, setIsSendingEmail] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [paid, setPaid] = React.useState(false);
  const [isStatusChecked, setIsStatusChecked] = React.useState(false);
  const [statusError, setStatusError] = React.useState("");
  const [actionError, setActionError] = React.useState("");
  const [slotTimes, setSlotTimes] = React.useState({ s1: "", e1: "", s2: "", e2: "" });

  React.useEffect(() => {
    fetch("/api/content?type=settings").then((r) => r.json()).then((d) => {
      if (d?.settings) setSlotTimes({ s1: d.settings.slot1_start || "", e1: d.settings.slot1_end || "", s2: d.settings.slot2_start || "", e2: d.settings.slot2_end || "" });
    }).catch(() => {});
  }, []);

  React.useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    const url = `/api/checkout?order_id=${encodeURIComponent(orderId)}${sessionId ? `&session_id=${encodeURIComponent(sessionId)}` : ""}`;

    const checkStatus = async () => {
      try {
        const response = await fetch(url, { cache: "no-store" });
        const data = await response.json();
        if (!response.ok || !data?.success || !data.order) {
          throw new Error(data?.error || "Unable to retrieve this order.");
        }
        if (!active) return;
        setOrder(data.order);
        const isOrderPaid = data.order.payment_status === "paid";
        setPaid(isOrderPaid);
        setStatusError("");
        if (isOrderPaid || data.order.payment_status === "failed") {
          setIsStatusChecked(true);
          return;
        }
      } catch (error) {
        if (!active) return;
        setStatusError(error instanceof Error ? error.message : "Unable to verify payment.");
      }

      attempts += 1;
      if (attempts < 30) {
        timer = setTimeout(checkStatus, 2000);
      } else if (active) {
        setIsStatusChecked(true);
        setStatusError("Payment is still pending. You can check the latest status in your dashboard.");
      }
    };

    void checkStatus();
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [sessionId, orderId]);

  if (!order && !isStatusChecked) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Loader2 className="h-10 w-10 text-primary animate-spin mx-auto" />
        <h2 className="text-base font-black text-slate-900">Checking your order status...</h2>
        <p className="text-xs text-slate-500">Your order will appear in the dashboard as soon as it is available.</p>
      </div>
    );
  }
  if (!order) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-base font-black text-slate-900">Order status unavailable</h2>
        <p role="alert" className="text-xs text-rose-700">{statusError || "The order could not be retrieved."}</p>
        <Link href="/dashboard/orders"><Button variant="hero">Open your dashboard</Button></Link>
      </div>
    );
  }

  const customerName = order.customer_name || "Valued Customer";
  const customerEmail = order.customer_email || "";
  const fullAddress = [order.street_address, order.apt_unit ? `Apt ${order.apt_unit}` : "", order.city, order.state, order.zip_code].filter(Boolean).join(", ") || order.pickup_address || "Doorstep Address";
  const slotLabel = slotTimes.s1 && slotTimes.e1 && slotTimes.s2 && slotTimes.e2 && (order.pickup_slot === "8am-12pm" || order.pickup_slot === "1pm-6pm")
    ? formatSlotLabel(order.pickup_slot as "8am-12pm" | "1pm-6pm", slotTimes.s1, slotTimes.e1, slotTimes.s2, slotTimes.e2)
    : order.pickup_slot || "Scheduled Window";

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
      detergent: order.detergent_name || resolveDetergentName(order.detergent_id),
      specialRequest: order.is_out_of_home ? "Away — Contactless Doorstep Pickup" : "Home — Driver Rings Bell",
    },
  });

  const handleDownloadPdf = async () => {
    try {
      setActionError("");
      setIsPdfGenerating(true);
      await downloadInvoiceAsPdf(getInvoiceData(), `LaundryExpress-Invoice-${order.order_number || orderId}.pdf`);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to generate invoice PDF.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setActionError("");
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
      if (!res.ok || !data?.success) throw new Error(data?.error || "Unable to send invoice email.");
      setEmailSent(true);
      setTimeout(() => setEmailSent(false), 5000);
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Unable to send invoice email.");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-center space-y-6">
      <div className="relative h-16 w-16 mx-auto rounded-2xl overflow-hidden border border-slate-200 bg-white p-1 shadow-sm flex items-center justify-center">
        <Image src="/brand/logo-badge.jpg" alt="Laundry Express" width={64} height={64} className="object-contain rounded-xl" priority />
      </div>

      <div className={`h-16 w-16 mx-auto rounded-full flex items-center justify-center shadow-md ${
        paid ? "bg-emerald-100 text-emerald-600 shadow-emerald-500/10" : "bg-amber-100 text-amber-700 shadow-amber-500/10"
      }`}>
        {paid ? <CheckCircle2 className="h-9 w-9" /> : <Clock className="h-9 w-9" />}
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          {order.order_status === "cancelled"
            ? "Order Cancelled"
            : paid ? "Payment Confirmed & Booking Scheduled" : "Order Received — Payment Pending"}
        </h1>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          {order.order_status === "cancelled"
            ? "Cancellation does not automatically refund a completed payment. Contact the admin to discuss any refund."
            : paid
            ? "Stripe confirmed your payment. Your invoice is available below."
            : "We are waiting for Stripe to confirm your payment. The order is not confirmed yet."}
        </p>
      </div>
      {statusError && <p role="status" className="text-xs text-amber-800">{statusError}</p>}

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

      {/* Actions are only available after the server confirms payment. */}
      {paid && <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
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
      </div>}
      {!paid && (
        <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
          View pending order in dashboard <ArrowRight className="h-4 w-4" />
        </Link>
      )}
      {actionError && <p role="alert" className="text-xs text-rose-700">{actionError}</p>}

      {emailSent && paid && (
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
