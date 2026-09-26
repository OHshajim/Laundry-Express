"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Sparkles,
  Shirt,
  Truck,
  Camera,
  CheckCircle2,
  Clock,
  RotateCcw,
  X,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CUSTOMER_ORDERS } from "@/lib/mock-customer-data";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

/**
 * Customer Orders & Live Timeline Tracking Page (/dashboard/orders)
 *
 * Implements:
 * - Full customer order history
 * - Interactive order inspection modal with the real 4-stage status timeline
 * - Dual photo proof gallery (pickup + drop-off photos)
 * - Itemized billing breakdown (bags, detergent, delivery tier)
 */
export default function CustomerOrdersPage() {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            My Orders &amp; Timeline Tracking
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click any order to inspect its real-time 4-stage journey and verified photo proofs.
          </p>
        </div>

        <Link href="/order">
          <Button className="bg-primary hover:bg-primary-dark text-white shadow-md shadow-primary/25 text-xs">
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            <span>Book Next Pickup</span>
          </Button>
        </Link>
      </div>

      {/* Orders Directory List */}
      <div className="space-y-4">
        {CUSTOMER_ORDERS.map((order) => {
          const isComplete = order.order_status === "completed";
          return (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-slate-900">
                    Order #{order.order_number}
                  </span>
                  <Badge variant={isComplete ? "success" : "warning"} className="text-xs uppercase font-extrabold">
                    {order.order_status.replace("_", " ")}
                  </Badge>
                  {order.proofs && order.proofs.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-pink-50 px-2 py-0.5 rounded-full">
                      <Camera className="h-3 w-3" />
                      <span>{order.proofs.length} Proof Photo(s)</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium">
                  <span>Slot: {order.pickup_date} ({order.pickup_slot})</span>
                  <span>•</span>
                  <span>{order.bag_count} Bag(s) • {order.detergent_id}</span>
                  <span>•</span>
                  <span>Total: <strong className="text-slate-900 font-bold">{formatCurrency(order.total_amount)}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Button size="sm" variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 text-xs">
                  <span>View Timeline &amp; Photos</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Order Timeline & Proof Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative my-8 border border-pink-100">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <span className="text-[11px] font-black uppercase text-primary-dark tracking-wider">
                Real Customer Order Journey
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                Timeline: Order #{selectedOrder.order_number}
              </h3>
            </div>

            {/* Real 4-Stage Status Timeline (Moved from homepage) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-pink-50/50 border border-pink-100 space-y-4">
              <span className="text-xs font-black text-slate-900 block">4-Stage Custody Progression</span>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="space-y-1">
                  <div className="h-2 rounded-full bg-primary" />
                  <span className="font-extrabold text-slate-900 block text-[11px]">1. Picked Up</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${selectedOrder.order_status !== "confirmed" ? "bg-primary" : "bg-slate-200"}`} />
                  <span className="font-extrabold text-slate-900 block text-[11px]">2. Gentle Wash</span>
                  <span className="text-[10px] text-primary font-bold">Cold Sanitized</span>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${selectedOrder.order_status === "completed" ? "bg-primary" : "bg-slate-200"}`} />
                  <span className="font-medium text-slate-500 block text-[11px]">3. Crisp Fold</span>
                  <span className="text-[10px] text-slate-400">{selectedOrder.order_status === "completed" ? "Complete" : "In Progress"}</span>
                </div>
                <div className="space-y-1">
                  <div className={`h-2 rounded-full ${selectedOrder.order_status === "completed" ? "bg-primary" : "bg-slate-200"}`} />
                  <span className="font-medium text-slate-500 block text-[11px]">4. Delivered</span>
                  <span className="text-[10px] text-slate-400">{selectedOrder.order_status === "completed" ? "On Porch" : "Pending"}</span>
                </div>
              </div>
            </div>

            {/* Proof Photos Gallery */}
            <div className="space-y-3">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                <Camera className="h-4 w-4 text-primary" />
                <span>Verified Driver Proof Photos</span>
              </h4>

              {selectedOrder.proofs && selectedOrder.proofs.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedOrder.proofs.map((prf) => (
                    <div key={prf.id} className="p-3 rounded-2xl border border-slate-200 space-y-2">
                      <div className="relative h-32 w-full rounded-xl overflow-hidden bg-slate-100">
                        <Image
                          src={prf.image_url}
                          alt="Custody proof photo"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-900 capitalize">{prf.proof_type} Photo</span>
                        <span className="text-slate-400">Timestamp logged</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  Driver will upload timestamped photo upon arrival during scheduled window.
                </p>
              )}
            </div>

            {/* Itemized Pricing Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <span className="font-bold text-slate-900 block">Itemized Billing Summary</span>
              <div className="flex justify-between text-slate-600">
                <span>{selectedOrder.bag_count} × Standard Bag ($32.50/bag):</span>
                <span>{formatCurrency(selectedOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pickup &amp; Delivery Fee ({selectedOrder.bag_count >= 2 ? "2+ Bags Discount" : "1 Bag"}):</span>
                <span className={selectedOrder.delivery_fee === 0 ? "text-emerald-600 font-bold" : ""}>
                  {selectedOrder.delivery_fee === 0 ? "FREE ($0.00)" : formatCurrency(selectedOrder.delivery_fee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-black text-slate-900 text-sm">
                <span>Total Paid (Stripe Upfront):</span>
                <span>{formatCurrency(selectedOrder.total_amount)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedOrder(null)} className="bg-slate-900 hover:bg-black text-white text-xs">
                Close Inspection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
