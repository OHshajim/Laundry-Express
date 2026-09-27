"use client";

import * as React from "react";
import { Star, MessageSquareCheck } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { OrderReview } from "@/types";

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchReviews = React.useCallback(() => {
    fetch("/api/reviews?public=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  React.useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (!loading && reviews.length === 0) {
    return null; // Gracefully omit reviews section on home page if no reviews have been submitted yet
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-primary text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved Across McHenry County
          </h2>
          <p className="text-sm text-slate-500">
            Real doorstep reviews from busy families, Airbnb hosts, and professionals.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-slate-50 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((rev) => (
              <ReviewCard key={rev.id} review={rev} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
