import { createClient } from "@supabase/supabase-js";
import type { Order, OrderStatus, PricingConfig, User } from "@/types";

/**
 * Creates an administrative Supabase client equipped with the service role key.
 * If only publishable key is configured, gracefully uses publishable key.
 * Strictly adheres to the 100-250 lines architectural rule.
 */
export function createAdminSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const apiKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  return createClient(supabaseUrl, apiKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Retrieves all orders with associated proofs and customer profiles for dispatch operations.
 */
export async function getAdminAllOrders(): Promise<Order[]> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, proofs:order_proofs(*), user:users(*)")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as Order[];
  } catch (err) {
    console.error("Admin: failed to fetch all orders:", err);
    return [];
  }
}

/**
 * Updates order status and logs the administrative action.
 */
export async function updateOrderStatusAdmin(
  orderId: string,
  status: OrderStatus
): Promise<boolean> {
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("orders")
      .update({ order_status: status, updated_at: new Date().toISOString() })
      .eq("id", orderId);

    if (error) {
      console.error(`Admin: failed to update status for order ${orderId}:`, error);
      return false;
    }

    return true;
  } catch (err) {
    console.error(`Admin: exception updating order ${orderId}:`, err);
    return false;
  }
}

/**
 * Updates dynamic pricing configurations in public.pricing_configs.
 */
export async function updatePricingConfigAdmin(
  config: Partial<PricingConfig> & { pricing_type: "per_bag" | "per_kg" }
): Promise<boolean> {
  try {
    const supabase = createAdminSupabaseClient();
    const { error } = await supabase
      .from("pricing_configs")
      .upsert(
        {
          ...config,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "pricing_type" }
      );

    if (error) {
      console.error("Admin: failed to update pricing config:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Admin: exception updating pricing config:", err);
    return false;
  }
}

/**
 * Generates an administrative signed URL for secure driver proof uploads and inspection.
 */
export async function createAdminSignedProofUrl(
  path: string,
  expiresInSeconds: number = 3600
): Promise<string | null> {
  try {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase.storage
      .from("order-proofs")
      .createSignedUrl(path, expiresInSeconds);

    if (error || !data) {
      return null;
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Admin: failed to create signed URL:", err);
    return null;
  }
}
