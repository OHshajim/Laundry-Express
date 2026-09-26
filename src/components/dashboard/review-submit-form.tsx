"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Camera, CheckCircle2, AlertCircle, Plus, Sparkles, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CUSTOMER_ORDERS } from "@/lib/mock-customer-data";
import { compressImage } from "@/lib/image-compressor";
import type { OrderReview } from "@/types";

interface ReviewSubmitFormProps {
  onReviewSubmitted: (newReview: OrderReview) => void;
}

export function ReviewSubmitForm({ onReviewSubmitted }: ReviewSubmitFormProps) {
  const [selectedOrderId, setSelectedOrderId] = React.useState("ord-prev-1");
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [photos, setPhotos] = React.useState<string[]>([]);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  const [submittedMessage, setSubmittedMessage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length === 0) return;
    setUploadError(null);

    if (photos.length + selectedFiles.length > 3) {
      setUploadError("You can upload a maximum of 3 photos per review.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setIsUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of selectedFiles) {
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`"${file.name}" exceeds the 5MB limit.`);
        }
        if (!file.type.startsWith("image/")) {
          throw new Error("Only image files are allowed.");
        }
        const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.8 });
        const formData = new FormData();
        formData.append("file", compressed);
        formData.append("bucket", "review-photos");
        formData.append("entityId", selectedOrderId);
        formData.append("subType", String(photos.length + uploaded.length + 1));

        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok || !data.success || !data.url) throw new Error(data.error || "Upload failed.");
        uploaded.push(data.url);
      }
      setPhotos((prev) => [...prev, ...uploaded].slice(0, 3));
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload image.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const reviewId = `rev-${Date.now()}`;
    const newRev: OrderReview = {
      id: reviewId,
      order_id: selectedOrderId,
      user_id: "u-1",
      rating,
      comment: comment.trim(),
      status: "pending",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      user: { full_name: "Sarah Jenkins" },
      photos: photos.map((url, idx) => ({
        id: `photo-${reviewId}-${idx}`,
        review_id: reviewId,
        photo_url: url,
        display_order: Math.min(Math.max(idx + 1, 1), 3) as 1 | 2 | 3,
        created_at: new Date().toISOString(),
      })),
    };

    onReviewSubmitted(newRev);
    setComment("");
    setPhotos([]);
    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 4500);
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-200 shadow-md space-y-5">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary-pale text-primary flex items-center justify-center font-bold">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 text-base">Rate a Completed Order</h3>
          <span className="text-[11px] text-slate-500">Verified customer feedback (1–5 Stars &amp; Up to 3 Photos)</span>
        </div>
      </div>

      {submittedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Thank you! Your review and photos have been submitted for moderation.</span>
        </div>
      )}

      {uploadError && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Order to Rate</label>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl border border-slate-200 bg-white"
            >
              {CUSTOMER_ORDERS.map((ord) => (
                <option key={ord.id} value={ord.id}>
                  Order #{ord.order_number} ({ord.pickup_date} • {ord.bag_count} Bag(s))
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Star Rating</label>
            <div className="flex items-center gap-2 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star className={`h-6 w-6 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} />
                </button>
              ))}
              <span className="text-xs font-bold text-slate-700 ml-2">{rating} of 5 Stars</span>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Your Written Feedback</label>
          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the folding, fragrance, and delivery punctuality?"
            className="w-full p-3 text-xs rounded-xl border border-slate-200"
            required
          />
        </div>

        {/* 3 Photos Max Upload */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Camera className="h-3.5 w-3.5 text-primary" />
              <span>Attach Laundry Photos (Max 3, up to 5MB each)</span>
            </label>
            <span className="text-[11px] font-semibold text-slate-400">{photos.length} of 3 photos added</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {photos.map((url, idx) => (
              <div key={idx} className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xs">
                <Image src={url} alt={`Review photo ${idx + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => setPhotos((p) => p.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {photos.length < 3 && (
              <button
                type="button"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
                className="h-20 w-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-primary cursor-pointer disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin text-primary" /> : <Plus className="h-5 w-5" />}
                <span className="text-[9px] font-bold">{isUploading ? "Compressing" : "Add Photo"}</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handlePhotoSelect} className="hidden" />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isUploading} className="bg-primary hover:bg-primary-dark text-white text-xs cursor-pointer">
            <Plus className="h-3.5 w-3.5 mr-1" />
            <span>Submit Review</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
