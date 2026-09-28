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
  addressDetails?: AddressDetails;
  isOutOfHome: boolean;
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
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: p.currentUser?.id,
          customer_name: p.currentUser?.full_name || p.currentUser?.name || "Direct Customer",
          customer_email: p.currentUser?.email || "",
          customer_phone: p.currentUser?.phone || "",
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
      const orderId = data?.order?.order_number || `LX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      setInvoice({
        orderId,
        orderDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pickupDate: p.selectedDate,
        pickupSlot: p.selectedSlot === "8am-12pm" ? "8am – 12pm" : "1pm – 6pm",
        deliveryDate: delivery,
        paymentMethod: p.paymentMethod,
        totalAmount: p.priceResult.total_amount,
        customerName: p.currentUser?.full_name || p.currentUser?.name || "Direct Customer",
        customerEmail: p.currentUser?.email || "",
        address: p.address,
        orderDetails: {
          planName: p.pricingMode === "per_bag" ? "By The Bag (13 Gal)" : p.pricingMode === "package" ? "Saver Package" : "By The Pound (lb)",
          quantity: p.pricingMode === "per_bag" ? `${p.bagCount} Bag(s)` : `${weightAmount} lbs`,
          detergent: p.selectedDetergentId,
          temperature: p.selectedTemp,
          specialRequest: p.isOutOfHome ? "Away (Contactless Doorstep)" : "Home (Ring Bell)",
        },
      });
    } catch {} finally {
      setIsProcessing(false);
    }
  };

  return { checkout, isProcessing, invoice, setInvoice };
}
