import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/types";

export type OrderRealtimeEventType =
  | "order_created"
  | "order_status_updated"
  | "order_proof_uploaded"
  | "order_cancelled"
  | "order_paid";

export interface OrderRealtimeEvent {
  eventType: OrderRealtimeEventType;
  orderId: string;
  orderNumber: string;
  orderStatus: OrderStatus;
  paymentStatus?: string;
  userId?: string | null;
  customerEmail?: string | null;
  customerName?: string | null;
  totalAmount?: number;
  pickupDate?: string;
  pickupSlot?: string;
  proofType?: string;
  updatedAt: string;
}

const BROADCAST_TIMEOUT_MS = 2500;

/**
 * Broadcasts an order lifecycle event over Supabase Realtime channel.
 * Designed to be fire-and-forget or awaited with guaranteed timeout.
 */
export async function broadcastOrderEvent(event: OrderRealtimeEvent): Promise<boolean> {
  try {
    const supabase = createAdminSupabaseClient();
    const channel = supabase.channel("realtime:orders");

    const broadcastPromise = new Promise<boolean>((resolve) => {
      channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          try {
            await channel.send({
              type: "broadcast",
              event: "order_event",
              payload: event,
            });
            resolve(true);
          } catch {
            resolve(false);
          } finally {
            void supabase.removeChannel(channel);
          }
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          void supabase.removeChannel(channel);
          resolve(false);
        }
      });
    });

    const timeoutPromise = new Promise<boolean>((resolve) => {
      setTimeout(() => {
        void supabase.removeChannel(channel);
        resolve(false);
      }, BROADCAST_TIMEOUT_MS);
    });

    return await Promise.race([broadcastPromise, timeoutPromise]);
  } catch (error) {
    console.error("[realtime:orders] Broadcast failed:", error);
    return false;
  }
}
