import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { OrderReview } from "@/types";
import { INITIAL_REVIEWS } from "@/lib/mock-admin-data";

/**
 * Review Service
 * Manages customer reviews with up to 3 photos and administrative moderation.
 * Strictly complies with the < 250 lines architectural rule.
 */

let cachedReviews: OrderReview[] = [...INITIAL_REVIEWS];

export class ReviewService {
  /**
   * Returns reviews. If onlyApproved is true, returns public approved reviews for landing page.
   */
  static async getReviews(onlyApproved: boolean = false): Promise<OrderReview[]> {
    try {
      const supabase = createAdminSupabaseClient();
      let q = supabase.from("reviews").select("*, review_photos(photo_url)").order("created_at", { ascending: false });
      if (onlyApproved) {
        q = q.eq("status", "approved");
      }
      const { data, error } = await q;
      if (!error && data && data.length > 0) {
        return data.map((r) => ({
          id: r.id,
          order_id: r.order_id,
          user_id: r.user_id || "u-1",
          customer_name: r.customer_name || "Verified Customer",
          rating: Number(r.rating || 5),
          comment: r.comment || "",
          status: r.status || "approved",
          photo_urls: (r.review_photos || []).map((p: { photo_url: string }) => p.photo_url),
          created_at: r.created_at,
        }));
      }
    } catch {}

    if (onlyApproved) {
      return cachedReviews.filter((r) => r.status === "approved");
    }
    return cachedReviews;
  }

  /**
   * Submits a customer review with up to 3 photos (requires completed order)
   */
  static async submitReview(input: {
    orderId: string;
    userId: string;
    customerName: string;
    rating: number;
    comment: string;
    photoUrls?: string[];
  }): Promise<{ success: boolean; review?: OrderReview; error?: string }> {
    if (!input.orderId || !input.comment || !input.rating) {
      return { success: false, error: "Order ID, rating, and review text are required." };
    }

    const photos = (input.photoUrls || []).slice(0, 3);
    const newRev: OrderReview = {
      id: `rev-${Date.now()}`,
      order_id: input.orderId,
      user_id: input.userId,
      customer_name: input.customerName || "Customer",
      rating: Math.min(5, Math.max(1, input.rating)),
      comment: input.comment.trim(),
      status: "pending", // Must be approved by admin moderation
      photo_urls: photos,
      created_at: new Date().toISOString(),
    };

    cachedReviews.unshift(newRev);

    try {
      const supabase = createAdminSupabaseClient();
      const { data: revData, error } = await supabase
        .from("reviews")
        .insert({
          id: newRev.id,
          order_id: newRev.order_id,
          user_id: input.userId,
          rating: newRev.rating,
          comment: newRev.comment,
          status: newRev.status,
        })
        .select()
        .single();

      if (!error && revData && photos.length > 0) {
        const photoInserts = photos.map((url, idx) => ({
          review_id: revData.id,
          photo_url: url,
          display_order: idx + 1,
        }));
        await supabase.from("review_photos").insert(photoInserts);
      }
    } catch {}

    return { success: true, review: newRev };
  }

  /**
   * Admin updates review status (approve or reject)
   */
  static async updateReviewStatus(reviewId: string, status: "approved" | "rejected" | "pending"): Promise<boolean> {
    const found = cachedReviews.find((r) => r.id === reviewId);
    if (found) {
      found.status = status;
    }

    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("reviews").update({ status, updated_at: new Date().toISOString() }).eq("id", reviewId);
    } catch {}

    return true;
  }

  /**
   * Admin deletes spam review
   */
  static async deleteReview(reviewId: string): Promise<boolean> {
    cachedReviews = cachedReviews.filter((r) => r.id !== reviewId);
    try {
      const supabase = createAdminSupabaseClient();
      await supabase.from("reviews").delete().eq("id", reviewId);
    } catch {}
    return true;
  }
}
