import nodemailer from "nodemailer";

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
  const label = purpose === "change_password" ? "Change Password" : "Reset Password";
  const transport = createTransport();
  await transport.sendMail({
    from: FROM,
    to,
    subject: `Your Laundry Express Verification Code — ${otp}`,
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

export async function sendInvoiceEmail(payload: InvoiceEmailPayload): Promise<void> {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:auto;background:#f8fafc;padding:32px 24px;border-radius:16px">
      <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0 0 4px">LAUNDRY EXPRESS</h1>
      <p style="color:#64748b;font-size:12px;margin:0 0 24px">Premium 24-Hour Wash &amp; Fold &middot; Order Confirmation</p>

      <div style="background:#10b981;border-radius:10px;padding:14px 18px;color:#fff;margin-bottom:20px">
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;opacity:.8">Confirmed &amp; Paid</div>
        <div style="font-size:20px;font-weight:900;font-family:monospace;letter-spacing:1px">${payload.orderNumber}</div>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px">
        <p style="font-weight:700;color:#0f172a;margin:0 0 12px;font-size:13px">Customer Details</p>
        <p style="margin:2px 0;font-size:12px;color:#334155"><b>${payload.customerName}</b></p>
        <p style="margin:2px 0;font-size:12px;color:#64748b">${payload.customerEmail}</p>
        <p style="margin:2px 0;font-size:12px;color:#64748b">${payload.address}</p>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:16px">
        <p style="font-weight:700;color:#0f172a;margin:0 0 12px;font-size:13px">Order Details</p>
        <table style="width:100%;font-size:12px;border-collapse:collapse">
          <tr><td style="color:#64748b;padding:3px 0">Plan</td><td style="text-align:right;color:#0f172a;font-weight:700">${payload.planName}</td></tr>
          <tr><td style="color:#64748b;padding:3px 0">Quantity</td><td style="text-align:right;color:#0f172a;font-weight:700">${payload.quantity}</td></tr>
          <tr><td style="color:#64748b;padding:3px 0">Detergent</td><td style="text-align:right;color:#0f172a;font-weight:700">${payload.detergent}</td></tr>
          <tr><td style="color:#64748b;padding:3px 0">Pickup</td><td style="text-align:right;color:#0f172a;font-weight:700">${payload.pickupDate} (${payload.pickupSlot})</td></tr>
          <tr><td style="color:#64748b;padding:3px 0">Est. Return</td><td style="text-align:right;color:#0f172a;font-weight:700">${payload.deliveryDate}</td></tr>
        </table>
      </div>

      <div style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px">
        <p style="font-weight:700;color:#0f172a;margin:0 0 12px;font-size:13px">Payment Summary</p>
        <table style="width:100%;font-size:12px;border-collapse:collapse">
          <tr><td style="color:#64748b;padding:3px 0">Subtotal</td><td style="text-align:right;color:#334155">${usd(payload.subtotal)}</td></tr>
          <tr><td style="color:#64748b;padding:3px 0">Delivery Fee</td><td style="text-align:right;color:#334155">${usd(payload.deliveryFee)}</td></tr>
          ${payload.discountAmount > 0 ? `<tr><td style="color:#10b981;padding:3px 0">Discount Applied</td><td style="text-align:right;color:#10b981">-${usd(payload.discountAmount)}</td></tr>` : ""}
          <tr style="border-top:2px solid #f1f5f9"><td style="color:#0f172a;font-weight:900;padding:8px 0 0">Total Charged</td><td style="text-align:right;color:#0f172a;font-weight:900;font-size:15px">${usd(payload.totalAmount)}</td></tr>
        </table>
      </div>

      <p style="color:#94a3b8;font-size:11px;text-align:center;margin:0">Questions? Reply to this email &middot; laundryexpress.com</p>
    </div>
  `;

  const transport = createTransport();
  const [userResult, adminResult] = await Promise.allSettled([
    transport.sendMail({ from: FROM, to: payload.customerEmail, subject: `Order Confirmed — ${payload.orderNumber} | Laundry Express`, html }),
    transport.sendMail({ from: FROM, to: ADMIN_EMAIL, subject: `New Order — ${payload.orderNumber} | ${payload.customerName}`, html }),
  ]);

  const errors: string[] = [];
  if (userResult.status === "rejected") errors.push(`User email: ${userResult.reason}`);
  if (adminResult.status === "rejected") errors.push(`Admin email: ${adminResult.reason}`);
  if (errors.length === 2) throw new Error(errors.join("; "));
}
