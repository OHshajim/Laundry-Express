"use client";

import * as React from "react";
import Link from "next/link";
import { Camera, RotateCcw, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { OrderPipeline } from "@/components/admin/order-pipeline";
import { CustomerOrderDetailModal } from "@/components/dashboard/customer-order-detail-modal";
import type { Order, OrderStatus } from "@/types";

export default function OrdersUnifiedPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) setOrders(data.orders);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus } : o)));
    try {
      await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, status: newStatus }) });
    } catch {}
  };

  const handleUpdateFinalWeight = async (orderId: string, finalWeight: number) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, final_weight_lbs: finalWeight } : o)));
    try {
      await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, finalWeight, finalWeightLbs: finalWeight }) });
    } catch {}
  };

  const handleUploadProof = async (orderId: string, proofType: "pickup" | "dropoff" | "damage", imageUrl: string, notes?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o,
        proofs: [...(o.proofs || []), { id: `prf-${Date.now()}`, order_id: orderId, proof_type: proofType, image_url: imageUrl, notes, uploaded_by: "operations-admin", created_at: new Date().toISOString() }],
      };
    }));
    try {
      await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, proofType, imageUrl, notes }) });
    } catch {}
  };

  const filteredOrders = React.useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.order_status === statusFilter);
  }, [orders, statusFilter]);

  return (
    <DashboardPageLayout
      activeSection="orders"
      title={isAdmin ? "Orders & Fulfillment Management" : "My Orders & Timeline Tracking"}
      subtitle={isAdmin ? "Track laundry dispatches, upload proof photos, and update wash status" : "Inspect your real-time 4-stage order journey and verified photo proofs"}
    >
      {isAdmin ? (
        <OrderPipeline
          orders={orders}
          onUpdateStatus={handleUpdateStatus}
          onUpdateFinalWeight={handleUpdateFinalWeight}
          onUploadProof={handleUploadProof}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <label htmlFor="customer-status-filter" className="text-xs font-bold text-slate-600">Filter Status:</label>
              <select
                id="customer-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-300 bg-white cursor-pointer"
              >
                <option value="all">All Orders ({orders.length})</option>
                <option value="confirmed">Confirmed</option>
                <option value="driver_assigned">Driver Assigned</option>
                <option value="picked_up">Picked Up</option>
                <option value="in_wash">In Wash</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <Link href="/order">
              <Button className="bg-primary hover:bg-primary-dark text-white text-xs shadow-xs">
                <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Book Next Pickup
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {filteredOrders.length === 0 && !isLoading && (
              <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
                No orders matching the selected status.
              </div>
            )}
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 hover:shadow-xs transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-black text-slate-900">Order #{order.order_number}</span>
                    <Badge variant={order.order_status === "completed" ? "success" : "warning"} className="text-[10px] uppercase font-bold">
                      {order.order_status.replace(/_/g, " ")}
                    </Badge>
                    {order.proofs && order.proofs.length > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary bg-pink-50 px-2 py-0.5 rounded-full">
                        <Camera className="h-3 w-3" /> {order.proofs.length} Proof Photo(s)
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span>Pickup: {order.pickup_date} ({order.pickup_slot})</span>
                    <span>•</span>
                    <span>
                      {order.pricing_mode === "per_bag"
                        ? `${order.bag_count || 1} Bag(s)`
                        : order.pricing_mode === "package"
                        ? "Package Credits"
                        : `${order.final_weight_lbs || order.estimated_weight_lbs || 15} lbs`}
                    </span>
                    <span>•</span>
                    <span>Total: <strong className="text-slate-900 font-bold">{formatCurrency(order.total_amount)}</strong></span>
                  </div>
                </div>

                <Button size="sm" variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 text-xs self-start md:self-auto">
                  View Details &amp; Proofs
                </Button>
              </div>
            ))}
          </div>

          <CustomerOrderDetailModal
            order={selectedOrder}
            isOpen={!!selectedOrder}
            onClose={() => setSelectedOrder(null)}
          />
        </div>
      )}
    </DashboardPageLayout>
  );
}
