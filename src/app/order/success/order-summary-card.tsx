"use client";

import type { Order } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryCardProps {
  order: Order;
  orderId: string;
  paid: boolean;
  customerName: string;
  customerEmail: string;
  fullAddress: string;
  slotLabel: string;
}

export function OrderSummaryCard({
  order,
  orderId,
  paid,
  customerName,
  customerEmail,
  fullAddress,
  slotLabel,
}: OrderSummaryCardProps) {
  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs text-left space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Official Order</span>
          <span className="font-mono font-black text-sm text-slate-900">{order.order_number || orderId}</span>
        </div>
        <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          {paid ? "✔ Paid via Stripe" : "Processing"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Customer Details</span>
          <p className="font-bold text-slate-900">{customerName}</p>
          {customerEmail && <p className="text-slate-500">{customerEmail}</p>}
          {order.customer_phone && <p className="text-slate-500 font-medium">{order.customer_phone}</p>}
        </div>

        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase text-slate-400">Pickup Schedule</span>
          <p className="font-bold text-slate-900">{order.pickup_date || "Scheduled Date"}</p>
          <p className="text-slate-500">{slotLabel}</p>
        </div>

        <div className="space-y-1 sm:col-span-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Detergent Formulation</span>
          <p className="font-bold text-slate-900">
            {order.detergent_name || "Standard Hypoallergenic"} · <span className={Number(order.detergent_fee || 0) === 0 ? "text-emerald-700 font-semibold" : "text-amber-700 font-bold"}>
              {Number(order.detergent_fee || 0) === 0 ? "FREE (Included)" : `+${formatCurrency(Number(order.detergent_fee))}`}
            </span>
          </p>
        </div>
      </div>

      {order.stripe_payment_intent && (
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
          <span className="text-slate-400 font-bold uppercase">Stripe Tx ID</span>
          <span className="font-mono text-slate-700 select-all font-semibold">{order.stripe_payment_intent}</span>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <span className="font-bold text-slate-600">Total Amount Paid</span>
        <span className="text-lg font-black text-primary">{formatCurrency(order.total_amount || 32.5)}</span>
      </div>
    </div>
  );
}
