"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CUSTOMER_REVIEWS } from "@/lib/mock-customer-data";
import { ReviewSubmitForm } from "@/components/dashboard/review-submit-form";
import type { OrderReview } from "@/types";

/**
 * Customer Ratings & Reviews Page (/dashboard/ratings)
 * Implements AGENTS.md 5.d:
 * 1 to 5 star rating picker, text feedback, and 3 compressed photo attachments.
 */
export default function CustomerRatingsPage() {
  const [reviews, setReviews] = React.useState<OrderReview[]>(CUSTOMER_REVIEWS);

  const handleReviewSubmitted = (newReview: OrderReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-pink-100">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          My Ratings &amp; Reviews
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Share your experience with our wash, fold, and delivery service to help other neighbors.
        </p>
      </div>

      {/* Review Submission Form Component */}
      <ReviewSubmitForm onReviewSubmitted={handleReviewSubmitted} />

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
              <Badge
                variant={rev.status === "approved" ? "success" : "warning"}
                className="text-[10px] uppercase font-bold"
              >
                {rev.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">&ldquo;{rev.comment}&rdquo;</p>

            {rev.photos && rev.photos.length > 0 && (
              <div className="flex gap-3 pt-2">
                {rev.photos.map((p) => (
                  <div
                    key={p.id}
                    className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs"
                  >
                    <Image
                      src={p.photo_url}
                      alt="Review attachment"
                      fill
                      className="object-cover"
                    />
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
