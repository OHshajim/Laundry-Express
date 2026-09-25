"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { OrderTableRow } from "./order-table-row";

interface OrderPipelineProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateFinalWeight: (orderId: string, finalWeight: number) => void;
  onUploadProof: (orderId: string, proofType: "pickup" | "dropoff", imageUrl: string) => void;
}

export function OrderPipeline({
  orders,
  onUpdateStatus,
  onUpdateFinalWeight,
  onUploadProof,
}: OrderPipelineProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [weightInput, setWeightInput] = React.useState<string>("");
  const [proofType, setProofType] = React.useState<"pickup" | "dropoff">("pickup");
  const [proofModalOpen, setProofModalOpen] = React.useState<boolean>(false);

  const handleOpenWeightDialog = (order: Order) => {
    setSelectedOrder(order);
    setWeightInput(order.final_weight_kg ? String(order.final_weight_kg) : String(order.estimated_weight_kg || 5));
  };

  const handleSaveWeight = () => {
    if (!selectedOrder) return;
    const num = parseFloat(weightInput);
    if (!isNaN(num) && num > 0) {
      onUpdateFinalWeight(selectedOrder.id, num);
      setSelectedOrder(null);
    }
  };

  const handleSimulateProof = (type: "pickup" | "dropoff") => {
    if (!selectedOrder) return;
    onUploadProof(selectedOrder.id, type, "/brand/logo-badge.jpg");
    setProofModalOpen(false);
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.total_amount, 0);
  const activeCount = orders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled").length;
  const inWashCount = orders.filter((o) => o.order_status === "in_wash" || o.order_status === "picked_up").length;
  const completedCount = orders.filter((o) => o.order_status === "completed").length;

  return (
    <div className="space-y-6">
      {/* Executive KPI Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Today's Pipeline</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{formatCurrency(totalRevenue)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">{orders.length} Orders Logged</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active In-Flight</span>
          <span className="text-2xl font-black text-sky-600 mt-1 block">{activeCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Scheduled &amp; In-Route</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">In Wash &amp; Dry</span>
          <span className="text-2xl font-black text-amber-500 mt-1 block">{inWashCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Active Machine Cycles</span>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
          <span className="text-[11px] text-slate-500 font-medium mt-1 block">Photo Proofed &amp; Delivered</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Active Order Pipeline</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time pickups, update intake weights, and upload timestamped proof photos.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3.5">Order</th>
                <th className="p-3.5">Customer &amp; Address</th>
                <th className="p-3.5">Mode &amp; Volume</th>
                <th className="p-3.5">Scheduled Slot</th>
                <th className="p-3.5">Total</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {orders.map((ord) => (
                <OrderTableRow
                  key={ord.id}
                  order={ord}
                  onUpdateStatus={onUpdateStatus}
                  onOpenWeightDialog={handleOpenWeightDialog}
                  onOpenProofModal={(order) => {
                    setSelectedOrder(order);
                    setProofModalOpen(true);
                  }}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Weigh Dialog */}
      {selectedOrder && (
        <Dialog
          open={!!selectedOrder && !proofModalOpen}
          onOpenChange={() => setSelectedOrder(null)}
          title={`Intake Scale Verification: ${selectedOrder.order_number}`}
          description="Enter verified weight measured at intake scale. Customer receipt will adjust automatically."
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Final Weighed Weight (Kilograms)
              </label>
              <input
                type="number"
                step="0.1"
                min="1"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button variant="hero" size="sm" onClick={handleSaveWeight}>
                Save &amp; Reconcile Amount
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Proof Photo Dialog */}
      {proofModalOpen && selectedOrder && (
        <Dialog
          open={proofModalOpen}
          onOpenChange={() => setProofModalOpen(false)}
          title={`Photo Proof for Order ${selectedOrder.order_number}`}
          description="Upload pickup or drop-off photo proof. Immediately viewable by both customer and admin."
        >
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={proofType === "pickup" ? "hero" : "outline"}
                size="sm"
                onClick={() => setProofType("pickup")}
              >
                Pickup Proof
              </Button>
              <Button
                variant={proofType === "dropoff" ? "hero" : "outline"}
                size="sm"
                onClick={() => setProofType("dropoff")}
              >
                Drop-Off Proof
              </Button>
            </div>

            <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 text-center space-y-2">
              <Camera className="h-8 w-8 text-sky-600 mx-auto" />
              <p className="font-semibold text-slate-700">Simulate Camera Snapshot ({proofType})</p>
              <p className="text-slate-400 text-[11px]">Strict 5MB cap • Raster JPEG/PNG/WebP</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleSimulateProof(proofType)}
              >
                Snap &amp; Save Proof
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}
