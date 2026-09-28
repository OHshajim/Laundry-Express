"use client";

import * as React from "react";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { ReviewModerator } from "@/components/admin/review-moderator";
import type { OrderReview } from "@/types";

export default function ReviewsPage() {
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleApprove = async (id: string) => {
    setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
    try {
      await fetch("/api/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId: id, status: "approved" }) });
    } catch {}
  };

  const handleReject = async (id: string) => {
    setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)));
    try {
      await fetch("/api/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId: id, status: "rejected" }) });
    } catch {}
  };

  const handleDelete = async (id: string) => {
    setReviews((p) => p.filter((r) => r.id !== id));
    try {
      await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    } catch {}
  };

  const handleChangeStatus = (id: string, s: "pending" | "approved" | "rejected") => {
    if (s === "approved") handleApprove(id);
    else if (s === "rejected") handleReject(id);
    else setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: s } : r)));
  };

  return (
    <DashboardPageLayout
      activeSection="reviews"
      title="Customer Review Moderation"
      subtitle="Audit 3-photo laundry submissions, approve customer feedback, and moderate public ratings"
    >
      {isLoading ? (
        <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
      ) : (
        <ReviewModerator
          reviews={reviews}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
          onChangeStatus={handleChangeStatus}
        />
      )}
    </DashboardPageLayout>
  );
}
