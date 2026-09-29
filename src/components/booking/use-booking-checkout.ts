"use client";

import * as React from "react";
import type { InvoiceData } from "./order-invoice-modal";
import type { AddressDetails } from "./step-out-of-home";
import type { PricingMode, User } from "@/types";

export interface CheckoutPayload {
  currentUser: User | null;
  pricingMode: PricingMode;
  bagCount: number;
  weightLbs?: number;
  selectedDetergentId: string;
  selectedTemp: string;
  selectedDate: string;
  selectedSlot: string;
  dropoffDate: string;
  address: string;
  phone?: string;
  addressDetails?: AddressDetails;
  isOutOfHome: boolean;
  isAwayForDropoff: boolean;
  bagConfirmed: boolean;
  notes: string;
  priceResult: { subtotal: number; delivery_fee: number; discount_amount: number; total_amount: number };
  paymentMethod: "card" | "apple_pay" | "cash_on_delivery";
}

export function useBookingCheckout() {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [invoice, setInvoice] = React.useState<InvoiceData | null>(null);

  const checkout = async (p: CheckoutPayload) => {
    setIsProcessing(true);
    const delivery = p.dropoffDate || new Date(Date.now() + 24 * 3600 * 1000).toISOString().split("T")[0];
    const weightAmount = p.weightLbs ?? 15;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: p.currentUser?.id,
          customer_name: p.currentUser?.full_name || p.currentUser?.name || "Customer",
          customer_email: p.currentUser?.email || "",
          customer_phone: p.phone || p.currentUser?.phone || "",
          pricing_mode: p.pricingMode,
          bag_count: p.bagCount,
          estimated_weight_lbs: weightAmount,
          detergent_id: p.selectedDetergentId,
          wash_temperature: p.selectedTemp,
          pickup_date: p.selectedDate,
          pickup_slot: p.selectedSlot,
          delivery_date: delivery,
          street_address: p.addressDetails?.street || p.address,
          apt_unit: p.addressDetails?.apt || "",
          city: p.addressDetails?.city || "Lake in the Hills",
          state: p.addressDetails?.state || "IL",
          zip_code: p.addressDetails?.zip || "60156",
          is_out_of_home: p.isOutOfHome,
          is_away_for_dropoff: p.isAwayForDropoff,
          bag_outside_door_confirmed: p.bagConfirmed,
          special_instructions: p.notes,
          subtotal: p.priceResult.subtotal,
          delivery_fee: p.priceResult.delivery_fee,
          discount_amount: p.priceResult.discount_amount,
          total_amount: p.priceResult.total_amount,
          payment_method: p.paymentMethod,
        }),
      });

      const data = await res.json();

      // If Stripe returned a checkout session URL, redirect immediately
      if (data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      const orderId = data?.order?.order_number || `LX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const slotLabel = p.selectedSlot === "8am-12pm" ? "8:00 AM – 12:00 PM" : "1:00 PM – 6:00 PM";

      const detCatalog: Record<string, string> = {
        "det-tide-pods": "Tide Original Power Pods",
        "det-eco-plant": "Seventh Generation Eco-Plant",
        "det-hypoallergenic": "All Free & Clear (Hypoallergenic)",
        "det-persil": "Persil ProClean Intense",
        "det-lavender": "Mrs. Meyer's Clean Day",
      };
      const friendlyDetergent = detCatalog[p.selectedDetergentId] || p.selectedDetergentId.replace(/^det-/, "").replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

      setInvoice({
        orderId,
        orderDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pickupDate: p.selectedDate,
        pickupSlot: slotLabel,
        deliveryDate: delivery,
        paymentMethod: p.paymentMethod,
        totalAmount: Number(data?.order?.total_amount || p.priceResult.total_amount),
        subtotal: Number(data?.order?.subtotal || p.priceResult.subtotal),
        deliveryFee: Number(data?.order?.delivery_fee || p.priceResult.delivery_fee),
        discountAmount: Number(data?.order?.discount_amount || p.priceResult.discount_amount),
        customerName: data?.order?.customer_name || p.currentUser?.full_name || p.currentUser?.name || "Customer",
        customerEmail: data?.order?.customer_email || p.currentUser?.email || "",
        address: data?.order?.pickup_address || p.address,
        orderDetails: {
          planName: p.pricingMode === "per_bag" ? "By The Bag (13 Gal)" : p.pricingMode === "package" ? "Saver Package" : "By The Pound (lb)",
          quantity: p.pricingMode === "per_bag" ? `${p.bagCount} Bag(s)` : `${weightAmount} lbs`,
          detergent: friendlyDetergent,
          temperature: "Standard Cold Eco-Wash (30°C)",
          specialRequest: p.isOutOfHome ? "Away (Contactless Pickup)" : "Home (Ring Bell)",
        },
      });
    } catch {} finally {
      setIsProcessing(false);
    }
  };

  return { checkout, isProcessing, invoice, setInvoice };
}
