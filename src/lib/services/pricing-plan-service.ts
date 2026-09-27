import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface PackagePlan {
  id: string;
  name: string;
  description: string;
  unit_type: "bag" | "kg";
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
  kg_price: number;
  min_kg: number;
  max_kg: number;
  free_delivery_threshold: number;
  standard_delivery_fee: number;
}

let cachedPlans: PackagePlan[] = [];
let cachedPricing: PricingConfig = {
  bag_price: 32.5,
  min_bags: 1,
  max_bags: 10,
  kg_price: 2.75,
  min_kg: 5,
  max_kg: 50,
  free_delivery_threshold: 2,
  standard_delivery_fee: 10,
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
          unit_type: (d.package_type === "weight_tier" ? "kg" : "bag") as "bag" | "kg",
          capacity: Number(d.included_bags || d.included_kg || d.capacity || 1),
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
        package_type: fullPlan.unit_type === "kg" ? "weight_tier" : "bag_bundle",
        included_bags: fullPlan.unit_type === "bag" ? fullPlan.capacity : 0,
        included_kg: fullPlan.unit_type === "kg" ? fullPlan.capacity : 0,
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
        const kgRow = data.find((r) => r.pricing_type === "per_kg");
        cachedPricing = {
          bag_price: Number(bagRow?.unit_price ?? 32.5),
          min_bags: Number(bagRow?.min_order_quantity ?? 1),
          max_bags: Number(bagRow?.max_orders_per_slot ?? 10),
          kg_price: Number(kgRow?.unit_price ?? 2.75),
          min_kg: Number(kgRow?.min_order_quantity ?? 5),
          max_kg: 50,
          free_delivery_threshold: Number(bagRow?.free_delivery_threshold ?? 2),
          standard_delivery_fee: Number(bagRow?.standard_delivery_fee ?? 10),
        };
      }
    } catch {}
    return cachedPricing;
  }

  static async updatePricing(updates: Partial<PricingConfig>): Promise<PricingConfig> {
    cachedPricing = { ...cachedPricing, ...updates };
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("pricing_configs").upsert([
        {
          pricing_type: "per_bag",
          unit_price: cachedPricing.bag_price,
          min_order_quantity: cachedPricing.min_bags,
          free_delivery_threshold: cachedPricing.free_delivery_threshold,
          standard_delivery_fee: cachedPricing.standard_delivery_fee,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        {
          pricing_type: "per_kg",
          unit_price: cachedPricing.kg_price,
          min_order_quantity: cachedPricing.min_kg,
          free_delivery_threshold: cachedPricing.free_delivery_threshold,
          standard_delivery_fee: cachedPricing.standard_delivery_fee,
          is_active: true,
          updated_at: new Date().toISOString(),
        },
      ], { onConflict: "pricing_type" });
    } catch {}
    return cachedPricing;
  }
}
