"use client";

import { jsPDF } from "jspdf";
import { renderInvoiceToCanvas } from "./canvas-invoice-generator";
import type { InvoiceData } from "@/components/booking/order-invoice-modal";

/**
 * Generates an official, print-ready A4 Portrait PDF tax invoice.
 * Fills the complete vertical page with crisp typography and brand aesthetics.
 */
export async function generateInvoicePdfBlob(invoice: InvoiceData): Promise<Blob> {
  const canvas = await renderInvoiceToCanvas(invoice);
  const imgData = canvas.toDataURL("image/jpeg", 0.96);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Full-bleed A4 portrait placement matching the 1200x1697 canvas ratio
  pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight, undefined, "FAST");

  pdf.setProperties({
    title: `Laundry Express Official Invoice #${invoice.orderId}`,
    subject: "Tax Invoice & Electronic Payment Receipt",
    author: "Laundry Express",
    keywords: "laundry express, wash and fold, invoice, receipt, stripe",
    creator: "Laundry Express Fulfillment Platform",
  });

  return pdf.output("blob");
}

export async function downloadInvoiceAsPdf(invoice: InvoiceData, filename?: string): Promise<void> {
  const pdfBlob = await generateInvoicePdfBlob(invoice);
  const url = URL.createObjectURL(pdfBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename || `LaundryExpress-Invoice-${invoice.orderId}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
