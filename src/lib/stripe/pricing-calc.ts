import { APP_CONFIG } from "@/lib/constants";
import type { PricingMode } from "@/types";

export interface CalculatePriceInput {
  pricing_mode: PricingMode;
  bag_count?: number;
  estimated_weight_kg?: number;
  detergent_id?: string;
  detergent_fee?: number;
  promo_code?: string;
  base_bag_price?: number;
  base_kg_price?: number;
  one_bag_delivery_fee?: number;
  free_delivery_threshold?: number;
}

export interface CalculatedPriceResult {
  pricing_mode: PricingMode;
  subtotal: number;
  detergent_fee: number;
  delivery_fee: number;
  discount_amount: number;
  tax_amount: number;
  total_amount: number;
  breakdown: {
    unit_count: number;
    unit_name: string;
    unit_rate: number;
    promo_applied?: string;
  };
}

/**
 * Server-side zero-trust pricing engine.
 * Computes exact dollar and cent totals based on verified business rules and live admin rates.
 */
export function calculateOrderPrice(input: CalculatePriceInput): CalculatedPriceResult {
  let subtotal = 0;
  let deliveryFee = 0;
  let unitCount = 0;
  let unitName = "bags";

  const bagPrice = input.base_bag_price ?? APP_CONFIG.pricing.baseBagPrice;
  const kgPrice = input.base_kg_price ?? APP_CONFIG.pricing.baseKgPrice;
  const stdDeliveryFee = input.one_bag_delivery_fee ?? APP_CONFIG.pricing.oneBagDeliveryFee;
  const freeThreshold = input.free_delivery_threshold ?? 2;

  let unitRate: number = bagPrice;

  // 1. Base cost calculation by mode
  if (input.pricing_mode === "per_bag") {
    unitCount = Math.max(1, Math.floor(input.bag_count || 1));
    unitName = "bags";
    unitRate = bagPrice;
    subtotal = unitCount * unitRate;

    // Delivery Fee rule: >= freeThreshold = FREE ($0.00), otherwise stdDeliveryFee
    deliveryFee = unitCount >= freeThreshold ? 0 : stdDeliveryFee;
  } else if (input.pricing_mode === "per_kg") {
    unitCount = Math.max(APP_CONFIG.pricing.minKgOrder, Number(input.estimated_weight_kg || APP_CONFIG.pricing.minKgOrder));
    unitName = "kg";
    unitRate = kgPrice;
    subtotal = Math.round(unitCount * unitRate * 100) / 100;

    // Free delivery if order >= $40, otherwise standard delivery fee
    deliveryFee = subtotal >= 40 ? 0 : stdDeliveryFee;
  } else if (input.pricing_mode === "package") {
    // Covered by pre-paid package credit
    unitCount = 1;
    unitName = "package credit";
    unitRate = 0;
    subtotal = 0;
    deliveryFee = 0;
  }

  // 2. Detergent add-on
  const detergentFee = Math.max(0, Number(input.detergent_fee || 0));

  // 3. Promotional discounts
  let discountAmount = 0;
  let promoApplied: string | undefined;

  if (input.promo_code) {
    const code = input.promo_code.trim().toUpperCase();
    if (code === "HEROFRESH") {
      discountAmount = Math.round(subtotal * 0.15 * 100) / 100; // 15% off
      promoApplied = "HEROFRESH (15% off)";
    } else if (code === "FREESHIP") {
      discountAmount = deliveryFee; // Waives delivery fee
      deliveryFee = 0;
      promoApplied = "FREESHIP (Free Delivery)";
    }
  }

  const taxableAmount = Math.max(0, subtotal + detergentFee + deliveryFee - discountAmount);
  const taxAmount = 0; // Tax-exempt or bundled in base rate
  const totalAmount = Math.round(taxableAmount * 100) / 100;

  return {
    pricing_mode: input.pricing_mode,
    subtotal,
    detergent_fee: detergentFee,
    delivery_fee: deliveryFee,
    discount_amount: discountAmount,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    breakdown: {
      unit_count: unitCount,
      unit_name: unitName,
      unit_rate: unitRate,
      promo_applied: promoApplied,
    },
  };
}
