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

const DEFAULT_DETERGENTS: DetergentItem[] = [
  { id: "det-tide-pods", name: "Tide PODS 4-in-1", type: "pods", brand: "Tide", price: 0, description: "Deep clean stain removal and fresh scent.", is_active: true },
  { id: "det-gain-flings", name: "Gain Flings Original", type: "pods", brand: "Gain", price: 0, description: "Long-lasting aroma with Oxi-boost power.", is_active: true },
  { id: "det-free-clear", name: "All Free & Clear (Hypoallergenic)", type: "liquid", brand: "All", price: 0, description: "100% dye-free & perfume-free for sensitive skin.", is_active: true },
  { id: "det-downy-softener", name: "Downy Fresh Fabric Conditioner", type: "liquid", brand: "Downy", price: 2.0, description: "Touch of softening silk & static control.", is_active: true },
  { id: "det-oxy-clean", name: "OxiClean Odor Blaster Powder", type: "powder", brand: "OxiClean", price: 2.5, description: "Tough gym stains and athletic fabric deodorizer.", is_active: true },
];

const DEFAULT_TEMPERATURES: TemperatureOption[] = [
  { id: "temp-cold", name: "Cold Wash (Eco & Color Safe)", type: "cold", price: 0, description: "Protects fabric fibers and preserves bright colors.", is_active: true },
  { id: "temp-warm", name: "Warm Wash (Standard Cotton)", type: "warm", price: 0, description: "Optimal for towels, bedsheets, and everyday cottons.", is_active: true },
  { id: "temp-hot", name: "Hot Wash (Sanitize & Whites)", type: "hot", price: 1.5, description: "Maximum stain removal and allergen sanitization.", is_active: true },
];

let cachedDetergents: DetergentItem[] = [...DEFAULT_DETERGENTS];
let cachedTemps: TemperatureOption[] = [...DEFAULT_TEMPERATURES];

export class CatalogService {
  static async getCatalog(): Promise<{ detergents: DetergentItem[]; temperatures: TemperatureOption[] }> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data: detData } = await supabase.from("detergents").select("*");
      if (detData && detData.length > 0) {
        cachedDetergents = detData.map((d) => ({
          id: d.id,
          name: d.name,
          type: d.type || "liquid",
          brand: d.brand || "Standard",
          price: Number(d.price ?? 0),
          description: d.description || "",
          is_active: d.is_active ?? true,
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
      brand: item.brand || "Eco Brand",
      price: item.price ?? 0,
      description: item.description || "Gentle laundry wash option.",
      is_active: item.is_active ?? true,
    };

    const idx = cachedDetergents.findIndex((d) => d.id === id);
    if (idx >= 0) cachedDetergents[idx] = full;
    else cachedDetergents.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("detergents").upsert({
        id,
        name: full.name,
        type: full.type,
        brand: full.brand,
        price: full.price,
        description: full.description,
        is_active: full.is_active,
      });
    } catch {}

    return full;
  }

  static async deleteDetergent(id: string): Promise<boolean> {
    cachedDetergents = cachedDetergents.filter((d) => d.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("detergents").delete().eq("id", id);
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
      description: item.description || "Wash cycle temperature.",
      is_active: item.is_active ?? true,
    };

    const idx = cachedTemps.findIndex((t) => t.id === id);
    if (idx >= 0) cachedTemps[idx] = full;
    else cachedTemps.push(full);

    return full;
  }
}
