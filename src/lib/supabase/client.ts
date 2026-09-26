import { createBrowserClient } from "@supabase/ssr";
import type { Order, OrderReview } from "@/types";

/**
 * Creates a browser-compatible Supabase client for client components.
 */
export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

  return createBrowserClient(supabaseUrl, supabaseKey);
}

/**
 * Fetches approved reviews from Supabase with photos joined.
 */
export async function fetchApprovedReviews(): Promise<OrderReview[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("order_reviews")
      .select("*, photos:review_photos(*)")
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error || !data) {
      return [];
    }

    return data as OrderReview[];
  } catch (err) {
    console.error("Failed to fetch approved reviews:", err);
    return [];
  }
}

/**
 * Fetches order details along with driver pickup/drop-off proofs.
 */
export async function fetchOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("orders")
      .select("*, proofs:order_proofs(*), user:users(*)")
      .eq("id", orderId)
      .single();

    if (error || !data) {
      return null;
    }

    return data as Order;
  } catch (err) {
    console.error(`Failed to fetch order ${orderId}:`, err);
    return null;
  }
}

/**
 * Generates temporary signed URL for private proof images (90-day retention).
 */
export async function getSignedProofUrl(storagePath: string): Promise<string> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("order-proofs")
      .createSignedUrl(storagePath, 3600); // 1 hour validity

    if (error || !data) {
      return "/brand/logo-badge.jpg";
    }

    return data.signedUrl;
  } catch (err) {
    console.error("Failed to create signed proof URL:", err);
    return "/brand/logo-badge.jpg";
  }
}

/**
 * Submits customer review with up to 3 attached photos.
 */
export async function submitCustomerReview({
  orderId,
  userId,
  rating,
  comment,
  photoUrls,
}: {
  orderId: string;
  userId: string;
  rating: number;
  comment: string;
  photoUrls: string[];
}): Promise<boolean> {
  try {
    const supabase = createClient();
    const { data: review, error: revError } = await supabase
      .from("order_reviews")
      .insert({
        order_id: orderId,
        user_id: userId,
        rating,
        comment,
        status: "pending",
      })
      .select()
      .single();

    if (revError || !review) {
      return false;
    }

    if (photoUrls.length > 0) {
      const photoPayload = photoUrls.slice(0, 3).map((url, idx) => ({
        review_id: review.id,
        photo_url: url,
        display_order: idx + 1,
      }));

      await supabase.from("review_photos").insert(photoPayload);
    }

    return true;
  } catch (err) {
    console.error("Failed to submit customer review:", err);
    return false;
  }
}
