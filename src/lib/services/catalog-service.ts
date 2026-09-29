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

const isUuid = (val?: string): boolean =>
  Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

let cachedDetergents: DetergentItem[] = [];

export class CatalogService {
  static async getCatalog(): Promise<{ detergents: DetergentItem[] }> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase
        .from("catalog_items")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        cachedDetergents = data
          .filter((d) => d.category === "detergent")
          .map((d) => ({
            id: d.id,
            name: d.name,
            type: d.item_type || "liquid",
            brand: d.brand || "Standard",
            price: Number(d.price ?? 0),
            description: d.description || "",
            is_active: d.is_active ?? true,
          }));
      }
    } catch {}
    return { detergents: cachedDetergents };
  }

  static async saveDetergent(item: Partial<DetergentItem>): Promise<DetergentItem> {
    const rawId = item.id || `det-${Date.now()}`;
    const id = isUuid(rawId) ? rawId : crypto.randomUUID();

    const full: DetergentItem = {
      id,
      name: item.name || "Eco Detergent",
      type: item.type || "liquid",
      brand: item.brand || "Standard",
      price: Number(item.price ?? 0),
      description: item.description || "Wash formula",
      is_active: item.is_active ?? true,
    };

    const idx = cachedDetergents.findIndex((d) => d.id === full.id);
    if (idx >= 0) cachedDetergents[idx] = full;
    else cachedDetergents.push(full);

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("catalog_items").upsert({
        id: full.id,
        category: "detergent",
        name: full.name,
        brand: full.brand,
        item_type: full.type,
        price: full.price,
        description: full.description,
        is_active: full.is_active,
        in_stock: full.is_active,
      });
    } catch {}

    return full;
  }

  static async deleteItem(id: string): Promise<boolean> {
    cachedDetergents = cachedDetergents.filter((d) => d.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      if (isUuid(id)) {
        await supabase.from("catalog_items").delete().eq("id", id);
      }
    } catch {}
    return true;
  }
}
