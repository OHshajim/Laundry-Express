"use client";

import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import { drawRoundRect } from "./canvas-helpers";

export function drawPortraitTable(
  ctx: CanvasRenderingContext2D,
  W: number,
  inv: InvoiceData
): number {
  const tableY = 400;
  const tableW = W - 100;

  // Table header bar
  ctx.fillStyle = "#0F172A";
  drawRoundRect(ctx, 50, tableY, tableW, 40, 8);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("ITEM / SERVICE DESCRIPTION", 70, tableY + 25);
  ctx.fillText("SPECIFICATION / FORMULA", 460, tableY + 25);
  ctx.fillText("QUANTITY", 780, tableY + 25);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT (USD)", W - 70, tableY + 25);
  ctx.textAlign = "left";

  const detName = (inv.orderDetails.detergent || "Standard Eco Detergent")
    .replace(/^det-/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const rows = [
    {
      item: inv.orderDetails.planName,
      spec: `${detName} • Cold Water Gentle Care (30°C)`,
      qty: inv.orderDetails.quantity,
      amt: `$${(inv.subtotal ?? inv.totalAmount).toFixed(2)}`,
    },
    {
      item: "Doorstep Pickup & 24hr Return Delivery",
      spec: inv.orderDetails.specialRequest || "Contactless Delivery",
      qty: "1 Trip",
      amt: (inv.deliveryFee ?? 0) === 0 ? "FREE" : `$${(inv.deliveryFee ?? 0).toFixed(2)}`,
    },
  ];

  if (inv.discountAmount && inv.discountAmount > 0) {
    rows.push({
      item: "Promotional Coupon Discount",
      spec: "Promotional order savings applied",
      qty: "1 Promo",
      amt: `-$${inv.discountAmount.toFixed(2)}`,
    });
  }

  let y = tableY + 40;
  rows.forEach((r, idx) => {
    const rowH = 46;
    ctx.fillStyle = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
    ctx.fillRect(50, y, tableW, rowH);
    ctx.strokeStyle = "#E2E8F0";
    ctx.strokeRect(50, y, tableW, rowH);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.item, 70, y + 28);

    ctx.fillStyle = "#475569";
    ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.spec, 460, y + 28);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.qty, 780, y + 28);

    ctx.textAlign = "right";
    ctx.fillStyle = r.amt === "FREE" ? "#16A34A" : "#0F172A";
    ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(r.amt, W - 70, y + 28);
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
  const cardH = 145;

  // Left card: Payment confirmation
  drawRoundRect(ctx, 50, bY, cardW, cardH, 12);
  ctx.fillStyle = "#FAF5FF";
  ctx.fill();
  ctx.strokeStyle = "#E9D5FF";
  ctx.stroke();

  ctx.fillStyle = "#7E22CE";
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("PAYMENT CONFIRMATION", 70, bY + 28);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`Method: ${inv.paymentMethod === "card" ? "Credit/Debit Card (Stripe)" : inv.paymentMethod}`, 70, bY + 54);

  ctx.fillStyle = "#475569";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  const refCode = inv.orderId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase();
  ctx.fillText(`Stripe Reference: STRIPE-TX-${refCode}`, 70, bY + 76);
  ctx.fillText("Status: Captured & Settled (Authorized)", 70, bY + 96);
  ctx.fillText("Encrypted transaction via TLS 1.3 256-bit gateway.", 70, bY + 116);

  // Right card: Financial summary
  const tX = 50 + cardW + 24;
  drawRoundRect(ctx, tX, bY, cardW, cardH, 12);
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
  ctx.fillStyle = deliv === "FREE" ? "#16A34A" : "#0F172A";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(deliv, tX + cardW - 24, bY + 50);
  ctx.textAlign = "left";

  if (inv.discountAmount && inv.discountAmount > 0) {
    ctx.fillStyle = "#16A34A";
    ctx.fillText("Promo Discount:", tX + 24, bY + 72);
    ctx.textAlign = "right";
    ctx.fillText(`-$${inv.discountAmount.toFixed(2)}`, tX + cardW - 24, bY + 72);
    ctx.textAlign = "left";
  }

  // Total divider
  ctx.strokeStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.moveTo(tX + 24, bY + 88);
  ctx.lineTo(tX + cardW - 24, bY + 88);
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 15px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("TOTAL PAID:", tX + 24, bY + 120);

  ctx.textAlign = "right";
  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 24px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(`$${inv.totalAmount.toFixed(2)}`, tX + cardW - 24, bY + 120);
  ctx.textAlign = "left";

  return bY + cardH;
}

export function drawPortraitFooterNotes(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  startY: number
) {
  // 100% Satisfaction Guarantee banner
  const gY = startY + 20;
  const gW = W - 100;
  drawRoundRect(ctx, 50, gY, gW, 80, 12);
  ctx.fillStyle = "#F0FDF4";
  ctx.fill();
  ctx.strokeStyle = "#BBF7D0";
  ctx.stroke();

  ctx.fillStyle = "#15803D";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("✔  100% CLEAN & FRESH SATISFACTION GUARANTEE", 70, gY + 28);

  ctx.fillStyle = "#166534";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    "Every order is washed individually in cold water with your chosen formula, dried gently, folded with care, and sealed for protected doorstep return.",
    70,
    gY + 50
  );

  // Policy / Terms notes box
  const tY = gY + 96;
  drawRoundRect(ctx, 50, tY, gW, 110, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SERVICE NOTES & PROTOCOL:", 70, tY + 26);

  const notes = [
    "• Standard Cold Wash: In compliance with fabric preservation standards, all garments are gently washed in cold water (30°C).",
    "• Verified Photo Proof: All doorstep pickups and drop-offs are verified by high-resolution driver photos available in your portal.",
    "• Dedicated Support: For order adjustments or questions, contact us at (800) 555-WASH or support@laundryexpress.com.",
  ];

  notes.forEach((nt, idx) => {
    ctx.fillStyle = "#64748B";
    ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(nt, 70, tY + 48 + idx * 20);
  });

  // Bottom footer divider
  ctx.strokeStyle = "#E2E8F0";
  ctx.beginPath();
  ctx.moveTo(50, H - 65);
  ctx.lineTo(W - 50, H - 65);
  ctx.stroke();

  ctx.fillStyle = "#64748B";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Thank you for choosing Laundry Express! Support: (800) 555-WASH • support@laundryexpress.com", 50, H - 38);
  ctx.textAlign = "right";
  ctx.fillText("Official Computer-Generated Tax Invoice & Electronic Receipt • Valid Without Physical Signature", W - 50, H - 38);
  ctx.textAlign = "left";
}
