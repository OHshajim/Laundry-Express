import { AddressService } from "@/lib/services/address-service";
import { UserDbService } from "@/lib/services/user-db-service";
import type { User } from "@/types";

export interface CheckoutContactPayload {
  customer_phone?: string;
  street_address?: string;
  apt_unit?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

/**
 * Persists address and phone number from order checkout into user profile and address book.
 */
export async function syncUserOrderContact(
  user: User,
  payload: CheckoutContactPayload
): Promise<void> {
  if (!user?.id) return;

  const phone = (payload.customer_phone || "").trim();
  const street = (payload.street_address || "").trim();
  const apt = (payload.apt_unit || "").trim();
  const city = (payload.city || "").trim();
  const state = (payload.state || "").trim().toUpperCase();
  const zip = (payload.zip_code || "").trim();

  // 1. Save or update address in user_addresses table
  if (street && city && zip) {
    try {
      await AddressService.saveAddress({
        user_id: user.id,
        label: "Home",
        street_address: street,
        apt_unit: apt || undefined,
        city,
        state,
        zip_code: zip,
        is_default: true,
      });
    } catch (error) {
      console.error("[checkout-sync] Failed to save address:", error);
    }
  }

  // 2. Update user profile in public.users (phone and address)
  const profileUpdates: Partial<Pick<User, "phone" | "address">> = {};
  if (phone) profileUpdates.phone = phone;
  if (street && city && zip) {
    profileUpdates.address = [street, apt ? `Apt ${apt}` : "", city, `${state} ${zip}`].filter(Boolean).join(", ");
  }

  if (Object.keys(profileUpdates).length > 0) {
    try {
      await UserDbService.updateProfile(user.id, profileUpdates, user.email);
    } catch (error) {
      console.error("[checkout-sync] Failed to update user profile:", error);
    }
  }
}
