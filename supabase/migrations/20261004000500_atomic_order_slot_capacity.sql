UPDATE public.system_settings
SET value = value || '{"max_orders_per_slot": 15}'::jsonb
WHERE key = 'business_operations'
  AND NOT (value ? 'max_orders_per_slot');

CREATE INDEX IF NOT EXISTS idx_orders_pickup_slot_status
    ON public.orders(pickup_date, pickup_time_slot, order_status);

CREATE OR REPLACE FUNCTION public.create_order_with_slot_capacity(
    p_order JSONB,
    p_pickup_date DATE,
    p_pickup_slot TEXT,
    p_slot_capacity INTEGER
)
RETURNS SETOF public.orders
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, pg_temp
AS $$
DECLARE
    active_count BIGINT;
    created_order public.orders;
BEGIN
    IF p_slot_capacity IS NULL OR p_slot_capacity < 1 THEN
        RAISE EXCEPTION 'Pickup capacity is not configured.';
    END IF;
    IF p_order->>'pickup_date' IS DISTINCT FROM p_pickup_date::TEXT
       OR p_order->>'pickup_time_slot' IS DISTINCT FROM p_pickup_slot THEN
        RAISE EXCEPTION 'Pickup slot does not match order data.';
    END IF;

    PERFORM pg_advisory_xact_lock(hashtextextended(p_pickup_date::TEXT || ':' || p_pickup_slot, 0));
    SELECT COUNT(*) INTO active_count
    FROM public.orders
    WHERE pickup_date = p_pickup_date
      AND pickup_time_slot = p_pickup_slot
      AND order_status <> 'cancelled';

    IF active_count >= p_slot_capacity THEN
        RAISE EXCEPTION 'PICKUP_SLOT_FULL';
    END IF;

    INSERT INTO public.orders
    SELECT (jsonb_populate_record(NULL::public.orders, p_order)).*
    RETURNING * INTO created_order;

    RETURN NEXT created_order;
END;
$$;

REVOKE ALL ON FUNCTION public.create_order_with_slot_capacity(JSONB, DATE, TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.create_order_with_slot_capacity(JSONB, DATE, TEXT, INTEGER) TO service_role;
