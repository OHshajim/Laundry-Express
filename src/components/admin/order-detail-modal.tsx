"use client";

import * as React from "react";
import Image from "next/image";
import {
  User, Phone, Mail, MapPin, Sparkles, CreditCard, Camera, AlertTriangle, CheckCircle2, Calendar,
} from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface OrderDetailModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateStatus?: (orderId: string, newStatus: OrderStatus) => void;
  onOpenProofModal?: (order: Order, type: "pickup" | "dropoff" | "damage") => void;
  allOrders?: Order[];
}

export function OrderDetailModal({
  order,
  isOpen,
  onClose,
  onUpdateStatus,
  onOpenProofModal,
  allOrders = [],
}: OrderDetailModalProps) {
  if (!order) return null;

  const statusMeta = ORDER_STATUSES[order.order_status] || ORDER_STATUSES.pending;
  const detergentName = order.detergent_id === "det-tide-pods"
    ? "Tide Original Power Pods"
    : order.detergent_id === "det-eco-plant"
    ? "Seventh Generation Eco-Plant"
    : "All Free & Clear (Hypoallergenic)";

  const userPastOrders = allOrders.filter(
    (o) => o.user?.email === order.user?.email || (order.user_id && o.user_id === order.user_id)
  );
  const prevOrdersCount = userPastOrders.filter((o) => o.id !== order.id).length;
  const lifetimeSpent = userPastOrders.reduce((sum, o) => sum + o.total_amount, 0) || order.total_amount;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
      title={`Order Inspection: ${order.order_number}`}
      description={`Created on ${formatDate(order.created_at)} • Live operations audit`}
      className="max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6 text-xs text-slate-700">
        {/* Top Status & Overview Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-500 uppercase text-[10px]">Status:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusMeta.color}`}>
              {statusMeta.label}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Calendar className="h-3.5 w-3.5 text-sky-600 shrink-0" />
            <span>Pickup: <strong>{order.pickup_date}</strong> ({order.pickup_slot})</span>
          </div>
        </div>

        {/* 2-Column Primary Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Customer Contact & Delivery Presence */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <User className="h-4 w-4 text-sky-600 shrink-0" />
                <span>Customer &amp; Presence Verification</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-primary">
                {prevOrdersCount > 0 ? "Repeat Customer" : "New Customer"}
              </span>
            </div>

            <div className="space-y-1.5 leading-relaxed">
              <p className="font-extrabold text-sm text-slate-900">{order.user?.full_name || "Customer"}</p>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a href={`mailto:${order.user?.email}`} className="text-sky-600 hover:underline">
                  {order.user?.email || "No email"}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <a href={`tel:${order.user?.phone || "815-575-9536"}`} className="text-slate-800 font-semibold hover:text-sky-600">
                  {order.user?.phone || "+1 (815) 575-9536"}
                </a>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                <span>{order.user?.address || "United States, IL · McHenry Co. · Lake in the Hills"}</span>
              </div>
            </div>

            {/* User History Preview & Previous Total Orders */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Previous Orders</span>
                <span className="font-extrabold text-slate-900">{prevOrdersCount} previous order{prevOrdersCount !== 1 ? "s" : ""}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Customer Lifetime Value</span>
                <span className="font-extrabold text-emerald-600">{formatCurrency(lifetimeSpent)}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-1">
              <span className="font-bold text-slate-700 block">Presence:</span>
              <div className={`p-2 rounded-xl border font-medium ${
                order.is_out_of_home ? "bg-amber-50 border-amber-200 text-amber-900" : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}>
                {order.is_out_of_home ? "Bag placed outside door (Away)" : "Hand-to-Hand (Customer is Home)"}
              </div>
              {order.customer_notes && (
                <p className="text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                  &ldquo;{order.customer_notes}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Card 2: Laundry Wash Configuration & Financials */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 font-bold text-slate-900 border-b border-slate-100 pb-2">
              <Sparkles className="h-4 w-4 text-amber-500 shrink-0" />
              <span>Wash Specs &amp; Stripe Billing</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Service Plan:</span>
                <span className="font-bold text-slate-900 uppercase">
                  {order.pricing_mode === "per_bag" ? "By Bag" : order.pricing_mode === "per_kg" ? "By Weight (KG)" : "Package"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Volume:</span>
                <span className="font-extrabold text-slate-900">
                  {order.pricing_mode === "per_bag"
                    ? `${order.bag_count} Bags`
                    : order.final_weight_kg ? `${order.final_weight_kg} KG (Scale Final)` : `${order.estimated_weight_kg || 5} KG (Est.)`}
                </span>
              </div>
              <div className="flex justify-between items-start gap-2">
                <span className="text-slate-500 shrink-0">Detergent:</span>
                <span className="font-semibold text-slate-800 text-right truncate">{detergentName}</span>
              </div>

              {/* Financial Breakdown */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal: {formatCurrency(order.subtotal)}</span>
                  <span>Delivery: {order.delivery_fee === 0 ? "FREE ($0.00)" : formatCurrency(order.delivery_fee)}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-slate-900 pt-1 border-t border-slate-100">
                  <span>Total Paid:</span>
                  <span className="text-primary">{formatCurrency(order.total_amount)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold pt-1">
                  <CreditCard className="h-3.5 w-3.5 shrink-0" />
                  <span>Stripe Upfront Payment Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Photo Proofs & Pre-wash Damage Audit */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 font-bold text-slate-900">
              <Camera className="h-4 w-4 text-sky-600 shrink-0" />
              <span>Photo Proof Gallery &amp; Pre-wash Damage Audit</span>
            </div>
            <span className="text-[10px] text-slate-400">Total Proofs: {order.proofs?.length || 0}</span>
          </div>

          {order.has_preexisting_damage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0" />
                <span>Pre-Existing Garment Flaw Documented</span>
              </div>
              <p className="text-[11px] text-rose-800">
                Notes: {order.damage_notes || "Inspector documented flaw. Customer notified via email."}
              </p>
            </div>
          )}

          {(!order.proofs || order.proofs.length === 0) ? (
            <p className="text-slate-400 italic text-center py-2">No photo proofs uploaded yet for this order.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {order.proofs.map((proof, idx) => (
                <div key={proof.id || idx} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 space-y-1 pb-1">
                  <div className="relative h-20 w-full bg-slate-100">
                    <Image src={proof.image_url} alt="Order Proof" fill sizes="160px" className="object-cover" />
                  </div>
                  <div className="px-2">
                    <span className="font-extrabold uppercase text-[9px] block text-sky-700">
                      {proof.proof_type === "damage" ? "Pre-wash Damage" : `${proof.proof_type} Proof`}
                    </span>
                    <span className="text-[9px] text-slate-400 block truncate">{formatDate(proof.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Action Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Inspection
          </Button>

          <div className="flex items-center gap-2">
            {onOpenProofModal && order.order_status === "in_wash" && (
              <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => { onClose(); onOpenProofModal(order, "damage"); }}>
                <AlertTriangle className="h-3.5 w-3.5 mr-1 shrink-0" />
                Report Damage
              </Button>
            )}

            {onUpdateStatus && order.order_status === "confirmed" && (
              <Button variant="hero" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => { onUpdateStatus(order.id, "driver_assigned"); onClose(); }}>
                <CheckCircle2 className="h-3.5 w-3.5 mr-1 shrink-0" />
                Accept Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
}

export default OrderDetailModal;
