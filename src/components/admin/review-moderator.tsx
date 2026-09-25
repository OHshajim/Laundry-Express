"use client";

import * as React from "react";
import Image from "next/image";
import { Star, CheckCircle, XCircle, ShieldAlert, Image as ImageIcon } from "lucide-react";
import type { OrderReview } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ReviewModeratorProps {
  reviews: OrderReview[];
  onApprove: (reviewId: string) => void;
  onReject: (reviewId: string) => void;
}

export function ReviewModerator({ reviews, onApprove, onReject }: ReviewModeratorProps) {
  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const approvedReviews = reviews.filter((r) => r.status === "approved");

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">Review Moderation Queue</h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Inspect customer submissions, verify up to 3 clean laundry photos, and approve or reject testimonials.
        </p>
      </div>

      {pendingReviews.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs space-y-2">
          <CheckCircle className="h-8 w-8 text-emerald-500 mx-auto" />
          <p className="font-bold text-slate-800">All Clear! No pending reviews to moderate.</p>
          <p>New customer submissions from completed orders will appear here automatically.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-white border-2 border-amber-200 shadow-xs flex flex-col md:flex-row justify-between gap-6"
            >
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= rev.rating ? "fill-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{rev.user?.full_name || "Customer"}</span>
                  <span className="text-[11px] text-slate-400">• {formatDate(rev.created_at)}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                    Pending Approval
                  </span>
                </div>

                <p className="text-xs text-slate-700 italic max-w-xl">&ldquo;{rev.comment}&rdquo;</p>

                {/* Attached photos (strictly up to 3) */}
                {rev.photos && rev.photos.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1.5">
                      <ImageIcon className="h-3 w-3" />
                      Customer Uploaded Laundry Photos ({rev.photos.length}/3)
                    </span>
                    <div className="flex gap-2">
                      {rev.photos.map((p, i) => (
                        <div
                          key={p.id || i}
                          className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                        >
                          <Image
                            src={p.photo_url}
                            alt="Laundry review attachment"
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

              {/* Moderation Actions */}
              <div className="flex md:flex-col justify-end gap-2 shrink-0">
                <Button
                  variant="hero"
                  size="sm"
                  onClick={() => onApprove(rev.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Approve &amp; Publish
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onReject(rev.id)}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  <XCircle className="h-4 w-4 mr-1.5" />
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Moderated History Count */}
      <div className="pt-4 border-t border-slate-200 flex justify-between text-xs text-slate-500">
        <span>Approved Testimonials: <strong>{approvedReviews.length}</strong></span>
        <span>Pending Moderation Queue: <strong>{pendingReviews.length}</strong></span>
      </div>
    </div>
  );
}
