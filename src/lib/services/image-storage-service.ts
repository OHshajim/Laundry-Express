import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { UserDbService } from "@/lib/services/user-db-service";

/**
 * Image Storage Service
 * Primary Supabase image hosting service for Laundry Express:
 * - Manages 'avatars', 'order-proofs', and 'review-photos' storage buckets
 * - Uploads new avatars first, persists to public.users, then cleans up previous avatar files
 * - Generates public CDN URLs
 * - Strictly complies with the 100-250 lines architectural rule
 */

export const STORAGE_BUCKETS = {
  AVATARS: "avatars",
  ORDER_PROOFS: "order-proofs",
  REVIEW_PHOTOS: "review-photos",
} as const;

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export class ImageStorageService {
  /**
   * Uploads and persists a new avatar, updates DB, then deletes previous avatar from storage
   */
  static async uploadAvatar(
    userId: string,
    fileBuffer: Buffer | Blob | Uint8Array,
    mimeType: string = "image/jpeg"
  ): Promise<UploadResult> {
    try {
      const supabase = createAdminSupabaseClient();

      // 1. Retrieve user's existing avatar URL before updating
      let oldAvatarUrl: string | null = null;
      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        if (isUUID) {
          const { data: existingUser } = await supabase
            .from("users")
            .select("avatar_url")
            .eq("id", userId)
            .maybeSingle();
          oldAvatarUrl = existingUser?.avatar_url || null;
        }
      } catch {
        // Continue if profile read fails
      }

      // 2. Upload the new avatar to storage first
      const ext = mimeType.split("/")[1]?.replace("jpeg", "jpg") || "jpg";
      const filePath = `user-${userId}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        console.warn("Storage: Supabase avatar upload warning:", error.message);
        return {
          success: false,
          error: error.message || "Failed to upload avatar to storage.",
        };
      }

      // 3. Generate public CDN access URL
      const { data: publicData } = supabase.storage
        .from(STORAGE_BUCKETS.AVATARS)
        .getPublicUrl(data.path);

      const publicUrl = publicData.publicUrl;

      // 4. Persist new avatar URL into public.users database
      await UserDbService.updateAvatar(userId, publicUrl);

      // 5. Delete previous avatar file from storage after new one is safely uploaded and saved
      if (oldAvatarUrl && oldAvatarUrl.includes(`/${STORAGE_BUCKETS.AVATARS}/`)) {
        try {
          const parts = oldAvatarUrl.split(`/${STORAGE_BUCKETS.AVATARS}/`);
          if (parts[1]) {
            const oldPath = decodeURIComponent(parts[1].split("?")[0]);
            if (oldPath && oldPath !== filePath) {
              await supabase.storage.from(STORAGE_BUCKETS.AVATARS).remove([oldPath]);
            }
          }
        } catch {
          // Non-blocking cleanup
        }
      }

      return {
        success: true,
        url: publicUrl,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Storage service communication error.";
      console.warn("Storage: Avatar upload exception:", msg);
      return {
        success: false,
        error: msg,
      };
    }
  }

  /**
   * Uploads driver scale and doorstep verification photos
   */
  static async uploadOrderProof(
    orderId: string,
    proofType: "pickup" | "dropoff" | "damage",
    fileBuffer: Buffer | Blob | Uint8Array,
    mimeType: string = "image/jpeg"
  ): Promise<UploadResult> {
    try {
      const supabase = createAdminSupabaseClient();
      const ext = mimeType.split("/")[1] || "jpg";
      const filePath = `order-${orderId}/${proofType}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.ORDER_PROOFS)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(STORAGE_BUCKETS.ORDER_PROOFS)
        .getPublicUrl(data.path);

      return { success: true, url: publicData.publicUrl };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload proof";
      return { success: false, error: msg };
    }
  }

  /**
   * Uploads verified customer review photos (up to 3 per completed order)
   */
  static async uploadReviewPhoto(
    orderId: string,
    photoIndex: number,
    fileBuffer: Buffer | Blob | Uint8Array,
    mimeType: string = "image/jpeg"
  ): Promise<UploadResult> {
    try {
      const supabase = createAdminSupabaseClient();
      const ext = mimeType.split("/")[1] || "jpg";
      const filePath = `reviews/${orderId}-photo-${photoIndex}-${Date.now()}.${ext}`;

      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKETS.REVIEW_PHOTOS)
        .upload(filePath, fileBuffer, {
          contentType: mimeType,
          upsert: true,
        });

      if (error) {
        return { success: false, error: error.message };
      }

      const { data: publicData } = supabase.storage
        .from(STORAGE_BUCKETS.REVIEW_PHOTOS)
        .getPublicUrl(data.path);

      return { success: true, url: publicData.publicUrl };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to upload review photo";
      return { success: false, error: msg };
    }
  }

  /**
   * Deletes an uploaded asset from a specified bucket
   */
  static async deleteAsset(bucket: string, path: string): Promise<boolean> {
    try {
      const supabase = createAdminSupabaseClient();
      const { error } = await supabase.storage.from(bucket).remove([path]);
      return !error;
    } catch {
      return false;
    }
  }
}
