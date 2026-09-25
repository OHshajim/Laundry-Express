"use client";

import * as React from "react";
import { AdminSidebar, AdminSection } from "@/components/admin/admin-sidebar";
import { OrderPipeline } from "@/components/admin/order-pipeline";
import { CustomersManager } from "@/components/admin/customers-manager";
import { PricingManager } from "@/components/admin/pricing-manager";
import { ReviewModerator } from "@/components/admin/review-moderator";
import { INITIAL_ORDERS, INITIAL_REVIEWS, INITIAL_CUSTOMERS } from "@/lib/mock-admin-data";
import type { Order, OrderReview, OrderStatus } from "@/types";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";

/**
 * AdminPage Component
 *
 * Executive control workspace for Laundry Express operations:
 * - Orders Pipeline: Progressive state advancement (Accept, Pickup, Damage reporting, Delivery)
 * - Customers Directory: Full accounts inspection (Profile, Order history, Stripe payments, Reviews)
 * - Rates & Delivery: Base rates, bag/KG thresholds, free delivery rules
 * - Packages & Detergents: Dynamic customer catalog management
 * - Coupons & Reviews: Promo codes and feedback moderation
 */
export default function AdminPage() {
  const [activeSection, setActiveSection] = React.useState<AdminSection>("orders");
  const [orders, setOrders] = React.useState<Order[]>(INITIAL_ORDERS);
  const [reviews, setReviews] = React.useState<OrderReview[]>(INITIAL_REVIEWS);
  const [customers, setCustomers] = React.useState<CustomerAccount[]>(INITIAL_CUSTOMERS);

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
        customersCount={customers.length}
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

          {activeSection === "customers" && (
            <CustomersManager
              customers={customers}
              onViewOrder={() => setActiveSection("orders")}
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
