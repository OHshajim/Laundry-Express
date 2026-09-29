import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  street_address: string;
  apt_unit?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  created_at?: string;
}

let cachedAddresses: UserAddress[] = [];

export class AddressService {
  static async getAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const supabase = createAdminSupabaseClient();
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) {
        return data as UserAddress[];
      }
    } catch {}

    return cachedAddresses
      .filter((a) => a.user_id === userId)
      .sort((a, b) => (b.is_default ? 1 : 0) - (a.is_default ? 1 : 0));
  }

  static async saveAddress(addr: Partial<UserAddress>): Promise<UserAddress> {
    const userId = addr.user_id || "";
    const street = (addr.street_address || "").trim();
    const zip = (addr.zip_code || "").trim();

    // Check for existing address for this user with same street and zip
    const existing = cachedAddresses.find(
      (a) => a.user_id === userId && a.street_address.trim().toLowerCase() === street.toLowerCase() && a.zip_code.trim() === zip
    );

    const id = addr.id || existing?.id || `addr-${Date.now()}`;
    const isDefault = addr.is_default ?? (existing ? existing.is_default : cachedAddresses.filter((a) => a.user_id === userId).length === 0);

    const full: UserAddress = {
      id,
      user_id: userId,
      label: addr.label || existing?.label || "Home",
      street_address: street,
      apt_unit: addr.apt_unit ?? existing?.apt_unit ?? "",
      city: addr.city || existing?.city || "Lake in the Hills",
      state: addr.state || existing?.state || "IL",
      zip_code: zip || existing?.zip_code || "60156",
      is_default: isDefault,
      created_at: existing?.created_at || new Date().toISOString(),
    };

    if (full.is_default && userId) {
      cachedAddresses.forEach((a) => {
        if (a.user_id === userId && a.id !== id) a.is_default = false;
      });
    }

    const idx = cachedAddresses.findIndex((a) => a.id === id);
    if (idx >= 0) cachedAddresses[idx] = full;
    else cachedAddresses.unshift(full);

    try {
      const supabase = createAdminSupabaseClient();
      if (full.is_default && userId) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId);
      }
      await supabase.from("user_addresses").upsert(full);
    } catch {}

    return full;
  }

  static async deleteAddress(id: string): Promise<boolean> {
    cachedAddresses = cachedAddresses.filter((a) => a.id !== id);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("user_addresses").delete().eq("id", id);
    } catch {}
    return true;
  }
}
