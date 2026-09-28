"use client";

import * as React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ReviewSubmitForm } from "@/components/dashboard/review-submit-form";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import type { Order, OrderReview } from "@/types";

export default function CustomerRatingsPage() {
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

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

  const handleReviewSubmitted = (newReview: OrderReview) => {
    setReviews((prev) => [newReview, ...prev]);
  };

  return (
    <DashboardPageLayout
      activeSection="ratings"
      title="Ratings & Reviews"
      subtitle="Share your experience and 3-photo laundry uploads with neighbors"
    >
      <div className="space-y-8 animate-in fade-in duration-200">
        <ReviewSubmitForm orders={orders} onReviewSubmitted={handleReviewSubmitted} />

        <div className="space-y-4">
          <h3 className="font-black text-slate-900 text-base">Your Previously Submitted Reviews</h3>
          {reviews.length === 0 && !isLoading && (
            <div className="p-8 text-center rounded-3xl bg-white border border-slate-200 text-slate-400 text-xs">
              No reviews submitted yet. Rate one of your completed orders above to share your feedback.
            </div>
          )}
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
                    <div key={p.id} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 shadow-2xs">
                      <Image src={p.photo_url} alt="Review attachment" fill sizes="64px" className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardPageLayout>
  );
}
