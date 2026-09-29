"use client";

import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import { drawRoundRect } from "./canvas-helpers";

export function drawPortraitHeader(
  ctx: CanvasRenderingContext2D,
  W: number,
  logo: HTMLImageElement | null
) {
  // Top brand gradient banner
  const grad = ctx.createLinearGradient(40, 36, W - 40, 36);
  grad.addColorStop(0, "#EC4899");
  grad.addColorStop(1, "#BE185D");
  ctx.fillStyle = grad;
  drawRoundRect(ctx, 40, 36, W - 80, 12, 6);
  ctx.fill();

  // Company logo / brand
  if (logo) {
    ctx.save();
    drawRoundRect(ctx, 50, 68, 110, 52, 10);
    ctx.clip();
    ctx.drawImage(logo, 50, 68, 110, 52);
    ctx.restore();
  }

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 28px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  ctx.fillText("LAUNDRY EXPRESS", logo ? 175 : 50, 96);

  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("PREMIUM 24-HOUR WASH & FOLD SERVICE", logo ? 175 : 50, 116);

  // Company contact details on the right
  ctx.textAlign = "right";
  ctx.fillStyle = "#475569";
  ctx.font = "normal 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("123 Cleanway Blvd, Lake in the Hills, IL 60156", W - 50, 84);
  ctx.fillText("support@laundryexpress.com • (800) 555-WASH", W - 50, 104);
  ctx.fillText("www.laundryexpress.com", W - 50, 124);
  ctx.textAlign = "left";

  // Dividing rule
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, 142);
  ctx.lineTo(W - 50, 142);
  ctx.stroke();
}

export function drawPortraitMetaAndCards(
  ctx: CanvasRenderingContext2D,
  W: number,
  inv: InvoiceData
) {
  // Title & Status
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("TAX INVOICE & OFFICIAL RECEIPT", 50, 185);

  ctx.fillStyle = "#64748B";
  ctx.font = "normal 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("Verified Customer Booking & Transaction Statement", 50, 206);

  // Paid Badge
  const pW = 180;
  const pX = W - 50 - pW;
  ctx.fillStyle = "#DCFCE7";
  drawRoundRect(ctx, pX, 166, pW, 36, 18);
  ctx.fill();
  ctx.strokeStyle = "#86EFAC";
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = "#15803D";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✔ PAID IN FULL (STRIPE)", pX + pW / 2, 189);
  ctx.textAlign = "left";

  // Two Information Cards
  const cardW = (W - 100 - 24) / 2;
  const cardY = 226;
  const cardH = 150;

  // Billed To Card
  drawRoundRect(ctx, 50, cardY, cardW, cardH, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.stroke();

  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("BILLED TO CUSTOMER", 70, cardY + 28);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 16px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(inv.customerName || "Valued Customer", 70, cardY + 54);

  ctx.fillStyle = "#475569";
  ctx.font = "normal 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(inv.customerEmail || "N/A", 70, cardY + 76);
  if (inv.customerPhone) {
    ctx.fillText(`Tel: ${inv.customerPhone}`, 70, cardY + 96);
  }
  const addr = inv.address || "Doorstep Address";
  const displayAddr = addr.length > 55 ? addr.slice(0, 52) + "..." : addr;
  ctx.fillText(displayAddr, 70, cardY + (inv.customerPhone ? 120 : 106));

  // Schedule & Order Details Card
  const c2X = 50 + cardW + 24;
  drawRoundRect(ctx, c2X, cardY, cardW, cardH, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SCHEDULE & ORDER TIMELINE", c2X + 20, cardY + 28);

  const metaRows = [
    ["Order Number:", inv.orderId],
    ["Order Date:", inv.orderDate],
    ["Pickup Window:", `${inv.pickupDate} (${inv.pickupSlot})`],
    ["Est. Delivery:", `${inv.deliveryDate} (24-Hour Return)`],
    ["Doorstep Protocol:", inv.orderDetails.specialRequest || "Contactless Delivery"],
  ];

  metaRows.forEach(([label, val], idx) => {
    const rY = cardY + 52 + idx * 20;
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(label, c2X + 20, rY);
    ctx.fillStyle = "#0F172A";
    ctx.font = idx === 0 ? "bold 12px -apple-system, sans-serif" : "normal 11px -apple-system, sans-serif";
    ctx.fillText(val.length > 36 ? val.slice(0, 34) + "..." : val, c2X + 145, rY);
  });
}
