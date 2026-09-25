"use client";

import * as React from "react";
import { AdminHeader } from "@/components/admin/admin-header";
import { OrderPipeline } from "@/components/admin/order-pipeline";
import { PricingManager } from "@/components/admin/pricing-manager";
import { ReviewModerator } from "@/components/admin/review-moderator";
import type { Order, OrderReview, OrderStatus } from "@/types";

const INITIAL_ORDERS: Order[] = [
  {
    id: "ord-1",
    order_number: "LX-2026-0042",
    user_id: "u-1",
    pricing_mode: "per_bag",
    detergent_id: "det-tide-pods",
    bag_count: 2,
    pickup_date: "Today",
    pickup_slot: "8am-12pm",
    subtotal: 30.0,
    discount_amount: 0.0,
    delivery_fee: 0.0, // Free because >= 2 bags
    tax_amount: 0.0,
    total_amount: 30.0,
    is_out_of_home: true,
    bag_outside_door_confirmed: true,
    customer_notes: "Leave clean bags on front porch behind white chair.",
    order_status: "in_wash",
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: "u-1", email: "sarah@example.com", full_name: "Sarah Jenkins", role: "customer", is_active: true, created_at: "", updated_at: "" },
    proofs: [
      { id: "prf-1", order_id: "ord-1", proof_type: "pickup", image_url: "/brand/logo-badge.jpg", uploaded_by: "admin-1", created_at: new Date().toISOString() },
    ],
  },
  {
    id: "ord-2",
    order_number: "LX-2026-0043",
    user_id: "u-2",
    pricing_mode: "per_bag",
    detergent_id: "det-eco-plant",
    bag_count: 1,
    pickup_date: "Today",
    pickup_slot: "1pm-6pm",
    subtotal: 15.0,
    discount_amount: 0.0,
    delivery_fee: 10.0, // 1 bag = $10 fee
    tax_amount: 0.0,
    total_amount: 26.5,
    is_out_of_home: false,
    bag_outside_door_confirmed: false,
    customer_notes: "Ring doorbell twice upon arrival.",
    order_status: "pending",
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: "u-2", email: "marcus@example.com", full_name: "Marcus Rodriguez", role: "customer", is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: "ord-3",
    order_number: "LX-2026-0044",
    user_id: "u-3",
    pricing_mode: "per_kg",
    detergent_id: "det-fragrance-free",
    bag_count: 0,
    estimated_weight_kg: 12.0,
    final_weight_kg: null,
    pickup_date: "Tomorrow",
    pickup_slot: "8am-12pm",
    subtotal: 33.0,
    discount_amount: 0.0,
    delivery_fee: 10.0,
    tax_amount: 0.0,
    total_amount: 43.0,
    is_out_of_home: true,
    bag_outside_door_confirmed: true,
    customer_notes: "Bulk Airbnb linens and bedsheets.",
    order_status: "confirmed",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    user: { id: "u-3", email: "elena@example.com", full_name: "Elena Rostova", role: "customer", is_active: true, created_at: "", updated_at: "" },
  },
];

const INITIAL_REVIEWS: OrderReview[] = [
  {
    id: "rev-pending-1",
    order_id: "ord-104",
    user_id: "u-4",
    rating: 5,
    comment: "The driver was here right at 8:15 AM! Folded clothes smelled so crisp and fresh. 10/10 recommend.",
    status: "pending",
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString(),
    user: { full_name: "David Miller" },
    photos: [{ id: "p1", review_id: "rev-pending-1", photo_url: "/brand/logo-badge.jpg", display_order: 1, created_at: new Date().toISOString() }],
  },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = React.useState<"orders" | "pricing" | "reviews">("orders");
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = React.useState<OrderReview[]>(INITIAL_REVIEWS);

  const handleUpdateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus, updated_at: new Date().toISOString() } : o))
    );
  };

  const handleUpdateFinalWeight = (orderId: string, finalWeight: number) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const subtotal = Math.round(finalWeight * 2.75 * 100) / 100;
        const deliveryFee = subtotal >= 40 ? 0 : 10;
        return {
          ...o,
          final_weight_kg: finalWeight,
          subtotal,
          delivery_fee: deliveryFee,
          total_amount: subtotal + deliveryFee,
          updated_at: new Date().toISOString(),
        };
      })
    );
  };

  const handleUploadProof = (orderId: string, proofType: "pickup" | "dropoff", imageUrl: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const existing = o.proofs || [];
        return {
          ...o,
          proofs: [
            ...existing,
            {
              id: `prf-${Date.now()}`,
              order_id: orderId,
              proof_type: proofType,
              image_url: imageUrl,
              uploaded_by: "admin",
              created_at: new Date().toISOString(),
            },
          ],
        };
      })
    );
  };

  const handleApproveReview = (reviewId: string) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: "approved" as const } : r)));
  };

  const handleRejectReview = (reviewId: string) => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: "rejected" as const } : r)));
  };

  const pendingReviewsCount = reviews.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <AdminHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingReviewsCount={pendingReviewsCount}
      />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {activeTab === "orders" && (
          <OrderPipeline
            orders={orders}
            onUpdateStatus={handleUpdateStatus}
            onUpdateFinalWeight={handleUpdateFinalWeight}
            onUploadProof={handleUploadProof}
          />
        )}

        {activeTab === "pricing" && <PricingManager />}

        {activeTab === "reviews" && (
          <ReviewModerator
            reviews={reviews}
            onApprove={handleApproveReview}
            onReject={handleRejectReview}
          />
        )}
      </main>
    </div>
  );
}
