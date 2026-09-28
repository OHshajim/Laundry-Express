"use client";

import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import { loadLogoImage, drawRoundRect, triggerCanvasDownload } from "./canvas-helpers";

function drawHeaderAndMeta(ctx: CanvasRenderingContext2D, W: number, logo: HTMLImageElement | null, inv: InvoiceData) {
  const grad = ctx.createLinearGradient(40, 40, W - 40, 40);
  grad.addColorStop(0, "#EC4899");
  grad.addColorStop(1, "#BE185D");
  ctx.fillStyle = grad;
  drawRoundRect(ctx, 40, 40, W - 80, 16, 8);
  ctx.fill();

  if (logo) {
    ctx.save();
    drawRoundRect(ctx, 80, 80, 120, 56, 10);
    ctx.clip();
    ctx.drawImage(logo, 80, 80, 120, 56);
    ctx.restore();
  }
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 26px -apple-system, sans-serif";
  ctx.fillText("LAUNDRY EXPRESS", logo ? 215 : 80, 110);
  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 12px -apple-system, sans-serif";
  ctx.fillText("PREMIUM 24-HOUR WASH & FOLD SERVICE", logo ? 215 : 80, 130);

  ctx.textAlign = "right";
  ctx.fillStyle = "#64748B";
  ctx.font = "normal 12px -apple-system, sans-serif";
  ctx.fillText("123 Cleanway Blvd, Lake in the Hills, IL 60156", W - 80, 98);
  ctx.fillText("support@laundryexpress.com • (800) 555-WASH", W - 80, 118);
  ctx.fillText("www.laundryexpress.com", W - 80, 138);
  ctx.textAlign = "left";

  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(80, 165);
  ctx.lineTo(W - 80, 165);
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 28px -apple-system, sans-serif";
  ctx.fillText("TAX INVOICE & RECEIPT", 80, 215);

  const pX = W - 220;
  ctx.fillStyle = "#DCFCE7";
  drawRoundRect(ctx, pX, 185, 140, 36, 18);
  ctx.fill();
  ctx.fillStyle = "#15803D";
  ctx.font = "bold 14px -apple-system, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✔ PAID IN FULL", pX + 70, 208);
  ctx.textAlign = "left";

  drawRoundRect(ctx, 80, 245, 490, 150, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.stroke();
  drawRoundRect(ctx, 610, 245, 510, 150, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("BILLED TO", 100, 272);
  ctx.fillText("ORDER SCHEDULE & DETAILS", 630, 272);

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText(inv.customerName || "Valued Customer", 100, 300);
  ctx.fillStyle = "#475569";
  ctx.font = "normal 13px -apple-system, sans-serif";
  ctx.fillText(inv.customerEmail || "N/A", 100, 324);
  const addr = inv.address || "Doorstep Address";
  ctx.fillText(addr.length > 45 ? addr.slice(0, 42) + "..." : addr, 100, 350);

  const meta = [
    ["Order ID:", inv.orderId],
    ["Order Date:", inv.orderDate],
    ["Pickup Window:", `${inv.pickupDate} (${inv.pickupSlot})`],
    ["Est. Delivery:", inv.deliveryDate],
  ];
  meta.forEach(([k, v], i) => {
    ctx.fillStyle = "#64748B";
    ctx.font = "bold 12px -apple-system, sans-serif";
    ctx.fillText(k, 630, 300 + i * 22);
    ctx.fillStyle = "#0F172A";
    ctx.fillText(v, 750, 300 + i * 22);
  });
}

function drawTableAndTotals(ctx: CanvasRenderingContext2D, W: number, inv: InvoiceData) {
  const tableY = 425;
  ctx.fillStyle = "#0F172A";
  drawRoundRect(ctx, 80, tableY, W - 160, 40, 8);
  ctx.fill();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 12px -apple-system, sans-serif";
  ctx.fillText("ITEM / SERVICE", 100, tableY + 25);
  ctx.fillText("SPECIFICATION", 460, tableY + 25);
  ctx.fillText("QTY", 780, tableY + 25);
  ctx.textAlign = "right";
  ctx.fillText("AMOUNT", W - 100, tableY + 25);
  ctx.textAlign = "left";

  const rows = [
    { item: inv.orderDetails.planName, spec: `${inv.orderDetails.detergent} • Cold Wash`, qty: inv.orderDetails.quantity, amt: `$${(inv.subtotal ?? inv.totalAmount).toFixed(2)}` },
    { item: "Doorstep Pickup & 24hr Return", spec: inv.orderDetails.specialRequest || "Contactless Delivery", qty: "1 trip", amt: (inv.deliveryFee ?? 0) === 0 ? "FREE" : `$${(inv.deliveryFee ?? 0).toFixed(2)}` },
  ];
  if (inv.discountAmount && inv.discountAmount > 0) {
    rows.push({ item: "Coupon Promo Discount", spec: "Promotional credit", qty: "1", amt: `-$${inv.discountAmount.toFixed(2)}` });
  }

  let y = tableY + 40;
  rows.forEach((r, idx) => {
    y += 50;
    ctx.fillStyle = idx % 2 === 0 ? "#FFFFFF" : "#F8FAFC";
    ctx.fillRect(80, y - 36, W - 160, 50);
    ctx.strokeStyle = "#E2E8F0";
    ctx.strokeRect(80, y - 36, W - 160, 50);

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 14px -apple-system, sans-serif";
    ctx.fillText(r.item, 100, y - 6);
    ctx.fillStyle = "#64748B";
    ctx.font = "normal 12px -apple-system, sans-serif";
    ctx.fillText(r.spec, 460, y - 6);
    ctx.fillStyle = "#0F172A";
    ctx.fillText(r.qty, 780, y - 6);
    ctx.textAlign = "right";
    ctx.fillStyle = r.amt === "FREE" ? "#16A34A" : "#0F172A";
    ctx.font = "bold 14px -apple-system, sans-serif";
    ctx.fillText(r.amt, W - 100, y - 6);
    ctx.textAlign = "left";
  });

  const bY = y + 40;
  drawRoundRect(ctx, 80, bY, 480, 150, 12);
  ctx.fillStyle = "#FAF5FF";
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#7E22CE";
  ctx.font = "bold 11px -apple-system, sans-serif";
  ctx.fillText("PAYMENT CONFIRMATION", 100, bY + 28);
  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText(`Method: ${inv.paymentMethod === "card" ? "Credit/Debit Card (Stripe)" : inv.paymentMethod}`, 100, bY + 54);
  ctx.fillStyle = "#475569";
  ctx.font = "normal 12px -apple-system, sans-serif";
  ctx.fillText(`Reference: STRIPE-TX-${inv.orderId.replace(/[^A-Za-z0-9]/g, "").slice(-8).toUpperCase()}`, 100, bY + 78);
  ctx.fillText("Transaction encrypted via TLS 1.3.", 100, bY + 102);

  const tX = W - 500;
  drawRoundRect(ctx, tX, bY, 420, 150, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.stroke();

  const subt = `$${(inv.subtotal ?? inv.totalAmount).toFixed(2)}`;
  const deliv = (inv.deliveryFee ?? 0) === 0 ? "FREE" : `$${(inv.deliveryFee ?? 0).toFixed(2)}`;

  ctx.fillStyle = "#64748B";
  ctx.font = "normal 13px -apple-system, sans-serif";
  ctx.fillText("Subtotal:", tX + 24, bY + 32);
  ctx.textAlign = "right";
  ctx.fillStyle = "#0F172A";
  ctx.fillText(subt, tX + 396, bY + 32);
  ctx.textAlign = "left";

  ctx.fillStyle = "#64748B";
  ctx.fillText("Delivery:", tX + 24, bY + 60);
  ctx.textAlign = "right";
  ctx.fillStyle = deliv === "FREE" ? "#16A34A" : "#0F172A";
  ctx.font = "bold 13px -apple-system, sans-serif";
  ctx.fillText(deliv, tX + 396, bY + 60);
  ctx.textAlign = "left";

  ctx.strokeStyle = "#CBD5E1";
  ctx.beginPath();
  ctx.moveTo(tX + 24, bY + 80);
  ctx.lineTo(tX + 396, bY + 80);
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 16px -apple-system, sans-serif";
  ctx.fillText("TOTAL PAID:", tX + 24, bY + 115);
  ctx.textAlign = "right";
  ctx.fillStyle = "#EC4899";
  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.fillText(`$${inv.totalAmount.toFixed(2)}`, tX + 396, bY + 116);
  ctx.textAlign = "left";
}

export async function renderInvoiceToCanvas(inv: InvoiceData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const W = 1180;
  const H = 860;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 40, 40, W - 80, H - 80, 16);
  ctx.stroke();

  const logo = await loadLogoImage("/brand/logo-badge.jpg") || await loadLogoImage("/brand/logo.jpg");
  drawHeaderAndMeta(ctx, W, logo, inv);
  drawTableAndTotals(ctx, W, inv);

  ctx.strokeStyle = "#E2E8F0";
  ctx.strokeRect(40, H - 65, W - 80, 1);
  ctx.fillStyle = "#64748B";
  ctx.font = "normal 11px -apple-system, sans-serif";
  ctx.fillText("Thank you for choosing Laundry Express! Support: (800) 555-WASH • support@laundryexpress.com", 80, H - 38);
  ctx.textAlign = "right";
  ctx.fillText("Official Computer-Generated Tax Invoice & Electronic Receipt", W - 80, H - 38);
  ctx.textAlign = "left";

  return canvas;
}

export async function downloadInvoiceAsImage(inv: InvoiceData, filename?: string): Promise<void> {
  const canvas = await renderInvoiceToCanvas(inv);
  await triggerCanvasDownload(canvas, filename || `LaundryExpress-Invoice-${inv.orderId}.png`);
}
