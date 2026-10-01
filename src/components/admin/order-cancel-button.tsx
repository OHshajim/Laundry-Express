"use client";

import * as React from "react";
import { XCircle } from "lucide-react";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

interface OrderCancelButtonProps {
  order: Order;
  disabled: boolean;
  onCancel: () => Promise<boolean>;
}

export function OrderCancelButton({ order, disabled, onCancel }: OrderCancelButtonProps) {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [error, setError] = React.useState("");

  const cancelOrder = async () => {
    if (!window.confirm(
      `Cancel order ${order.order_number}? This stops fulfillment but does not issue a refund. Contact the customer and process any agreed refund separately.`
    )) return;
    setIsCancelling(true);
    setError("");
    const cancelled = await onCancel();
    setIsCancelling(false);
    if (!cancelled) setError("The order was not cancelled. Review the error and try again.");
  };

  return (
    <div>
      <Button
        variant="outline"
        size="sm"
        disabled={disabled || isCancelling}
        className="border-rose-300 text-rose-700 hover:bg-rose-50"
        onClick={() => { void cancelOrder(); }}
      >
        <XCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
        {isCancelling ? "Cancelling..." : "Cancel Order"}
      </Button>
      {error && <p role="alert" className="mt-2 text-xs text-rose-700">{error}</p>}
    </div>
  );
}
