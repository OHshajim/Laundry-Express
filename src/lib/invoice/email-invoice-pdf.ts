import { jsPDF } from "jspdf";
import type { InvoiceEmailPayload } from "@/lib/services/email-service";

export function createEmailInvoicePdf(invoice: InvoiceEmailPayload): Buffer {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 18;
  let y = 20;

  pdf.setTextColor(190, 24, 93);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.text("LAUNDRY EXPRESS", margin, y);
  y += 8;
  pdf.setTextColor(15, 23, 42);
  pdf.setFontSize(13);
  pdf.text("PAID ORDER INVOICE", margin, y);
  y += 9;

  const rows: Array<[string, string]> = [
    ["Order number", invoice.orderNumber],
    ["Order date", invoice.orderDate],
    ["Customer", invoice.customerName],
    ["Email", invoice.customerEmail],
    ["Pickup address", invoice.address],
    ["Pickup date and time", `${invoice.pickupDate} (${invoice.pickupSlot})`],
    ["Delivery date", invoice.deliveryDate],
    ["Plan", invoice.planName],
    ["Quantity", invoice.quantity],
    ["Detergent and care", `${invoice.detergent} - Gentle Cold Wash Care`],
    ["Payment method", invoice.paymentMethod],
  ];

  pdf.setDrawColor(226, 232, 240);
  pdf.setLineWidth(0.3);
  pdf.line(margin, y, pageWidth - margin, y);
  y += 7;
  pdf.setFontSize(10);
  for (const [label, value] of rows) {
    const valueLines = pdf.splitTextToSize(value || "N/A", 112);
    const rowHeight = Math.max(7, valueLines.length * 5);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(71, 85, 105);
    pdf.text(label, margin, y);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(15, 23, 42);
    pdf.text(valueLines, margin + 55, y);
    y += rowHeight;
  }

  y += 2;
  pdf.line(margin, y, pageWidth - margin, y);
  y += 8;
  const totals: Array<[string, string]> = [
    ["Subtotal", `$${invoice.subtotal.toFixed(2)}`],
    ["Delivery", invoice.deliveryFee === 0 ? "FREE" : `$${invoice.deliveryFee.toFixed(2)}`],
  ];
  if (invoice.discountAmount > 0) {
    totals.push(["Discount", `-$${invoice.discountAmount.toFixed(2)}`]);
  }
  totals.push(["TOTAL PAID", `$${invoice.totalAmount.toFixed(2)}`]);

  for (const [label, value] of totals) {
    const isTotal = label === "TOTAL PAID";
    pdf.setFont("helvetica", isTotal ? "bold" : "normal");
    pdf.setFontSize(isTotal ? 13 : 10);
    pdf.setTextColor(isTotal ? 190 : 71, isTotal ? 24 : 85, isTotal ? 93 : 105);
    pdf.text(label, margin, y);
    pdf.text(value, pageWidth - margin, y, { align: "right" });
    y += isTotal ? 9 : 7;
  }

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text("Thank you for choosing Laundry Express.", margin, Math.min(y + 10, 275));

  const arrayBuffer = pdf.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
