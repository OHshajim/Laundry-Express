"use client";

import * as React from "react";
import { AlertTriangle, Copy, Check, XCircle, Loader2, CreditCard, ShieldAlert } from "lucide-react";
import type { Order } from "@/types";
import { Dialog, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";

const CANCEL_REASONS = [
  "Customer requested cancellation",
  "Customer unreachable at scheduled pickup window",
  "Address outside verified delivery zone",
  "Operational capacity reached / Driver unavailable",
  "Ineligible garments or hazardous items flagged",
  "Suspected fraudulent transaction or charge issue",
  "Inclement weather or route closure",
  "Other operational exception",
];

export interface OrderCancelModalProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: (reason: string, notes: string) => Promise<boolean>;
  disabled?: boolean;
}

export function OrderCancelModal({
  order,
  isOpen,
  onClose,
  onConfirmCancel,
  disabled = false,
}: OrderCancelModalProps) {
  const [reason, setReason] = React.useState(CANCEL_REASONS[0]);
  const [notes, setNotes] = React.useState("");
  const [confirmed, setConfirmed] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [copiedTx, setCopiedTx] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setReason(CANCEL_REASONS[0]);
      setNotes("");
      setConfirmed(false);
      setErrorMessage("");
      setCopiedTx(false);
    }
  }, [isOpen]);

  const handleCopyTx = async () => {
    if (!order.stripe_payment_intent) return;
    try {
      await navigator.clipboard.writeText(order.stripe_payment_intent);
      setCopiedTx(true);
      setTimeout(() => setCopiedTx(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleExecuteCancel = async () => {
    if (!confirmed) return;
    setIsSubmitting(true);
    setErrorMessage("");
    try {
      const success = await onConfirmCancel(reason, notes.trim());
      if (success) {
        onClose();
      } else {
        setErrorMessage("Unable to cancel order. Please review your network connection and try again.");
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "An unexpected error occurred while cancelling.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isPaid = order.payment_status === "paid";
  const customerName = order.customer_name || order.user?.full_name || "Valued Customer";
  const customerContact = order.customer_phone || order.customer_email || "No contact recorded";

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      title={`Cancel Order #${order.order_number}`}
      description={`Customer: ${customerName} • Placed ${formatDate(order.created_at)}`}
      size="lg"
    >
      <div className="space-y-4 text-xs text-slate-700">
        {/* Warning Banner */}
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-900">
          <ShieldAlert className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-extrabold text-xs block text-rose-950">Irreversible Operations Action</span>
            <p className="text-[11px] text-rose-800 leading-relaxed">
              Cancelling stops laundry processing and withdraws this order from the driver dispatch queue.
            </p>
          </div>
        </div>

        {/* Snapshot Summary Card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
            Order &amp; Payment Snapshot
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Customer</span>
              <p className="font-bold text-slate-900 truncate">{customerName}</p>
              <p className="text-[11px] text-slate-500 truncate">{customerContact}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Pickup Window</span>
              <p className="font-bold text-slate-900">{order.pickup_date}</p>
              <p className="text-[11px] text-slate-500">{order.pickup_slot}</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Billing Status</span>
              <p className="font-black text-slate-900 text-sm text-primary">{formatCurrency(order.total_amount)}</p>
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isPaid ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
              }`}>
                {isPaid ? "Paid in Full" : `Payment ${order.payment_status || "Pending"}`}
              </span>
            </div>
          </div>

          {/* Stripe Transaction ID Section */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <CreditCard className="h-3.5 w-3.5 text-slate-400" />
              <span>Stripe Tx ID:</span>
              <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 select-all">
                {order.stripe_payment_intent || "No Stripe ID (Direct/Manual)"}
              </span>
            </div>
            {order.stripe_payment_intent && (
              <button
                type="button"
                onClick={handleCopyTx}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-800 cursor-pointer"
              >
                {copiedTx ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedTx ? "Copied" : "Copy ID"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Cancellation Reason Dropdown */}
        <div className="space-y-1.5">
          <label htmlFor="cancel-reason" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Primary Cancellation Reason *
          </label>
          <select
            id="cancel-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isSubmitting}
            className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs text-slate-900 font-medium focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 cursor-pointer"
          >
            {CANCEL_REASONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Admin Notes */}
        <div className="space-y-1.5">
          <label htmlFor="cancel-notes" className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
            Internal Operations Memo (Optional)
          </label>
          <textarea
            id="cancel-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            disabled={isSubmitting}
            placeholder="Add internal context (e.g., customer agreed on phone, refund details, supervisor sign-off)..."
            rows={2}
            className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 resize-none"
          />
        </div>

        {/* Refund Policy Callout */}
        <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span>Stripe Refund Workflow Notice</span>
          </div>
          <p className="text-amber-800 leading-relaxed">
            Cancelling this order updates the system record immediately. Automated refunds are <strong>not issued automatically</strong> by this action. If a refund is required, locate transaction <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px] select-all">{order.stripe_payment_intent || order.order_number}</code> in the Stripe Dashboard to process funds.
          </p>
        </div>

        {/* Safety Confirmation Checkbox */}
        <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100/70 transition-colors">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
          />
          <span className="text-[11px] text-slate-700 font-semibold select-none leading-snug">
            I confirm that I want to cancel order <strong>#{order.order_number}</strong> and halt fulfillment.
          </span>
        </label>

        {errorMessage && (
          <p role="alert" className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium">
            {errorMessage}
          </p>
        )}

        <DialogFooter className="mt-4 pt-3">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting} className="w-full sm:w-auto">
            Keep Order Active
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={!confirmed || isSubmitting || disabled}
            onClick={() => { void handleExecuteCancel(); }}
            className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-bold"
          >
            {isSubmitting ? <><Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />Cancelling...</> : <><XCircle className="h-3.5 w-3.5 mr-1.5" />Confirm &amp; Cancel Order</>}
          </Button>
        </DialogFooter>
      </div>
    </Dialog>
  );
}
