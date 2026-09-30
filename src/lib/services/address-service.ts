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
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("user_addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []) as UserAddress[];
  }

  static async saveAddress(addr: Partial<UserAddress>): Promise<UserAddress> {
    const userId = addr.user_id || "";
    const street = (addr.street_address || "").trim();
    const zip = (addr.zip_code || "").trim();
    if (!userId || !street || !addr.city?.trim() || !addr.state?.trim() || !zip) {
      throw new Error("A complete address and authenticated user are required.");
    }

    const supabase = createAdminSupabaseClient();
    let persistedAddress: UserAddress | null = null;
    if (addr.id) {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("id", addr.id)
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      persistedAddress = data as UserAddress | null;
      if (!persistedAddress) throw new Error("Address not found.");
    }

    // Check for existing address for this user with same street and zip
    const existing = cachedAddresses.find(
      (a) => a.user_id === userId && a.street_address.trim().toLowerCase() === street.toLowerCase() && a.zip_code.trim() === zip
    );

    const id = addr.id || existing?.id || `addr-${Date.now()}`;
    const isDefault = addr.is_default ?? (existing ? existing.is_default : cachedAddresses.filter((a) => a.user_id === userId).length === 0);

    const full: UserAddress = {
      id,
      user_id: userId,
      label: addr.label || persistedAddress?.label || existing?.label || "Home",
      street_address: street,
      apt_unit: addr.apt_unit ?? persistedAddress?.apt_unit ?? existing?.apt_unit ?? "",
      city: addr.city?.trim() || persistedAddress?.city || existing?.city || "",
      state: addr.state?.trim() || persistedAddress?.state || existing?.state || "",
      zip_code: zip,
      is_default: isDefault,
      created_at: persistedAddress?.created_at || existing?.created_at || new Date().toISOString(),
    };

    if (full.is_default) {
      const { error } = await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId);
      if (error) throw new Error(error.message);
    }
    const { error } = await supabase.from("user_addresses").upsert(full);
    if (error) throw new Error(error.message);

    cachedAddresses = cachedAddresses.filter((address) => address.id !== id);
    cachedAddresses.unshift(full);

    return full;
  }

  static async deleteAddress(id: string, userId: string): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return false;
    cachedAddresses = cachedAddresses.filter((address) => address.id !== id || address.user_id !== userId);
    return true;
  }
}
