import Image from "next/image";
import { Star, CheckCircle, ShieldCheck } from "lucide-react";
import type { OrderReview } from "@/types";
import { formatDate } from "@/lib/utils";

interface ReviewCardProps {
  review: OrderReview;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-sky-200 transition-all duration-200">
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
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle className="h-3 w-3" />
            Verified Clean
          </span>
        </div>

        {/* Comment Text */}
        <p className="text-xs text-slate-700 leading-relaxed font-normal italic">
          &ldquo;{review.comment}&rdquo;
        </p>

        {/* Customer Uploaded Photos (Strictly up to 3) */}
        {review.photos && review.photos.length > 0 && (
          <div className="pt-2 flex items-center gap-2">
            {review.photos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-xs"
              >
                <Image
                  src={photo.photo_url}
                  alt={`Customer laundry review photo ${index + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover hover:scale-110 transition-transform duration-200"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Name & Date */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        <span className="font-bold text-slate-900 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-600" />
          {review.user?.full_name || "Happy Customer"}
        </span>
        <span className="text-[11px]">{formatDate(review.created_at)}</span>
      </div>
    </div>
  );
}
