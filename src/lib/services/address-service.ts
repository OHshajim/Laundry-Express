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
      const { data, error } = await supabase.from("user_addresses").select("*").eq("user_id", userId);
      if (!error && data && data.length > 0) {
        return data as UserAddress[];
      }
    } catch {}
    return cachedAddresses.filter((a) => a.user_id === userId);
  }

  static async saveAddress(addr: Partial<UserAddress>): Promise<UserAddress> {
    const id = addr.id || `addr-${Date.now()}`;
    const full: UserAddress = {
      id,
      user_id: addr.user_id || "cust-demo-001",
      label: addr.label || "Home",
      street_address: addr.street_address || "",
      apt_unit: addr.apt_unit || "",
      city: addr.city || "Lake in the Hills",
      state: addr.state || "IL",
      zip_code: addr.zip_code || "60156",
      is_default: addr.is_default ?? false,
      created_at: new Date().toISOString(),
    };

    const idx = cachedAddresses.findIndex((a) => a.id === id);
    if (idx >= 0) cachedAddresses[idx] = full;
    else cachedAddresses.push(full);

    try {
      const supabase = createAdminSupabaseClient();
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
