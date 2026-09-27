import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface CouponItem {
  id: string;
  code: string;
  title: string;
  discount_type: "percentage" | "fixed_amount" | "free_delivery";
  discount_value: number;
  min_order_amount: number;
  is_active: boolean;
}

const DEFAULT_COUPONS: CouponItem[] = [
  { id: "cp-1", code: "HEROFRESH", title: "Welcome Superhero 15% Off", discount_type: "percentage", discount_value: 15, min_order_amount: 25, is_active: true },
  { id: "cp-2", code: "FREESHIP", title: "Free Doorstep Delivery", discount_type: "free_delivery", discount_value: 10, min_order_amount: 0, is_active: true },
  { id: "cp-3", code: "SAVE5", title: "$5 Off First Booking", discount_type: "fixed_amount", discount_value: 5, min_order_amount: 30, is_active: true },
];

let cachedCoupons: CouponItem[] = [...DEFAULT_COUPONS];

export class CouponService {
  static async getCoupons(): Promise<CouponItem[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("promotions").select("*").order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        cachedCoupons = data.map((d) => ({
          id: d.id,
          code: d.code,
          title: d.title,
          discount_type: d.discount_type,
          discount_value: Number(d.discount_value ?? 0),
          min_order_amount: Number(d.min_order_amount ?? 0),
          is_active: d.is_active ?? true,
        }));
      }
    } catch {}
    return cachedCoupons;
  }

  static async validateCoupon(code: string, subtotal: number): Promise<{ valid: boolean; coupon?: CouponItem; error?: string }> {
    const list = await this.getCoupons();
    const found = list.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

    if (!found) return { valid: false, error: "Invalid coupon code." };
    if (!found.is_active) return { valid: false, error: "This coupon is no longer active." };
    if (subtotal < found.min_order_amount) {
      return { valid: false, error: `Minimum order of $${found.min_order_amount.toFixed(2)} required for this code.` };
    }

    return { valid: true, coupon: found };
  }

  static async saveCoupon(coupon: Partial<CouponItem>): Promise<CouponItem> {
    const id = coupon.id || `cp-${Date.now()}`;
    const code = (coupon.code || "SAVE").trim().toUpperCase();
    const full: CouponItem = {
      id,
      code,
      title: coupon.title || "Special Offer",
      discount_type: coupon.discount_type || "fixed_amount",
      discount_value: coupon.discount_value ?? 5,
      min_order_amount: coupon.min_order_amount ?? 0,
      is_active: coupon.is_active ?? true,
    };

    const idx = cachedCoupons.findIndex((c) => c.id === id || c.code === code);
    if (idx >= 0) cachedCoupons[idx] = full;
    else cachedCoupons.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("promotions").upsert({
        id,
        code: full.code,
        title: full.title,
        discount_type: full.discount_type,
        discount_value: full.discount_value,
        min_order_amount: full.min_order_amount,
        is_active: full.is_active,
      });
    } catch {}

    return full;
  }

  static async deleteCoupon(id: string): Promise<boolean> {
    cachedCoupons = cachedCoupons.filter((c) => c.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("promotions").delete().eq("id", id);
    } catch {}
    return true;
  }
}
