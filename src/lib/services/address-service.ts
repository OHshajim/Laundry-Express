import { randomUUID } from "node:crypto";
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

    const { data: matches, error: matchError } = await supabase.from("user_addresses")
      .select("*").eq("user_id", userId).eq("street_address", street).eq("zip_code", zip).limit(1);
    if (matchError) throw new Error(matchError.message);
    const existing = (matches?.[0] as UserAddress | undefined) || null;
    const { count, error: countError } = await supabase.from("user_addresses")
      .select("id", { count: "exact", head: true }).eq("user_id", userId);
    if (countError) throw new Error(countError.message);

    const id = addr.id || existing?.id || `addr-${randomUUID()}`;
    const isDefault = addr.is_default ?? (existing ? existing.is_default : count === 0);

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

    return full;
  }

  static async deleteAddress(id: string, userId: string): Promise<boolean> {
    const supabase = createAdminSupabaseClient();
    const { count, error: countError } = await supabase
      .from("user_addresses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);
    if (countError) throw new Error(countError.message);
    if (count !== null && count <= 1) {
      throw new Error("You must keep at least one saved address on file.");
    }

    const { data: toDelete } = await supabase
      .from("user_addresses")
      .select("is_default")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    const { data, error } = await supabase
      .from("user_addresses")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return false;

    if (toDelete?.is_default) {
      const { data: remaining } = await supabase
        .from("user_addresses")
        .select("id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle();
      if (remaining?.id) {
        await supabase
          .from("user_addresses")
          .update({ is_default: true })
          .eq("id", remaining.id);
      }
    }

    return true;
  }
}
