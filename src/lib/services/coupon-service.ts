import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  discount_value: number;
  min_order_amount: number;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  is_active: boolean;
}

const isUuid = (val?: string): boolean =>
  Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

let cachedCoupons: CouponItem[] = [];

export class CouponService {
  static async getCoupons(): Promise<CouponItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        cachedCoupons = data.map((d) => ({
          id: d.id,
          code: d.code,
          title: d.title || "",
          discount_type: d.discount_type,
          discount_value: Number(d.discount_value ?? 0),
          min_order_amount: Number(d.min_order_amount ?? 0),
          max_uses: d.max_uses ? Number(d.max_uses) : undefined,
          expires_at: d.expires_at || undefined,
          is_active: d.is_active ?? true,
        }));
      } else if (!error && data && data.length === 0) {
        cachedCoupons = [];
      }
    } catch {}
    return cachedCoupons;
  }

  static async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: CouponItem; error?: string }> {
    const list = await this.getCoupons();
    const cleanCode = code.trim().toUpperCase();
    const found = list.find((c) => c.code.toUpperCase() === cleanCode);

    if (!found) return { valid: false, error: "Invalid coupon code." };
    if (!found.is_active) return { valid: false, error: "This coupon is no longer active." };
    if (found.expires_at && new Date(found.expires_at).getTime() < Date.now()) {
      return { valid: false, error: "This promo code has expired." };
    }
    if (subtotal < found.min_order_amount) {
      return { valid: false, error: `Minimum order of $${found.min_order_amount.toFixed(2)} required for this code.` };
    }

    return { valid: true, coupon: found };
  }

  static async saveCoupon(coupon: Partial<CouponItem>): Promise<CouponItem> {
    const code = (coupon.code || "PROMO").trim().toUpperCase();
    const title = (coupon.title || "Special Offer").trim();
    const discount_type = coupon.discount_type || "fixed_amount";
    const discount_value = Number(coupon.discount_value ?? 5);
    const min_order_amount = Number(coupon.min_order_amount ?? 0);
    const max_uses = coupon.max_uses ? Number(coupon.max_uses) : undefined;
    const expires_at = coupon.expires_at || undefined;
    const is_active = coupon.is_active ?? true;

    let finalId = isUuid(coupon.id) ? coupon.id! : "";

    try {
      const supabase = createAdminSupabaseClient();
      const dbPayload: Record<string, unknown> = {
        code,
        title,
        discount_type,
        discount_value,
        min_order_amount,
        max_uses: max_uses ?? null,
        expires_at: expires_at ?? null,
        is_active,
      };

      if (finalId) dbPayload.id = finalId;

      const { data, error } = await supabase
        .from("coupons")
        .upsert(dbPayload, { onConflict: "code" })
        .select()
        .single();

      if (!error && data?.id) {
        finalId = data.id;
      }
    } catch {}

    const full: CouponItem = {
      id: finalId || coupon.id || `cp-${Date.now()}`,
      code,
      title,
      discount_type,
      discount_value,
      min_order_amount,
      max_uses,
      expires_at,
      is_active,
    };

    const idx = cachedCoupons.findIndex((c) => (finalId && c.id === finalId) || c.code === code);
    if (idx >= 0) cachedCoupons[idx] = full;
    else cachedCoupons.unshift(full);

    return full;
  }

  static async deleteCoupon(id: string): Promise<boolean> {
    cachedCoupons = cachedCoupons.filter((c) => c.id !== id && c.code !== id);
    try {
      const supabase = createAdminSupabaseClient();
      if (isUuid(id)) {
        await supabase.from("coupons").delete().eq("id", id);
      } else {
        await supabase.from("coupons").delete().eq("code", id);
      }
    } catch {}
    return true;
  }
}
