"use client";

import * as React from "react";
import { getBrowserSupabaseClient } from "@/lib/supabase/client";
import type { OrderRealtimeEvent } from "@/lib/services/order-realtime-service";

interface UseOrdersRealtimeOptions {
  onEvent?: (event: OrderRealtimeEvent) => void;
  onRefresh?: () => void | Promise<void>;
  enabled?: boolean;
}

export function useOrdersRealtime({
  onEvent,
  onRefresh,
  enabled = true,
}: UseOrdersRealtimeOptions = {}) {
  const [isLive, setIsLive] = React.useState(false);
  const [lastEvent, setLastEvent] = React.useState<OrderRealtimeEvent | null>(null);

  const onEventRef = React.useRef(onEvent);
  const onRefreshRef = React.useRef(onRefresh);

  React.useEffect(() => {
    onEventRef.current = onEvent;
    onRefreshRef.current = onRefresh;
  });

  React.useEffect(() => {
    if (!enabled) return;

    const supabase = getBrowserSupabaseClient();
    if (!supabase) return;

    const channel = supabase.channel("realtime:orders", {
      config: { broadcast: { self: false } },
    });

    channel.on(
      "broadcast",
      { event: "order_event" },
      (message: { payload: OrderRealtimeEvent }) => {
        const event = message.payload;
        if (!event) return;
        setLastEvent(event);
        onEventRef.current?.(event);
        void onRefreshRef.current?.();
      }
    );

    channel.subscribe((status) => {
      setIsLive(status === "SUBSCRIBED");
    });

    return () => {
      void supabase.removeChannel(channel);
      setIsLive(false);
    };
  }, [enabled]);

  return { isLive, lastEvent };
}
