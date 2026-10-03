import { createTransport, getMailAddresses } from "./email-service";

export interface CancellationEmailPayload {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  pickupDate: string;
  pickupSlot: string;
  deliveryDate?: string;
  planName: string;
  address: string;
  totalAmount: number;
  paymentStatus: string;
  paymentMethod: string;
  reason?: string;
  notes?: string;
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

function usd(amount: number): string {
  return `$${Number(amount || 0).toFixed(2)}`;
}

/**
 * Sends order cancellation notification to customer and CCs the admin.
 */
export async function sendOrderCancellationEmail(payload: CancellationEmailPayload): Promise<void> {
  if (!payload.customerEmail) return;

  const { from, admin } = getMailAddresses();
  const transport = createTransport();

  const safe = {
    orderNumber: escapeHtml(payload.orderNumber),
    customerName: escapeHtml(payload.customerName),
    customerEmail: escapeHtml(payload.customerEmail),
    pickupDate: escapeHtml(payload.pickupDate),
    pickupSlot: escapeHtml(payload.pickupSlot),
    planName: escapeHtml(payload.planName || "Wash & Fold"),
    address: escapeHtml(payload.address),
    reason: payload.reason ? escapeHtml(payload.reason) : "Operational Cancellation",
    notes: payload.notes ? escapeHtml(payload.notes) : "",
    paymentStatus: escapeHtml(payload.paymentStatus || "pending"),
    paymentMethod: escapeHtml(payload.paymentMethod || "standard"),
  };

  const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;max-width:580px;margin:auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:18px;overflow:hidden">
      <!-- Top Brand Red Accent Bar -->
      <div style="height:6px;background:linear-gradient(90deg,#e11d48 0%,#f43f5e 100%)"></div>

      <div style="padding:28px 24px">
        <!-- Brand Header -->
        <table style="width:100%;margin-bottom:20px;border-collapse:collapse">
          <tr>
            <td style="vertical-align:middle">
              <h1 style="font-size:22px;font-weight:900;color:#0f172a;margin:0;letter-spacing:-0.5px">
                LAUNDRY <span style="color:#e11d48">EXPRESS</span>
              </h1>
              <p style="color:#e11d48;font-size:11px;font-weight:700;margin:4px 0 0;text-transform:uppercase;letter-spacing:1px">
                Order Cancellation Notice
              </p>
            </td>
            <td style="text-align:right;vertical-align:middle">
              <span style="display:inline-block;background:#fff1f2;border:1px solid #fecdd3;color:#be123c;font-size:11px;font-weight:800;padding:6px 14px;border-radius:20px">
                CANCELLED
              </span>
              <p style="margin:4px 0 0;color:#94a3b8;font-size:11px;font-family:monospace;font-weight:700">
                ${safe.orderNumber}
              </p>
            </td>
          </tr>
        </table>

        <!-- Notice Box -->
        <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:14px;padding:16px;margin-bottom:18px">
          <p style="margin:0 0 6px;color:#9f1239;font-size:13px;font-weight:800">
            Order #${safe.orderNumber} has been cancelled
          </p>
          <p style="margin:0;color:#881337;font-size:12px;line-height:1.5">
            Hello ${safe.customerName}, your scheduled doorstep laundry pickup has been cancelled. Our drivers will not arrive for pickup at this window.
          </p>
        </div>

        <!-- Cancellation Details Card -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:16px;margin-bottom:18px">
          <p style="font-weight:800;color:#e11d48;margin:0 0 10px;font-size:11px;text-transform:uppercase;letter-spacing:0.5px">
            Cancellation Details
          </p>
          <table style="width:100%;font-size:12px;border-collapse:collapse">
            <tr><td style="color:#64748b;padding:5px 0">Reason</td><td style="text-align:right;color:#0f172a;font-weight:700">${safe.reason}</td></tr>
            ${safe.notes ? `<tr><td style="color:#64748b;padding:5px 0">Staff Notes</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.notes}</td></tr>` : ""}
            <tr><td style="color:#64748b;padding:5px 0">Original Pickup</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.pickupDate} (${safe.pickupSlot})</td></tr>
            <tr><td style="color:#64748b;padding:5px 0">Address</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.address}</td></tr>
            <tr><td style="color:#64748b;padding:5px 0">Service Plan</td><td style="text-align:right;color:#0f172a;font-weight:600">${safe.planName}</td></tr>
            <tr><td style="color:#64748b;padding:5px 0">Order Total</td><td style="text-align:right;color:#0f172a;font-weight:800">${usd(payload.totalAmount)}</td></tr>
            <tr><td style="color:#64748b;padding:5px 0">Payment Status</td><td style="text-align:right;color:#be123c;font-weight:800;text-transform:uppercase">${safe.paymentStatus}</td></tr>
          </table>
        </div>

        <!-- Support Info -->
        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:14px;margin-bottom:20px">
          <p style="margin:0;font-size:11px;color:#166534;line-height:1.5">
            <strong>Need assistance or wish to re-book?</strong> You can create a new pickup window anytime through your account dashboard or contact operations directly at <strong>(815) 575-9536</strong>.
          </p>
        </div>

        <!-- Footer -->
        <div style="border-top:1px solid #e2e8f0;padding-top:16px;text-align:center">
          <p style="color:#64748b;font-size:11px;margin:0 0 4px">
            Laundry Express Customer Operations &middot; <a href="mailto:customerservice@laundryexpressservices.com" style="color:#e11d48;text-decoration:none">customerservice@laundryexpressservices.com</a>
          </p>
          <p style="color:#94a3b8;font-size:10px;margin:0">
            Official System Notification &middot; laundryexpressservices.com
          </p>
        </div>
      </div>
    </div>
  `;

  await transport.sendMail({
    from,
    to: payload.customerEmail,
    cc: admin,
    subject: `Order Cancelled — ${payload.orderNumber.replace(/[\r\n]/g, " ")} | Laundry Express`,
    html,
  });
}
