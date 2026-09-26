"use client";

import * as React from "react";
import { Camera, AlertTriangle, Check, Bell } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { OrderTableRow } from "./order-table-row";
import { OrderCard } from "./order-card";
import { OrderDetailModal } from "./order-detail-modal";

interface OrderPipelineProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateFinalWeight: (orderId: string, finalWeight: number) => void;
  onUploadProof: (orderId: string, proofType: "pickup" | "dropoff" | "damage", imageUrl: string, notes?: string) => void;
}

/**
 * OrderPipeline Component
 *
 * Implements the full operational workflow:
 * - Executive KPIs
 * - Step-by-step order actions (Accept, Pickup Proof, Wash Damage Report, Drop-off Delivery Proof)
 * - Customer notification alerts on order acceptance and garment damage
 */
export function OrderPipeline({
  orders,
  onUpdateStatus,
  onUpdateFinalWeight,
  onUploadProof,
}: OrderPipelineProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [detailOrderId, setDetailOrderId] = React.useState<string | null>(null);
  const [weightInput, setWeightInput] = React.useState<string>("");
  const [proofType, setProofType] = React.useState<"pickup" | "dropoff" | "damage">("pickup");
  const [damageNotes, setDamageNotes] = React.useState<string>("");
  const [proofModalOpen, setProofModalOpen] = React.useState<boolean>(false);
  const [systemAlert, setSystemAlert] = React.useState<string | null>(null);

  const detailOrder = React.useMemo(
    () => orders.find((o) => o.id === detailOrderId) || null,
    [orders, detailOrderId]
  );

  const triggerAlert = (msg: string) => {
    setSystemAlert(msg);
    setTimeout(() => setSystemAlert(null), 4000);
  };

  const handleStatusChangeWithNotification = (orderId: string, newStatus: OrderStatus) => {
    onUpdateStatus(orderId, newStatus);
    const ord = orders.find((o) => o.id === orderId);
    if (newStatus === "driver_assigned") {
      triggerAlert(`Order ${ord?.order_number || ""} accepted! Automated pickup window email dispatched to customer.`);
    } else if (newStatus === "out_for_delivery") {
      triggerAlert(`Order ${ord?.order_number || ""} marked Out for Delivery. Driver en route.`);
    }
  };

  const handleOpenProofModal = (order: Order, type: "pickup" | "dropoff" | "damage") => {
    setSelectedOrder(order);
    setProofType(type);
    setDamageNotes(order.damage_notes || "");
    setProofModalOpen(true);
  };

  const handleSaveProof = () => {
    if (!selectedOrder) return;
    onUploadProof(selectedOrder.id, proofType, "/brand/logo-badge.jpg", damageNotes);

    if (proofType === "pickup") {
      onUpdateStatus(selectedOrder.id, "in_wash");
      triggerAlert(`Pickup proof saved for ${selectedOrder.order_number}! Order moved to Wash & Dry cycle.`);
    } else if (proofType === "dropoff") {
      onUpdateStatus(selectedOrder.id, "completed");
      triggerAlert(`Delivery photo verified for ${selectedOrder.order_number}! Order completed and customer notified.`);
    } else if (proofType === "damage") {
      triggerAlert(`Pre-existing garment flaw photo logged! Customer ${selectedOrder.user?.email || ""} alerted.`);
    }

    setProofModalOpen(false);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const activeCount = orders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled").length;
  const inWashCount = orders.filter((o) => o.order_status === "in_wash" || o.order_status === "picked_up").length;
  const completedCount = orders.filter((o) => o.order_status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Real-time System Notification Toast */}
      {systemAlert && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-700 shadow-xl flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <Bell className="h-4 w-4 text-[#F5A623] shrink-0 animate-bounce" />
            <span>{systemAlert}</span>
          </div>
          <button type="button" onClick={() => setSystemAlert(null)} className="text-xs text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* Executive KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Pipeline</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{formatCurrency(totalRevenue)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">{orders.length} Orders Logged</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active In-Flight</span>
          <span className="text-2xl font-black text-[#1E88C7] mt-1 block">{activeCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Scheduled &amp; In-Route</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Wash &amp; Dry</span>
          <span className="text-2xl font-black text-[#F5A623] mt-1 block">{inWashCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Active Machine Cycles</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Photo Proofed &amp; Delivered</span>
        </div>
      </div>

      {/* Desktop Orders Table */}
      <div className="hidden lg:block rounded-3xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="p-3.5">Order</th>
              <th className="p-3.5">Customer &amp; Notes</th>
              <th className="p-3.5">Mode &amp; Volume</th>
              <th className="p-3.5">Scheduled Slot</th>
              <th className="p-3.5">Total</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Progressive Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {orders.map((ord) => (
              <OrderTableRow
                key={ord.id}
                order={ord}
                onUpdateStatus={handleStatusChangeWithNotification}
                onOpenWeightDialog={(o) => { setSelectedOrder(o); setWeightInput(String(o.final_weight_kg || 5)); }}
                onOpenProofModal={handleOpenProofModal}
                onViewDetails={(o) => setDetailOrderId(o.id)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile & Tablet Card View (No Horizontal Scrolling) */}
      <div className="lg:hidden space-y-3">
        {orders.map((ord) => (
          <OrderCard
            key={ord.id}
            order={ord}
            onUpdateStatus={handleStatusChangeWithNotification}
            onOpenWeightDialog={(o) => { setSelectedOrder(o); setWeightInput(String(o.final_weight_kg || 5)); }}
            onOpenProofModal={handleOpenProofModal}
            onViewDetails={(o) => setDetailOrderId(o.id)}
          />
        ))}
      </div>

      {/* Photo Proof & Damage Reporting Modal */}
      {proofModalOpen && selectedOrder && (
        <Dialog
          open={proofModalOpen}
          onOpenChange={() => setProofModalOpen(false)}
          title={
            proofType === "damage"
              ? `Report Pre-Existing Fabric Flaw: ${selectedOrder.order_number}`
              : proofType === "dropoff"
              ? `Upload Delivery Drop-Off Proof: ${selectedOrder.order_number}`
              : `Upload Pickup Proof: ${selectedOrder.order_number}`
          }
          description={
            proofType === "damage"
              ? "Document existing cloth damage/tear before wash cycle. Sends automated notification to customer."
              : "High-resolution photo proof viewable immediately by customer and operations."
          }
        >
          <div className="space-y-4 text-xs">
            {proofType === "damage" && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Damage Description / Flaw Location
                </label>
                <input
                  type="text"
                  value={damageNotes}
                  onChange={(e) => setDamageNotes(e.target.value)}
                  placeholder="e.g. Small tear near collar on blue collared shirt"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>
            )}

            <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center space-y-2">
              <Camera className="h-8 w-8 text-[#1E88C7] mx-auto shrink-0" />
              <p className="font-bold text-slate-800">
                {proofType === "damage" ? "Capture Damaged Garment Photo" : `Simulate Camera Snapshot (${proofType})`}
              </p>
              <p className="text-slate-400 text-[11px]">Strict 5MB cap • Raster JPEG/PNG/WebP</p>
              <Button variant="hero" size="sm" onClick={handleSaveProof}>
                {proofType === "dropoff" ? "Complete Delivery With Photo" : "Upload & Save Proof"}
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Full Order Detail Inspection Modal */}
      <OrderDetailModal
        order={detailOrder}
        isOpen={!!detailOrder}
        onClose={() => setDetailOrderId(null)}
        onUpdateStatus={handleStatusChangeWithNotification}
        onOpenProofModal={handleOpenProofModal}
        allOrders={orders}
      />
    </div>
  );
}

export default OrderPipeline;
