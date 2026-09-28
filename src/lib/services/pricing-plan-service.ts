import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface PackagePlan {
  id: string;
  name: string;
  description: string;
  unit_type: "bag" | "lb";
  capacity: number;
  original_price: number;
  discounted_price: number;
  key_points: string[];
  is_active: boolean;
}

export interface PricingConfig {
  bag_price: number;
  min_bags: number;
  max_bags: number;
  pound_price: number;
  min_lbs: number;
  max_lbs: number;
  free_delivery_lbs: number;
  free_delivery_threshold: number;
  standard_delivery_fee: number;
  base_bag_price: number;
  base_pound_price: number;
  one_bag_delivery_fee: number;
}

let cachedPlans: PackagePlan[] = [];
let cachedPricing: PricingConfig = {
  bag_price: 32.5,
  min_bags: 1,
  max_bags: 10,
  pound_price: 1.99,
  min_lbs: 10,
  max_lbs: 100,
  free_delivery_lbs: 30,
  free_delivery_threshold: 2,
  standard_delivery_fee: 10,
  base_bag_price: 32.5,
  base_pound_price: 1.99,
  one_bag_delivery_fee: 10,
};

export class PricingPlanService {
  static async getPlans(): Promise<PackagePlan[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("plans").select("*").order("created_at", { ascending: true });
      if (!error && data && data.length > 0) {
        cachedPlans = data.map((d) => ({
          id: d.id,
          name: d.title || d.name,
          description: d.description || "",
          unit_type: (d.package_type === "weight_tier" ? "lb" : "bag") as "bag" | "lb",
          capacity: Number(d.included_bags || d.included_lbs || d.capacity || 1),
          original_price: Number(d.original_price || d.price || 0),
          discounted_price: Number(d.price || d.discounted_price || 0),
          key_points: Array.isArray(d.key_points) ? d.key_points : [],
          is_active: d.is_active ?? true,
        }));
      } else if (!error && data && data.length === 0) {
        cachedPlans = [];
      }
    } catch {}
    return cachedPlans;
  }

  static async savePlan(plan: Partial<PackagePlan>): Promise<PackagePlan> {
    const id = plan.id || `pkg-${Date.now()}`;
    const fullPlan: PackagePlan = {
      id,
      name: plan.name || "Custom Laundry Pass",
      description: plan.description || "",
      unit_type: plan.unit_type || "bag",
      capacity: plan.capacity || 1,
      original_price: plan.original_price || 0,
      discounted_price: plan.discounted_price || 0,
      key_points: plan.key_points || [],
      is_active: plan.is_active ?? true,
    };

    const idx = cachedPlans.findIndex((p) => p.id === id);
    if (idx >= 0) cachedPlans[idx] = fullPlan;
    else cachedPlans.push(fullPlan);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("plans").upsert({
        id,
        title: fullPlan.name,
        slug: fullPlan.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: fullPlan.description,
        package_type: fullPlan.unit_type === "lb" ? "weight_tier" : "bag_bundle",
        included_bags: fullPlan.unit_type === "bag" ? fullPlan.capacity : 0,
        included_lbs: fullPlan.unit_type === "lb" ? fullPlan.capacity : 0,
        price: fullPlan.discounted_price || fullPlan.original_price,
        key_points: fullPlan.key_points,
        is_active: fullPlan.is_active,
        updated_at: new Date().toISOString(),
      });
    } catch {}

    return fullPlan;
  }

  static async deletePlan(id: string): Promise<boolean> {
    cachedPlans = cachedPlans.filter((p) => p.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("plans").delete().eq("id", id);
    } catch {}
    return true;
  }

  static async getPricing(): Promise<PricingConfig> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase.from("pricing_configs").select("*");
      if (!error && data && data.length > 0) {
        const bagRow = data.find((r) => r.pricing_type === "per_bag");
        const lbRow = data.find((r) => r.pricing_type === "per_lb" || r.pricing_type === "per_kg");
        const bPrice = Number(bagRow?.unit_price ?? 32.5);
        const pPrice = Number(lbRow?.unit_price ?? 1.99);
        const dFee = Number(bagRow?.standard_delivery_fee ?? 10);
        const minLbs = Number(lbRow?.min_order_quantity ?? 10);
        const maxLbs = Number(lbRow?.max_orders_per_slot ?? 100);
        const freeDeliveryLbs = Number(lbRow?.free_delivery_threshold ?? 30);
        const freeDeliveryBags = Number(bagRow?.free_delivery_threshold ?? 2);

        cachedPricing = {
          bag_price: bPrice,
          min_bags: Number(bagRow?.min_order_quantity ?? 1),
          max_bags: Number(bagRow?.max_orders_per_slot ?? 15),
          pound_price: pPrice,
          min_lbs: minLbs,
          max_lbs: maxLbs,
          free_delivery_lbs: freeDeliveryLbs,
          free_delivery_threshold: freeDeliveryBags,
          standard_delivery_fee: dFee,
          base_bag_price: bPrice,
          base_pound_price: pPrice,
          one_bag_delivery_fee: dFee,
        };
      }
    } catch {}
    return cachedPricing;
  }

  static async updatePricing(updates: Partial<PricingConfig> & Record<string, any>): Promise<PricingConfig> {
    const bPrice = Number(updates.bag_price ?? updates.base_bag_price ?? cachedPricing.bag_price);
    const pPrice = Number(updates.pound_price ?? updates.base_pound_price ?? cachedPricing.pound_price);
    const dFee = Number(updates.standard_delivery_fee ?? updates.one_bag_delivery_fee ?? cachedPricing.standard_delivery_fee);
    const freeDeliveryBags = Number(updates.free_delivery_threshold ?? cachedPricing.free_delivery_threshold);
    const freeDeliveryLbs = Number(updates.free_delivery_lbs ?? cachedPricing.free_delivery_lbs);
    const minBags = Number(updates.min_bags ?? cachedPricing.min_bags);
    const minLbs = Number(updates.min_lbs ?? cachedPricing.min_lbs);
    const maxLbs = Number(updates.max_lbs ?? cachedPricing.max_lbs);

    cachedPricing = {
      bag_price: bPrice,
      min_bags: minBags,
      max_bags: Number(updates.max_bags ?? cachedPricing.max_bags),
      pound_price: pPrice,
      min_lbs: minLbs,
      max_lbs: maxLbs,
      free_delivery_lbs: freeDeliveryLbs,
      free_delivery_threshold: freeDeliveryBags,
      standard_delivery_fee: dFee,
      base_bag_price: bPrice,
      base_pound_price: pPrice,
      one_bag_delivery_fee: dFee,
    };

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("pricing_configs").upsert([
        {
          pricing_type: "per_bag",
          unit_price: bPrice,
          min_order_quantity: minBags,
          free_delivery_threshold: freeDeliveryBags,
          standard_delivery_fee: dFee,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          pricing_type: "per_lb",
          unit_price: pPrice,
          min_order_quantity: minLbs,
          free_delivery_threshold: freeDeliveryLbs,
          max_orders_per_slot: maxLbs,
          standard_delivery_fee: dFee,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "pricing_type" });
    } catch {}
    return cachedPricing;
  }
}
