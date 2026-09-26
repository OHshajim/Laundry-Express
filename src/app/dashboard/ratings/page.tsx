"use client";

import * as React from "react";
import Image from "next/image";
import { Star, MessageSquare, Camera, CheckCircle2, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CUSTOMER_REVIEWS, CUSTOMER_ORDERS } from "@/lib/mock-customer-data";
import type { OrderReview } from "@/types";

/**
 * Customer Ratings & Reviews Page (/dashboard/ratings)
 *
 * Implements:
 * - Customer's own submitted reviews with admin moderation status
 * - Interactive form to rate any completed order without a review yet
 * - 1 to 5 star rating picker, text feedback, and photo attachments
 */
export default function CustomerRatingsPage() {
  const [reviews, setReviews] = React.useState<OrderReview[]>(CUSTOMER_REVIEWS);
  const [selectedOrderId, setSelectedOrderId] = React.useState("ord-prev-1");
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [submittedMessage, setSubmittedMessage] = React.useState(false);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newReview: OrderReview = {
      id: `rev-${Date.now()}`,
      order_id: selectedOrderId,
      user_id: "u-1",
      rating,
      comment: comment.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: { full_name: "Sarah Jenkins" },
    };

    setReviews([newReview, ...reviews]);
    setComment("");
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 border-b border-pink-100">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          My Ratings &amp; Reviews
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Share your experience with our wash, fold, and delivery service to help other neighbors.
        </p>
      </div>

      {/* Submit New Rating Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary-pale text-primary flex items-center justify-center font-bold">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 text-base">Rate a Completed Order</h3>
            <span className="text-[11px] text-slate-500">Verified customer feedback</span>
          </div>
        </div>

        {submittedMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Thank you! Your review has been submitted for moderation and will appear shortly.</span>
          </div>
        )}

        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Order to Rate</label>
              <select
                value={selectedOrderId}
                onChange={(e) => setSelectedOrderId(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {CUSTOMER_ORDERS.map((ord) => (
                  <option key={ord.id} value={ord.id}>
                    Order #{ord.order_number} ({ord.pickup_date} • {ord.bag_count} Bag(s))
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
              <div className="flex items-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`h-6 w-6 ${
                        star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">{rating} of 5 Stars</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Written Feedback</label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the folding, fragrance, and delivery punctuality?"
              className="w-full p-3 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button type="submit" className="bg-primary hover:bg-primary-dark text-white shadow-md text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Submit Review</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Submitted Reviews History */}
      <div className="space-y-4">
        <h3 className="font-black text-slate-900 text-base">Your Previously Submitted Reviews</h3>
        {reviews.map((rev) => (
          <div key={rev.id} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">Verified Experience</span>
              </div>
              <Badge variant={rev.status === "approved" ? "success" : "warning"} className="text-[10px] uppercase font-bold">
                {rev.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">&ldquo;{rev.comment}&rdquo;</p>

            {rev.photos && rev.photos.length > 0 && (
              <div className="flex gap-3 pt-2">
                {rev.photos.map((p) => (
                  <div key={p.id} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200">
                    <Image src={p.photo_url} alt="Review attachment" fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
