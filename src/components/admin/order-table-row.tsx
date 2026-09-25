import * as React from "react";
import { Clock, Scale, Camera } from "lucide-react";
import type { Order, OrderStatus } from "@/types";
import { ORDER_STATUSES } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface OrderTableRowProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  onOpenWeightDialog: (order: Order) => void;
  onOpenProofModal: (order: Order) => void;
}

/**
 * OrderTableRow Component
 *
 * Renders an individual order row in the admin pipeline table.
 * Includes customer details, bag/kg volume, pickup slot, status badge, and action triggers.
 */
export function OrderTableRow({
  order,
  onUpdateStatus,
  onOpenWeightDialog,
  onOpenProofModal,
}: OrderTableRowProps) {
  const statusMeta = ORDER_STATUSES[order.order_status] || ORDER_STATUSES.pending;

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="p-3.5 font-bold text-slate-900">
        <span>{order.order_number}</span>
        <span className="block text-[10px] text-slate-400 font-mono mt-0.5">
          {formatDate(order.created_at)}
        </span>
      </td>

      <td className="p-3.5">
        <span className="font-semibold text-slate-800 block">
          {order.user?.full_name || "Customer"}
        </span>
        <span className="text-[11px] text-slate-500 block max-w-xs truncate">
          {order.customer_notes || "Doorstep Address"}
        </span>
        {order.is_out_of_home && (
          <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800">
            Away • Bag Outside Door
          </span>
        )}
      </td>

      <td className="p-3.5">
        <span className="font-bold text-sky-800 uppercase text-[10px] block">
          {order.pricing_mode === "per_bag"
            ? "By Bag"
            : order.pricing_mode === "per_kg"
            ? "By Weight (KG)"
            : "Package"}
        </span>
        <span className="text-slate-600">
          {order.pricing_mode === "per_bag"
            ? `${order.bag_count} Bag(s)`
            : order.final_weight_kg
            ? `${order.final_weight_kg} KG (Final)`
            : `${order.estimated_weight_kg || 5} KG (Est.)`}
        </span>
      </td>

      <td className="p-3.5">
        <span className="font-medium text-slate-900 block">{order.pickup_date}</span>
        <span className="text-slate-500 text-[11px] flex items-center gap-1">
          <Clock className="h-3 w-3 text-sky-600" />
          {order.pickup_slot}
        </span>
      </td>

      <td className="p-3.5 font-bold text-slate-900">
        {formatCurrency(order.total_amount)}
      </td>

      <td className="p-3.5">
        <span
          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${statusMeta.color}`}
        >
          {statusMeta.label}
        </span>
      </td>

      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
        {order.pricing_mode === "per_kg" && (
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => onOpenWeightDialog(order)}
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
          onClick={() => onOpenProofModal(order)}
          title="Upload or view pickup/drop-off photo proofs"
        >
          <Camera className="h-3.5 w-3.5 mr-1 text-sky-600" />
          Proofs ({order.proofs?.length || 0})
        </Button>

        <select
          value={order.order_status}
          onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
          aria-label={`Change status for order ${order.order_number}`}
          className="h-8 text-xs rounded-lg border border-slate-300 bg-white px-2 font-semibold text-slate-700 shadow-2xs focus:border-sky-500 focus:outline-none"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="driver_assigned">Driver Assigned</option>
          <option value="picked_up">Picked Up</option>
          <option value="in_wash">In Wash</option>
          <option value="drying_folding">Drying/Folding</option>
          <option value="out_for_delivery">Out For Delivery</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </td>
    </tr>
  );
}
