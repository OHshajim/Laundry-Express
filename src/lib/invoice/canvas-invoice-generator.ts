"use client";

import type { InvoiceData } from "@/components/booking/order-invoice-modal";
import { loadLogoImage, drawRoundRect, triggerCanvasDownload } from "./canvas-helpers";
import { drawPortraitHeader, drawPortraitMetaAndCards } from "./canvas-invoice-sections";
import { drawPortraitTable, drawPortraitTotals, drawPortraitFooterNotes } from "./canvas-invoice-body";

/**
 * Standard A4 Portrait Invoice Dimensions (High-DPI 1:1.4142 ratio)
 * Width: 1200px, Height: 1697px
 * Fully utilizes the standard vertical A4 page without compression or squishing.
 */
export async function renderInvoiceToCanvas(inv: InvoiceData): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  const W = 1200;
  const H = 1697;
  canvas.width = W;
  canvas.height = H;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get 2D canvas context");

  // Crisp White Background
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, W, H);

  // Outer Border Box
  ctx.strokeStyle = "#E2E8F0";
  ctx.lineWidth = 1.5;
  drawRoundRect(ctx, 24, 24, W - 48, H - 48, 16);
  ctx.stroke();

  // Load Badge Logo
  const logo = (await loadLogoImage("/brand/logo-badge.jpg")) || (await loadLogoImage("/brand/logo.jpg"));

  // 1. Header (Brand banner, logo, company contact info)
  drawPortraitHeader(ctx, W, logo);

  // 2. Metadata & Cards (Billed to card & Schedule card)
  drawPortraitMetaAndCards(ctx, W, inv);

  // 3. Itemized Services Table
  const tableBottomY = drawPortraitTable(ctx, W, inv);

  // 4. Payment Confirmation & Financial Totals
  const totalsBottomY = drawPortraitTotals(ctx, W, inv, tableBottomY);

  // 5. Guarantee Banner, Care Policy Notes & Footer
  drawPortraitFooterNotes(ctx, W, H, totalsBottomY);

  return canvas;
}

export async function downloadInvoiceAsImage(inv: InvoiceData, filename?: string): Promise<void> {
  const canvas = await renderInvoiceToCanvas(inv);
  await triggerCanvasDownload(canvas, filename || `LaundryExpress-Invoice-${inv.orderId}.png`);
}
