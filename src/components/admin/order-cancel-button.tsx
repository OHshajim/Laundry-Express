"use client";

import * as React from "react";
import { XCircle } from "lucide-react";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";
import { OrderCancelModal } from "./order-cancel-modal";

interface OrderCancelButtonProps {
  order: Order;
  disabled?: boolean;
  onCancel: (reason?: string, notes?: string) => Promise<boolean>;
}

export function OrderCancelButton({ order, disabled = false, onCancel }: OrderCancelButtonProps) {
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className="border-rose-300 text-rose-700 hover:bg-rose-50 font-bold"
        onClick={() => setModalOpen(true)}
      >
        <XCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
        Cancel Order
      </Button>

      <OrderCancelModal
        order={order}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirmCancel={async (reason, notes) => {
          return await onCancel(reason, notes);
        }}
        disabled={disabled}
      />
    </>
  );
}

export { OrderCancelModal };
