"use client";

import { drawRoundRect } from "./canvas-helpers";
import { APP_CONFIG } from "@/lib/constants";

/**
 * Renders the 100% Satisfaction Guarantee banner, Service Protocols,
 * and Official Tax Receipt disclaimer at the bottom of the invoice.
 */
export function drawPortraitFooterNotes(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  startY: number
) {
  const gY = startY + 22;
  const gW = W - 100;

  // 100% Satisfaction Guarantee Card
  drawRoundRect(ctx, 50, gY, gW, 82, 12);
  ctx.fillStyle = "#F0FDF4";
  ctx.fill();
  ctx.strokeStyle = "#BBF7D0";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = "#15803D";
  ctx.font = "bold 13px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("✔  100% CLEAN & FRESH SATISFACTION GUARANTEE", 72, gY + 28);

  ctx.fillStyle = "#166534";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    "Every order is individually washed in cold water with your chosen formula, gently dried, meticulously folded,",
    72,
    gY + 50
  );
  ctx.fillText(
    "and sealed in weather-safe protective packaging for secure doorstep return.",
    72,
    gY + 68
  );

  // Service Protocol Notes Card
  const tY = gY + 98;
  drawRoundRect(ctx, 50, tY, gW, 114, 12);
  ctx.fillStyle = "#F8FAFC";
  ctx.fill();
  ctx.strokeStyle = "#E2E8F0";
  ctx.stroke();

  ctx.fillStyle = "#0F172A";
  ctx.font = "bold 12px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText("SERVICE PROTOCOL & CARE POLICIES:", 72, tY + 28);

  const notes = [
    "• Fabric Care: Washed with eco-conscious cold water cycle (30°C) to preserve garment integrity and color vibrancy.",
    "• Driver Photo Verification: All doorstep pickups and deliveries are verified with GPS-stamped photo proofs in your portal.",
    `• Dedicated Support: For order updates or inquiries, contact (${APP_CONFIG.supportPhone}) or ${APP_CONFIG.supportEmail}.`,
  ];

  notes.forEach((nt, idx) => {
    ctx.fillStyle = "#475569";
    ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
    ctx.fillText(nt, 72, tY + 52 + idx * 21);
  });

  // Bottom Legal Divider & Receipt Verification
  ctx.strokeStyle = "#E2E8F0";
  ctx.beginPath();
  ctx.moveTo(50, H - 65);
  ctx.lineTo(W - 50, H - 65);
  ctx.stroke();

  ctx.fillStyle = "#64748B";
  ctx.font = "normal 11px -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.fillText(
    `Laundry Express • Support: ${APP_CONFIG.supportPhone} • ${APP_CONFIG.supportEmail} • www.laundryexpressservices.com`,
    50,
    H - 38
  );
  ctx.textAlign = "right";
  ctx.fillText(
    "Official Computer-Generated Tax Invoice & Electronic Receipt • Valid Without Signature",
    W - 50,
    H - 38
  );
  ctx.textAlign = "left";
}
