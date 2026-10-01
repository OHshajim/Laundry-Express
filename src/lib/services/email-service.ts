import nodemailer from "nodemailer";
import { createEmailInvoicePdf } from "@/lib/invoice/email-invoice-pdf";

// ---------------------------------------------------------------------------
// Transport — configure via env vars. Supports any SMTP provider:
//   Gmail: host=smtp.gmail.com, port=587, user=you@gmail.com, pass=app-password
//   Brevo: host=smtp-relay.brevo.com, port=587
//   Mailgun, SendGrid, etc. — all standard SMTP
// ---------------------------------------------------------------------------
function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER || "",
      pass: process.env.SMTP_PASS || "",
    },
  });
}

const FROM = process.env.EMAIL_FROM || "Laundry Express <noreply@laundryexpress.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@laundryexpress.com";

/** Send 6-digit OTP verification email */
export async function sendOtpEmail(to: string, otp: string, purpose: string): Promise<void> {
  const label = purpose === "change_password"
    ? "Change Password"
    : purpose === "register_email"
      ? "Email Verification"
      : "Reset Password";
  const transport = createTransport();
  await transport.sendMail({
    from: FROM,
    to,
    subject: "Your Laundry Express Verification Code",
    html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:480px;margin:auto;padding:32px 24px;background:#f8fafc;border-radius:16px">
        <h1 style="font-size:20px;font-weight:900;color:#0f172a;margin-bottom:4px">Laundry Express</h1>
        <p style="color:#64748b;font-size:13px;margin-bottom:24px">${label} Verification</p>
        <div style="background:#fff;border:2px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center">
          <p style="color:#64748b;font-size:13px;margin:0 0 8px">Your one-time verification code</p>
          <div style="font-size:36px;font-weight:900;letter-spacing:8px;color:#0f172a;font-family:monospace">${otp}</div>
          <p style="color:#94a3b8;font-size:11px;margin:12px 0 0">Expires in 10 minutes &middot; Do not share this code</p>
        </div>
        <p style="color:#94a3b8;font-size:11px;margin-top:20px;text-align:center">If you did not request this, ignore this email.</p>
      </div>
    `,
  });
}

export interface InvoiceEmailPayload {
  orderNumber: string;
  orderDate: string;
  paymentMethod: string;
  customerName: string;
  customerEmail: string;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate: string;
  planName: string;
  quantity: string;
  detergent: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  address: string;
}

function usd(n: number) {
  return `$${Number(n).toFixed(2)}`;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export async function sendInvoiceEmail(payload: InvoiceEmailPayload): Promise<void> {
  const safe = {
    ...payload,
    orderNumber: escapeHtml(payload.orderNumber),
    customerName: escapeHtml(payload.customerName),
    customerEmail: escapeHtml(payload.customerEmail),
    pickupDate: escapeHtml(payload.pickupDate),
    pickupSlot: escapeHtml(payload.pickupSlot),
    deliveryDate: escapeHtml(payload.deliveryDate),
    planName: escapeHtml(payload.planName),
    quantity: escapeHtml(payload.quantity),
    detergent: escapeHtml(payload.detergent),
    address: escapeHtml(payload.address),
  };
  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:580px;margin:auto;background:#ffffff;padding:0;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden">
      <!-- Top Brand Accent Bar -->
      <div style="height:6px;background:linear-gradient(90deg,#be185d 0%,#ec4899 100%)"></div>

      <div style="padding:28px 24px">
        <!-- Brand Header -->
        <table style="width:100%;margin-bottom:20px;border-collapse:collapse">
          <tr>
            <td style="vertical-align:middle">
              <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0;letter-spacing:-0.5px">
                LAUNDRY <span style="color:#be185d">EXPRESS</span>
              </h1>
              <p style="color:#be185d;font-size:11px;font-weight:700;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px">
                Premium 24-Hour Wash &amp; Fold
              </p>
              <p style="color:#64748b;font-size:11px;margin:2px 0 0">
                Laundry Express &middot; (815) 575-9536
              </p>
            </td>
            <td style="text-align:right;vertical-align:middle">
              <span style="display:inline-block;background:#ecfdf5;border:1px solid #a7f3d0;color:#047857;font-size:11px;font-weight:800;padding:6px 12px;border-radius:20px">
                ✔ PAID &amp; CONFIRMED
              </span>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:10px;font-family:monospace;font-weight:700">
                ${safe.orderNumber}
              </p>
            </td>
          </tr>
        </table>

        <!-- Logistics & Schedule Card -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:16px">
          <p style="font-weight:800;color:#be185d;margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Pickup &amp; Schedule Details</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr><td style="color:#64748b;padding:4px 0">Customer</td><td style="text-align:right;color:#0f172a;font-weight:700">${safe.customerName}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Email</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.customerEmail}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Order Date</td><td style="text-align:right;color:#0f172a;font-weight:600">${escapeHtml(payload.orderDate)}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Doorstep Address</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.address}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Pickup Window</td><td style="text-align:right;color:#0f172a;font-weight:700">${safe.pickupDate} (${safe.pickupSlot})</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Estimated Delivery</td><td style="text-align:right;color:#047857;font-weight:800">${safe.deliveryDate} (24hr Return)</td></tr>
          </table>
        </div>

        <!-- Service Breakdown Card -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:16px">
          <p style="font-weight:800;color:#be185d;margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Service Breakdown</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr><td style="color:#64748b;padding:4px 0">Selected Plan</td><td style="text-align:right;color:#0f172a;font-weight:700">${safe.planName}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Quantity</td><td style="text-align:right;color:#0f172a;font-weight:700">${safe.quantity}</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Formula &amp; Care</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.detergent} &bull; Gentle Cold Wash</td></tr>
            <tr><td style="color:#64748b;padding:4px 0">Payment Method</td><td style="text-align:right;color:#0f172a;font-weight:600">${escapeHtml(payload.paymentMethod)}</td></tr>
          </table>
        </div>

        <!-- Financial Summary -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:20px">
          <p style="font-weight:800;color:#be185d;margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">Payment Summary</p>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr><td style="color:#64748b;padding:4px 0">Subtotal</td><td style="text-align:right;color:#334155;font-weight:600">${usd(payload.subtotal)}</td></tr>
            <tr>
              <td style="color:#64748b;padding:4px 0">Doorstep Logistics (2-Way)</td>
              <td style="text-align:right;color:${payload.deliveryFee === 0 ? "#047857" : "#334155"};font-weight:${payload.deliveryFee === 0 ? "800" : "600"}">
                ${payload.deliveryFee === 0 ? "FREE ($0.00)" : usd(payload.deliveryFee)}
              </td>
            </tr>
            ${payload.discountAmount > 0 ? `<tr><td style="color:#047857;padding:4px 0">Promo Discount</td><td style="text-align:right;color:#047857;font-weight:700">-${usd(payload.discountAmount)}</td></tr>` : ""}
            <tr style="border-top:2px solid #e2e8f0">
              <td style="color:#0f172a;font-weight:900;padding:12px 0 0;font-size:14px">Total Cleared</td>
              <td style="text-align:right;color:#be185d;font-weight:900;font-size:18px;padding:12px 0 0">${usd(payload.totalAmount)}</td>
            </tr>
          </table>
        </div>

        <!-- Guarantee Note -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:12px 14px;margin-bottom:20px">
          <p style="margin:0;font-size:11px;color:#166534;line-height:1.5">
            <strong>100% Satisfaction Guarantee:</strong> Individually processed in cold water with your selected formula, dried gently, folded with care, and sealed for protected doorstep delivery.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #e2e8f0;padding-top:16px;text-align:center">
          <p style="color:#64748b;font-size:11px;margin:0 0 4px">
            Questions? Contact support at <strong>(815) 575-9536</strong> or reply to <strong>customerservice@laundryexpressservices.com</strong>
          </p>
          <p style="color:#94a3b8;font-size:10px;margin:0">
            Official Computer-Generated Tax Invoice &middot; Laundry Express &middot; laundryexpress.com
          </p>
        </div>
      </div>
    </div>
  `;

  const transport = createTransport();
  const invoicePdf = createEmailInvoicePdf(payload);
  const attachment = {
    filename: `LaundryExpress-Invoice-${payload.orderNumber.replace(/[^A-Za-z0-9-]/g, "")}.pdf`,
    content: invoicePdf,
    contentType: "application/pdf",
  };
  const [userResult, adminResult] = await Promise.allSettled([
    transport.sendMail({ from: FROM, to: payload.customerEmail, subject: `Order Confirmed — ${payload.orderNumber.replace(/[\r\n]/g, " ")} | Laundry Express`, html, attachments: [attachment] }),
    transport.sendMail({ from: FROM, to: ADMIN_EMAIL, subject: `New Order — ${payload.orderNumber.replace(/[\r\n]/g, " ")} | ${payload.customerName.replace(/[\r\n]/g, " ")}`, html, attachments: [attachment] }),
  ]);

  const errors: string[] = [];
  if (userResult.status === "rejected") errors.push(`User email: ${userResult.reason}`);
  if (adminResult.status === "rejected") errors.push(`Admin email: ${adminResult.reason}`);
  if (errors.length > 0) throw new Error(errors.join("; "));
}
