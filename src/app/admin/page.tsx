"use client";

import * as React from "react";
import { AdminSidebar, AdminSection } from "@/components/admin/admin-sidebar";
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
      { id: "prf-1", order_id: "ord-1", proof_type: "pickup", image_url: "/brand/logo-badge.jpg", uploaded_by: "driver-1", created_at: new Date().toISOString() },
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
    delivery_fee: 10.0,
    tax_amount: 0.0,
    total_amount: 25.0,
    is_out_of_home: false,
    bag_outside_door_confirmed: false,
    customer_notes: "Ring doorbell twice upon arrival.",
    order_status: "confirmed", // Paid, ready for admin acceptance
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
    order_status: "driver_assigned", // Accepted, driver en route for pickup
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
  const [activeSection, setActiveSection] = React.useState<AdminSection>("orders");
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

  const handleUploadProof = (
    orderId: string,
    proofType: "pickup" | "dropoff" | "damage",
    imageUrl: string,
    notes?: string
  ) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const existing = o.proofs || [];
        const isDamage = proofType === "damage";

        return {
          ...o,
          has_preexisting_damage: isDamage ? true : o.has_preexisting_damage,
          damage_notes: isDamage ? notes : o.damage_notes,
          damage_photo_url: isDamage ? imageUrl : o.damage_photo_url,
          customer_notified_damage: isDamage ? true : o.customer_notified_damage,
          proofs: [
            ...existing,
            {
              id: `prf-${Date.now()}`,
              order_id: orderId,
              proof_type: proofType,
              image_url: imageUrl,
              notes,
              uploaded_by: "operations-admin",
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

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleChangeReviewStatus = (reviewId: string, newStatus: "pending" | "approved" | "rejected") => {
    setReviews((prev) => prev.map((r) => (r.id === reviewId ? { ...r, status: newStatus } : r)));
  };

  const pendingReviewsCount = reviews.filter((r) => r.status === "pending").length;
  const activeOrdersCount = orders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled").length;

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-48px)]">
      {/* Operations Sidebar Navigation */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        ordersCount={activeOrdersCount}
        pendingReviewsCount={pendingReviewsCount}
      />

      {/* Main Operations Work Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {activeSection === "orders" && (
            <OrderPipeline
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
              onUpdateFinalWeight={handleUpdateFinalWeight}
              onUploadProof={handleUploadProof}
            />
          )}

          {activeSection === "rates" && <PricingManager currentSection="rates" />}
          {activeSection === "packages" && <PricingManager currentSection="packages" />}
          {activeSection === "detergents" && <PricingManager currentSection="detergents" />}
          {activeSection === "coupons" && <PricingManager currentSection="coupons" />}

          {activeSection === "reviews" && (
            <ReviewModerator
              reviews={reviews}
              onApprove={handleApproveReview}
              onReject={handleRejectReview}
              onDelete={handleDeleteReview}
              onChangeStatus={handleChangeReviewStatus}
            />
          )}
        </div>
      </main>
    </div>
  );
}
