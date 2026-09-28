import { APP_CONFIG } from "@/lib/constants";
import type { PricingMode } from "@/types";

export interface CalculatePriceInput {
  pricing_mode: PricingMode;
  bag_count?: number;
  estimated_weight_lbs?: number;
  detergent_id?: string;
  detergent_fee?: number;
  promo_code?: string;
  base_bag_price?: number;
  base_pound_price?: number;
  min_lbs?: number;
  max_lbs?: number;
  free_delivery_lbs?: number;
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
  const poundPrice = input.base_pound_price ?? APP_CONFIG.pricing.basePoundPrice;
  const stdDeliveryFee = input.one_bag_delivery_fee ?? APP_CONFIG.pricing.oneBagDeliveryFee;
  const freeBagThreshold = input.free_delivery_threshold ?? APP_CONFIG.pricing.freeDeliveryThresholdBags;
  const freePoundThreshold = input.free_delivery_lbs ?? APP_CONFIG.pricing.freePoundDeliveryThreshold;
  const minLbs = input.min_lbs ?? APP_CONFIG.pricing.minPoundOrder;

  let unitRate: number = bagPrice;

  // 1. Base cost calculation by mode
  if (input.pricing_mode === "per_bag") {
    unitCount = Math.max(1, Math.floor(input.bag_count || 1));
    unitName = "bags";
    unitRate = bagPrice;
    subtotal = Math.round(unitCount * unitRate * 100) / 100;
    // Free delivery rule for bags
    deliveryFee = unitCount >= freeBagThreshold ? 0 : stdDeliveryFee;
  } else if (input.pricing_mode === "per_lb") {
    const rawWeight = Number(input.estimated_weight_lbs ?? minLbs);
    unitCount = Math.max(minLbs, rawWeight);
    unitName = "lbs";
    unitRate = poundPrice;
    subtotal = Math.round(unitCount * unitRate * 100) / 100;

    // Free delivery rule: weight >= freePoundThreshold = FREE ($0.00), otherwise stdDeliveryFee
    deliveryFee = unitCount >= freePoundThreshold ? 0 : stdDeliveryFee;
  } else if (input.pricing_mode === "package") {
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
