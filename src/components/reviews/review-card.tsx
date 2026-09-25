"use client";

import * as React from "react";
import Image from "next/image";
import { Star, CheckCircle, ShieldCheck, Sparkles, ZoomIn } from "lucide-react";
import type { OrderReview } from "@/types";
import { formatDate } from "@/lib/utils";
import { Dialog } from "@/components/ui/dialog";

interface ReviewCardProps {
  review: OrderReview;
}

/**
 * ReviewCard Component
 *
 * Displays approved customer rating, feedback text, verified buyer badge,
 * and up to 3 real laundry photo proofs with clickable preview dialog.
 */
export function ReviewCard({ review }: ReviewCardProps) {
  const [selectedPhoto, setSelectedPhoto] = React.useState<string | null>(null);

  return (
    <>
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-2xs flex flex-col justify-between hover:shadow-xl hover:border-sky-300 transition-all duration-200 group">
        <div className="space-y-3">
          {/* Star Rating & Verified Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${
                    star <= review.rating
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle className="h-3 w-3" />
              Verified Wash
            </span>
          </div>

          {/* Comment Text */}
          <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
            &ldquo;{review.comment}&rdquo;
          </p>

          {/* Customer Uploaded Photos (Strictly up to 3) */}
          {review.photos && review.photos.length > 0 && (
            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 block uppercase mb-1.5">
                Customer Photos ({review.photos.length}/3)
              </span>
              <div className="flex items-center gap-2">
                {review.photos.map((photo, index) => (
                  <button
                    key={photo.id || index}
                    type="button"
                    onClick={() => setSelectedPhoto(photo.photo_url)}
                    className="relative h-14 w-14 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs cursor-pointer group/img"
                    title="Click to view full photo proof"
                  >
                    <Image
                      src={photo.photo_url}
                      alt={`Customer laundry review photo ${index + 1}`}
                      fill
                      sizes="56px"
                      className="object-cover group-hover/img:scale-110 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center text-white transition-opacity">
                      <ZoomIn className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Customer Name & Date */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
            <span>{review.user?.full_name || "Verified Customer"}</span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {formatDate(review.created_at)}
          </span>
        </div>
      </div>

      {/* Photo Preview Dialog */}
      {selectedPhoto && (
        <Dialog
          open={!!selectedPhoto}
          onOpenChange={() => setSelectedPhoto(null)}
          title="Verified Customer Laundry Photo"
          description="Uploaded by customer upon order completion."
          size="md"
        >
          <div className="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100">
            <Image
              src={selectedPhoto}
              alt="Full size customer laundry photo proof"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              className="object-contain"
            />
          </div>
        </Dialog>
      )}
    </>
  );
}
