import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface DetergentItem {
  id: string;
  name: string;
  type: "liquid" | "powder" | "pods";
  brand: string;
  price: number;
  description: string;
  is_active: boolean;
}

export interface TemperatureOption {
  id: string;
  name: string;
  type: "cold" | "warm" | "hot";
  price: number;
  description: string;
  is_active: boolean;
}

let cachedDetergents: DetergentItem[] = [];
let cachedTemps: TemperatureOption[] = [];

export class CatalogService {
  static async getCatalog(): Promise<{ detergents: DetergentItem[]; temperatures: TemperatureOption[] }> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data: catData, error } = await supabase.from("catalog_items").select("*").order("created_at", { ascending: true });
      if (!error && catData && catData.length > 0) {
        cachedDetergents = catData
          .filter((c) => c.category === "detergent")
          .map((d) => ({
            id: d.id,
            name: d.name,
            type: (d.item_type || d.type || "liquid") as "liquid" | "powder" | "pods",
            brand: d.brand || "Standard",
            price: Number(d.price ?? 0),
            description: d.description || "",
            is_active: d.is_active ?? true,
          }));

        cachedTemps = catData
          .filter((c) => c.category === "temperature")
          .map((t) => ({
            id: t.id,
            name: t.name,
            type: (t.item_type || t.type || "cold") as "cold" | "warm" | "hot",
            price: Number(t.price ?? 0),
            description: t.description || "",
            is_active: t.is_active ?? true,
          }));
      }
    } catch {}
    return { detergents: cachedDetergents, temperatures: cachedTemps };
  }

  static async saveDetergent(item: Partial<DetergentItem>): Promise<DetergentItem> {
    const id = item.id || `det-${Date.now()}`;
    const full: DetergentItem = {
      id,
      name: item.name || "Custom Detergent",
      type: item.type || "liquid",
      brand: item.brand || "Standard",
      price: item.price ?? 0,
      description: item.description || "",
      is_active: item.is_active ?? true,
    };

    const idx = cachedDetergents.findIndex((d) => d.id === id);
    if (idx >= 0) cachedDetergents[idx] = full;
    else cachedDetergents.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("catalog_items").upsert({
        id,
        category: "detergent",
        name: full.name,
        brand: full.brand,
        item_type: full.type,
        price: full.price,
        description: full.description,
        is_active: full.is_active,
        in_stock: true,
      });
    } catch {}

    return full;
  }

  static async deleteDetergent(id: string): Promise<boolean> {
    cachedDetergents = cachedDetergents.filter((d) => d.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("catalog_items").delete().eq("id", id);
    } catch {}
    return true;
  }

  static async saveTemperature(item: Partial<TemperatureOption>): Promise<TemperatureOption> {
    const id = item.id || `temp-${Date.now()}`;
    const full: TemperatureOption = {
      id,
      name: item.name || "Custom Temp",
      type: item.type || "cold",
      price: item.price ?? 0,
      description: item.description || "",
      is_active: item.is_active ?? true,
    };

    const idx = cachedTemps.findIndex((t) => t.id === id);
    if (idx >= 0) cachedTemps[idx] = full;
    else cachedTemps.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("catalog_items").upsert({
        id,
        category: "temperature",
        name: full.name,
        item_type: full.type,
        price: full.price,
        description: full.description,
        is_active: full.is_active,
        in_stock: true,
      });
    } catch {}

    return full;
  }
}
