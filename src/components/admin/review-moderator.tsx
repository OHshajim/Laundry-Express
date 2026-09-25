"use client";

import * as React from "react";
import Image from "next/image";
import { Star, CheckCircle, XCircle, Trash2, Clock, Image as ImageIcon } from "lucide-react";
import type { OrderReview } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReviewModeratorProps {
  reviews: OrderReview[];
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
  onDelete?: (reviewId: string) => void;
  onChangeStatus?: (reviewId: string, status: "pending" | "approved" | "rejected") => void;
}

/**
 * ReviewModerator Component
 *
 * Operational dashboard for inspecting customer submissions, changing review statuses,
 * verifying up to 3 attached photos, and permanently deleting invalid entries.
 */
export function ReviewModerator({
  reviews,
  onApprove,
  onReject,
  onDelete,
  onChangeStatus,
}: ReviewModeratorProps) {
  const [filter, setFilter] = React.useState<"all" | "pending" | "approved" | "rejected">("all");

  const filteredReviews = reviews.filter((r) => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const pendingCount = reviews.filter((r) => r.status === "pending").length;
  const approvedCount = reviews.filter((r) => r.status === "approved").length;
  const rejectedCount = reviews.filter((r) => r.status === "rejected").length;

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">Customer Review Moderation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage feedback status, audit 3-photo laundry uploads, or delete spam submissions.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-200/60 rounded-xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === "all" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === "pending" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter("approved")}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filter === "approved" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Approved ({approvedCount})
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs space-y-2">
          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto shrink-0" />
          <p className="font-bold text-slate-800">No reviews found under "{filter}".</p>
          <p>Customer submissions from completed orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className={`p-5 rounded-3xl bg-white border shadow-xs flex flex-col md:flex-row justify-between gap-6 ${
                rev.status === "pending"
                  ? "border-amber-200 bg-amber-50/20"
                  : rev.status === "approved"
                  ? "border-emerald-200"
                  : "border-slate-200 opacity-70"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 shrink-0 ${
                          s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {rev.user?.full_name || "Customer"}
                  </span>
                  <span className="text-[11px] text-slate-400">• {formatDate(rev.created_at)}</span>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      rev.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : rev.status === "rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic max-w-xl">&ldquo;{rev.comment}&rdquo;</p>

                {/* Customer photos */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                      <ImageIcon className="h-3 w-3 shrink-0" />
                      Uploaded Laundry Photos ({rev.photos.length}/3)
                    </span>
                    <div className="flex gap-2">
                      {rev.photos.map((p, i) => (
                        <div
                          key={p.id || i}
                          className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0"
                        >
                          <Image
                            src={p.photo_url}
                            alt="Customer laundry review attachment"
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Modifiers & Delete Actions */}
              <div className="flex md:flex-col items-end justify-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5">
                  {rev.status !== "approved" && (
                    <Button
                      variant="primary"
                      size="xs"
                      onClick={() => (onChangeStatus ? onChangeStatus(rev.id, "approved") : onApprove(rev.id))}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      title="Approve and display on public landing page"
                    >
                      <CheckCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
                      Approve
                    </Button>
                  )}

                  {rev.status !== "rejected" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => (onChangeStatus ? onChangeStatus(rev.id, "rejected") : onReject(rev.id))}
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      title="Reject from public display"
                    >
                      <XCircle className="h-3.5 w-3.5 mr-1 shrink-0" />
                      Reject
                    </Button>
                  )}

                  {rev.status !== "pending" && (
                    <Button
                      variant="outline"
                      size="xs"
                      onClick={() => onChangeStatus && onChangeStatus(rev.id, "pending")}
                      title="Move back to pending review queue"
                    >
                      <Clock className="h-3.5 w-3.5 mr-1 shrink-0" />
                      Pending
                    </Button>
                  )}
                </div>

                {onDelete && (
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={() => onDelete(rev.id)}
                    className="text-xs"
                    title="Permanently delete review"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1 shrink-0" />
                    Delete Review
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Audit Stats Bar */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-between text-xs text-slate-500 gap-2">
        <span>Approved Testimonials: <strong className="text-slate-800">{approvedCount}</strong></span>
        <span>Pending Queue: <strong className="text-slate-800">{pendingCount}</strong></span>
        <span>Rejected: <strong className="text-slate-800">{rejectedCount}</strong></span>
      </div>
    </div>
  );
}

export default ReviewModerator;
