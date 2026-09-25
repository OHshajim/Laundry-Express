"use client";

import * as React from "react";
import { Camera, CheckCircle, Clock, Scale, Eye, RefreshCw, Upload } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

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

  return (
    <div className="space-y-6">
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
              {orders.map((ord) => {
                const statusMeta = ORDER_STATUSES[ord.order_status] || ORDER_STATUSES.pending;
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 font-bold text-slate-900">
                      <span>{ord.order_number}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
                        {formatDate(ord.created_at)}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800 block">{ord.user?.full_name || "Customer"}</span>
                      <span className="text-[11px] text-slate-500 block max-w-xs truncate">{ord.customer_notes || "Doorstep Address"}</span>
                      {ord.is_out_of_home && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
                          Away • Bag Outside
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="font-bold text-sky-800 uppercase text-[10px] block">
                        {ord.pricing_mode === "per_bag" ? "By Bag" : ord.pricing_mode === "per_kg" ? "By Weight (KG)" : "Package"}
                      </span>
                      <span className="text-slate-600">
                        {ord.pricing_mode === "per_bag"
                          ? `${ord.bag_count} Bag(s)`
                          : ord.final_weight_kg
                          ? `${ord.final_weight_kg} KG (Final)`
                          : `${ord.estimated_weight_kg || 5} KG (Est.)`}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="font-medium text-slate-900 block">{ord.pickup_date}</span>
                      <span className="text-slate-500 text-[11px] flex items-center gap-1">
                        <Clock className="h-3 w-3 text-sky-600" />
                        {ord.pickup_slot}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {formatCurrency(ord.total_amount)}
                    </td>
                    <td className="p-3.5">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.color}`}>
                        {statusMeta.label}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {ord.pricing_mode === "per_kg" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => handleOpenWeightDialog(ord)}
                          title="Record precision intake weight"
                        >
                          <Scale className="h-3.5 w-3.5 mr-1" />
                          Weigh
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => {
                          setSelectedOrder(ord);
                          setProofModalOpen(true);
                        }}
                      >
                        <Camera className="h-3.5 w-3.5 mr-1" />
                        Proof ({ord.proofs?.length || 0})
                      </Button>

                      {ord.order_status !== "completed" && (
                        <Button
                          variant="hero"
                          size="sm"
                          className="h-8 px-2.5 text-xs"
                          onClick={() => {
                            const nextMap: Record<OrderStatus, OrderStatus> = {
                              pending: "confirmed",
                              confirmed: "picked_up",
                              picked_up: "in_wash",
                              in_wash: "out_for_delivery",
                              out_for_delivery: "completed",
                              completed: "completed",
                              cancelled: "cancelled",
                            };
                            onUpdateStatus(ord.id, nextMap[ord.order_status]);
                          }}
                        >
                          Next Step
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
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
