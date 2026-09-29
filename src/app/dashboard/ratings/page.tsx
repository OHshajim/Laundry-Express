"use client";

import * as React from "react";
import Image from "next/image";
import { Star, PenLine, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewSubmitForm } from "@/components/dashboard/review-submit-form";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import type { Order, OrderReview } from "@/types";

export default function CustomerRatingsPage() {
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      fetch("/api/reviews").then((res) => res.json()).catch(() => ({ reviews: [] })),
      fetch("/api/orders").then((res) => res.json()).catch(() => ({ orders: [] })),
    ]).then(([revData, ordData]) => {
      if (Array.isArray(revData.reviews)) setReviews(revData.reviews);
      if (Array.isArray(ordData.orders)) setOrders(ordData.orders);
      setIsLoading(false);
    });
  }, []);

  const reviewedOrderIds = React.useMemo(
    () => new Set(reviews.map((r) => r.order_id)),
    [reviews]
  );

  const completedOrders = React.useMemo(
    () => orders.filter((o) => o.order_status === "completed"),
    [orders]
  );

  const canReview = completedOrders.some((o) => !reviewedOrderIds.has(o.id));

  const handleReviewSubmitted = (newReview: OrderReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
  };

  return (
    <DashboardPageLayout
      activeSection="ratings"
      title="Ratings & Reviews"
      subtitle="Share your experience with neighbors"
    >
      <div className="space-y-6 animate-in fade-in duration-200">
        {/* Header row with toggle button */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-black text-slate-900 text-base">Your Reviews</h3>
            <p className="text-xs text-slate-500 mt-0.5">Only completed orders are eligible for a review.</p>
          </div>
          {canReview && (
            <Button
              variant={showForm ? "outline" : "hero"}
              size="sm"
              onClick={() => setShowForm((v) => !v)}
              className="gap-2 font-bold"
            >
              {showForm ? (
                <><X className="h-3.5 w-3.5" /><span>Cancel</span></>
              ) : (
                <><PenLine className="h-3.5 w-3.5" /><span>Write a Review</span></>
              )}
            </Button>
          )}
        </div>

        {/* Collapsible review form */}
        {showForm && (
          <ReviewSubmitForm
            orders={orders}
            reviewedOrderIds={reviewedOrderIds}
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}

        {/* Past reviews list */}
        {!isLoading && reviews.length === 0 && (
          <div className="p-10 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
            {completedOrders.length === 0
              ? "No completed orders yet. Reviews are available once an order is delivered."
              : "No reviews submitted yet. Use \"Write a Review\" above to share your feedback."}
          </div>
        )}

        {reviews.map((rev) => (
          <div key={rev.id} className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < rev.rating ? "fill-amber-400" : "text-slate-200"}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-800">Verified Experience</span>
              </div>
              <Badge variant={rev.status === "approved" ? "success" : "warning"} className="text-[10px] uppercase font-bold">
                {rev.status}
              </Badge>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-medium">&ldquo;{rev.comment}&rdquo;</p>

            {rev.photo_urls && rev.photo_urls.length > 0 && (
              <div className="flex gap-3 pt-1">
                {rev.photo_urls.map((url, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                    <Image src={url} alt="Review photo" fill sizes="64px" className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <p className="text-[11px] text-slate-400">
              Order #{orders.find((o) => o.id === rev.order_id)?.order_number || rev.order_id.slice(0, 8)}
            </p>
          </div>
        ))}
      </div>
    </DashboardPageLayout>
  );
}
