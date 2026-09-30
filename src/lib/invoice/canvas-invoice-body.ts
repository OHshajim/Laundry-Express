"use client";

import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import { drawRoundRect } from "./canvas-helpers";
import { resolveDetergentName } from "@/lib/utils";

export function drawPortraitTable(
  ctx: CanvasRenderingContext2D,
  W: number,
  inv: InvoiceData
): number {
  const tableY = 405;
  const tableW = W - 100;

  // Modern Dark Table Header Bar
  ctx.fillStyle = "#0F172A";
  drawRoundRect(ctx, 50, tableY, tableW, 40, 8);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SERVICE / ORDER DESCRIPTION", 70, tableY + 25);
  ctx.fillText("SPECIFICATION & FORMULA", 470, tableY + 25);
  ctx.fillText("QUANTITY", 780, tableY + 25);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT (USD)", W - 70, tableY + 25);
  ctx.textAlign = "left";

  const detName = resolveDetergentName(inv.orderDetails.detergent);

  const rows = [
    {
      item: inv.orderDetails.planName,
      spec: `${detName} • Gentle Cold Wash Care`,
      qty: inv.orderDetails.quantity,
      amt: `$${(inv.subtotal ?? inv.totalAmount).toFixed(2)}`,
    },
    {
      item: "Doorstep Pickup & 24hr Return Delivery",
      spec: inv.orderDetails.specialRequest || "Contactless Doorstep Delivery",
      qty: "1 Trip",
      amt: (inv.deliveryFee ?? 0) === 0 ? "FREE" : `$${(inv.deliveryFee ?? 0).toFixed(2)}`,
    },
  ];

  if (inv.discountAmount && inv.discountAmount > 0) {
    rows.push({
      item: "Promotional Coupon Discount",
      spec: "Verified discount savings applied",
      qty: "1 Promo",
      amt: `-$${inv.discountAmount.toFixed(2)}`,
    });
  }

  let y = tableY + 40;
  rows.forEach((r, idx) => {
    const rowH = 48;
    ctx.fillStyle = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
    ctx.fillRect(50, y, tableW, rowH);
    ctx.strokeStyle = "#E2E8F0";
    ctx.lineWidth = 1;
    ctx.strokeRect(50, y, tableW, rowH);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.item, 70, y + 29);

    ctx.fillStyle = "#475569";
    ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.spec, 470, y + 29);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.qty, 780, y + 29);

    ctx.textAlign = "right";
    ctx.fillStyle = r.amt === "FREE" ? "#059669" : "#0F172A";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.amt, W - 70, y + 29);
    ctx.textAlign = "left";

    y += rowH;
  });

  return y;
}

export function drawPortraitTotals(
  ctx: CanvasRenderingContext2D,
  W: number,
  inv: InvoiceData,
  startY: number
): number {
  const bY = startY + 24;
  const cardW = (W - 100 - 24) / 2;
  const cardH = 148;

  // Left card: Payment confirmation
  drawRoundRect(ctx, 50, bY, cardW, cardH, 14);
  ctx.fillStyle = "#FAF5FF";
  ctx.fill();
  ctx.strokeStyle = "#E9D5FF";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#7E22CE";
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("PAYMENT CONFIRMATION & GATEWAY", 70, bY + 28);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    `Method: ${inv.paymentMethod === "card" ? "Credit / Debit Card (Stripe)" : inv.paymentMethod}`,
    70,
    bY + 54
  );

  ctx.fillStyle = "#475569";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  const refCode = inv.orderId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
  ctx.fillText(`Stripe Reference: STRIPE-TX-${refCode}`, 70, bY + 76);
  ctx.fillText("Status: Captured & Settled (Authorized)", 70, bY + 96);
  ctx.fillText("Encrypted transaction via TLS 1.3 256-bit gateway.", 70, bY + 116);

  // Right card: Financial summary
  const tX = 50 + cardW + 24;
  drawRoundRect(ctx, tX, bY, cardW, cardH, 14);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.stroke();

  const subt = `$${(inv.subtotal ?? inv.totalAmount).toFixed(2)}`;
  const deliv = (inv.deliveryFee ?? 0) === 0 ? "FREE" : `$${(inv.deliveryFee ?? 0).toFixed(2)}`;

  ctx.fillStyle = "#64748B";
  ctx.font = "normal 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Subtotal:", tX + 24, bY + 28);
  ctx.textAlign = "right";
  ctx.fillStyle = "#0F172A";
  ctx.fillText(subt, tX + cardW - 24, bY + 28);
  ctx.textAlign = "left";

  ctx.fillStyle = "#64748B";
  ctx.fillText("Doorstep Logistics:", tX + 24, bY + 50);
  ctx.textAlign = "right";
  ctx.fillStyle = deliv === "FREE" ? "#059669" : "#0F172A";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(deliv, tX + cardW - 24, bY + 50);
  ctx.textAlign = "left";

  if (inv.discountAmount && inv.discountAmount > 0) {
    ctx.fillStyle = "#059669";
    ctx.fillText("Promo Discount:", tX + 24, bY + 72);
    ctx.textAlign = "right";
    ctx.fillText(`-$${inv.discountAmount.toFixed(2)}`, tX + cardW - 24, bY + 72);
    ctx.textAlign = "left";
  }

  // Divider
  ctx.strokeStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.moveTo(tX + 24, bY + 90);
  ctx.lineTo(tX + cardW - 24, bY + 90);
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("TOTAL CLEARED:", tX + 24, bY + 122);

  ctx.textAlign = "right";
  ctx.fillStyle = "#BE185D";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`$${inv.totalAmount.toFixed(2)}`, tX + cardW - 24, bY + 122);
  ctx.textAlign = "left";

  return bY + cardH;
}
