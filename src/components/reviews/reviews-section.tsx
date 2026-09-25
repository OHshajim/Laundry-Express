"use client";

import * as React from "react";
import { Star, Sparkles, MessageSquareHeart } from "lucide-react";
import { ReviewCard } from "./review-card";
import { ReviewFormDialog } from "./review-form-dialog";
import { Button } from "@/components/ui/button";
import type { OrderReview } from "@/types";

const INITIAL_REVIEWS: OrderReview[] = [
  {
    id: "rev-1",
    order_id: "ord-101",
    user_id: "user-1",
    rating: 5,
    comment:
      "Unbelievable speed! I left 2 bags outside my porch at 8:30 AM, got photo confirmation in minutes, and had fresh smelling folded clothes by afternoon. And the delivery was totally FREE!",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    user: { full_name: "Sarah Jenkins" },
    photos: [
      {
        id: "p1",
        review_id: "rev-1",
        photo_url: "/brand/logo-badge.jpg",
        display_order: 1,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: "rev-2",
    order_id: "ord-102",
    user_id: "user-2",
    rating: 5,
    comment:
      "The Seventh Generation eco detergent left my son's baby blankets wonderfully soft with zero scent. The superhero driver took a clear drop-off photo right by the door.",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    user: { full_name: "Marcus Rodriguez" },
  },
  {
    id: "rev-3",
    order_id: "ord-103",
    user_id: "user-3",
    rating: 5,
    comment:
      "We run an Airbnb and use their per-KG weight service twice a week. Precision scaling, transparent billing, and 100% reliable pickup during the 1pm-6pm slot.",
    status: "approved",
    created_at: new Date(Date.now() - 86400000 * 8).toISOString(),
    user: { full_name: "Elena Rostova" },
  },
];

export function ReviewsSection() {
  const [reviews, setReviews] = React.useState<OrderReview[]>(INITIAL_REVIEWS);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <section id="reviews" className="py-20 bg-slate-50/60 border-y border-slate-200/60 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold mb-3">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>4.9 / 5.0 Star Customer Rating</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Verified Clean Experiences
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Real reviews from real doorstep customers. Every review is verified against a completed order and inspected by our team.
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setDialogOpen(true)}
            className="self-start md:self-auto shadow-xs"
          >
            <MessageSquareHeart className="h-4 w-4 mr-2 text-rose-500" />
            Review a Completed Order
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev) => (
            <ReviewCard key={rev.id} review={rev} />
          ))}
        </div>
      </div>

      <ReviewFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orderNumber="LX-2026-0042"
        onSubmitted={() => {
          // Callback after review submission
        }}
      />
    </section>
  );
}
