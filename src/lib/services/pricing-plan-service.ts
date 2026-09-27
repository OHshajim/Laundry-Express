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

const DEFAULT_PLANS: PackagePlan[] = [
  {
    id: "pkg-saver-5",
    name: "5-Bag Saver Bundle",
    description: "5 standard 13-gallon wash & fold pickups with free delivery.",
    unit_type: "bag",
    capacity: 5,
    original_price: 162.5,
    discounted_price: 145.0,
    key_points: ["Free delivery on all 5 bags", "Never expires", "Shareable with family"],
    is_active: true,
  },
  {
    id: "pkg-family-10",
    name: "10-Bag Family Pass",
    description: "10 standard wash & fold pickups with priority turnaround.",
    unit_type: "bag",
    capacity: 10,
    original_price: 325.0,
    discounted_price: 280.0,
    key_points: ["Priority 24h turnaround", "Free delivery on all 10 bags", "Choice of premium detergents"],
    is_active: true,
  },
  {
    id: "pkg-bulk-25kg",
    name: "25-KG Bulk Pass",
    description: "Bulky bedsheets, comforters, and salon linens.",
    unit_type: "kg",
    capacity: 25,
    original_price: 68.75,
    discounted_price: 60.0,
    key_points: ["Digital scale photo proof", "Free commercial delivery", "Hypoallergenic sanitization"],
    is_active: true,
  },
];

let cachedPlans: PackagePlan[] = [...DEFAULT_PLANS];
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
      const { data, error } = await supabase.from("packages").select("*").order("created_at", { ascending: true });
      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.title || d.name,
          description: d.description || "",
          unit_type: d.unit_type || "bag",
          capacity: Number(d.capacity || 1),
          original_price: Number(d.original_price || d.price || 0),
          discounted_price: Number(d.discounted_price || d.price || 0),
          key_points: d.key_points || [],
          is_active: d.is_active ?? true,
        }));
      }
    } catch {}
    return cachedPlans;
  }

  static async savePlan(plan: Partial<PackagePlan>): Promise<PackagePlan> {
    const id = plan.id || `pkg-${Date.now()}`;
    const fullPlan: PackagePlan = {
      id,
      name: plan.name || "Custom Laundry Pass",
      description: plan.description || "Pre-paid laundry bundle.",
      unit_type: plan.unit_type || "bag",
      capacity: plan.capacity || 1,
      original_price: plan.original_price || 50,
      discounted_price: plan.discounted_price || 40,
      key_points: plan.key_points || ["Free delivery", "Valid for 60 days"],
      is_active: plan.is_active ?? true,
    };

    const idx = cachedPlans.findIndex((p) => p.id === id);
    if (idx >= 0) cachedPlans[idx] = fullPlan;
    else cachedPlans.push(fullPlan);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("packages").upsert({
        id,
        title: fullPlan.name,
        description: fullPlan.description,
        unit_type: fullPlan.unit_type,
        capacity: fullPlan.capacity,
        original_price: fullPlan.original_price,
        discounted_price: fullPlan.discounted_price,
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
      await supabase.from("packages").delete().eq("id", id);
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
        return {
          bag_price: Number(bagRow?.unit_price ?? 32.5),
          min_bags: Number(bagRow?.min_order_quantity ?? 1),
          max_bags: Number(bagRow?.max_order_quantity ?? 10),
          kg_price: Number(kgRow?.unit_price ?? 2.75),
          min_kg: Number(kgRow?.min_order_quantity ?? 5),
          max_kg: Number(kgRow?.max_order_quantity ?? 50),
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
          max_order_quantity: cachedPricing.max_bags,
          free_delivery_threshold: cachedPricing.free_delivery_threshold,
          standard_delivery_fee: cachedPricing.standard_delivery_fee,
          updated_at: new Date().toISOString(),
        },
        {
          pricing_type: "per_kg",
          unit_price: cachedPricing.kg_price,
          min_order_quantity: cachedPricing.min_kg,
          max_order_quantity: cachedPricing.max_kg,
          updated_at: new Date().toISOString(),
        },
      ]);
    } catch {}
    return cachedPricing;
  }
}
