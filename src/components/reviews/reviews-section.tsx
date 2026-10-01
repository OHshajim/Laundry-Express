"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { ReviewCard } from "./review-card";
import type { OrderReview } from "@/types";

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/reviews?public=true")
      .then((res) => res.json())
      .then((data) => {
        if (data.reviews && Array.isArray(data.reviews)) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && reviews.length === 0) return null;

  // Duplicate for seamless loop — requires at least 3 reviews; fewer shows static grid
  const showCarousel = reviews.length >= 3;
  const looped = showCarousel ? [...reviews, ...reviews] : reviews;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-50/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-primary text-xs font-bold">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>Verified Customer Stories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Loved Across McHenry County
          </h2>
          <p className="text-sm text-slate-500">
            Real reviews from busy families, Airbnb hosts, and professionals.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-slate-50 border border-slate-100 animate-pulse" />
          ))}
        </div>
      ) : showCarousel ? (
        <div className="relative w-full">
          {/* Left/right fade masks */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r from-pink-50/70 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l from-pink-50/70 to-transparent" />

          <div className="reviews-carousel flex gap-6 w-max">
            {looped.map((rev, i) => (
              <div key={`${rev.id}-${i}`} className="w-80 shrink-0">
                <ReviewCard review={rev} />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      )}

      <style>{`
        .reviews-carousel {
          animation: reviews-scroll 28s linear infinite;
        }
        .reviews-carousel:hover {
          animation-play-state: paused;
        }
        @keyframes reviews-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .reviews-carousel { animation: none; }
        }
      `}</style>
    </section>
  );
}
