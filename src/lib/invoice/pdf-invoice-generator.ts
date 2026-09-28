"use client";

import { jsPDF } from "jspdf";
import { renderInvoiceToCanvas } from "./canvas-invoice-generator";
import type { InvoiceData } from "@/components/booking/order-invoice-modal";

export async function generateInvoicePdfBlob(invoice: InvoiceData): Promise<Blob> {
  const canvas = await renderInvoiceToCanvas(invoice);
  const imgData = canvas.toDataURL("image/jpeg", 0.96);

  // Standard A4 dimensions in points: 595.28 x 841.89
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const renderedHeight = (canvas.height * pageWidth) / canvas.width;

  // Add high-resolution image to PDF page
  pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, Math.min(renderedHeight, pageHeight));

  // Set document metadata for professional PDF properties
  pdf.setProperties({
    title: `Laundry Express Invoice #${invoice.orderId}`,
    subject: "Official Tax Invoice & Receipt",
    author: "Laundry Express LLC",
    keywords: "laundry, wash and fold, invoice, receipt, stripe",
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
