"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { useAuth } from "@/context/auth-context";
import type { Order, OrderReview, OrderStatus } from "@/types";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";

// Admin views
import { AdminOverview } from "@/components/admin/admin-overview";
import { OrderPipeline } from "@/components/admin/order-pipeline";
import { CustomersManager } from "@/components/admin/customers-manager";
import { PricingManager } from "@/components/admin/pricing-manager";
import { ReviewModerator } from "@/components/admin/review-moderator";
import { TransactionsManager } from "@/components/admin/transactions-manager";
import { FaqsTermsManager } from "@/components/admin/faqs-terms-manager";
import { AdminSettingsManager } from "@/components/admin/admin-settings-manager";

// Customer views
import { CustomerOverview } from "@/components/dashboard/customer-overview";
import CustomerOrdersPage from "./orders/page";
import CustomerTransactionsPage from "./transactions/page";
import CustomerRatingsPage from "./ratings/page";
import { DashboardSettings } from "@/components/dashboard/dashboard-settings";

const ADMIN_HEADER_CONFIG: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Operations Overview", subtitle: "Live facility telemetry, revenue, and active dispatches" },
  orders: { title: "Orders & Fulfillment", subtitle: "Accept bookings, inspect fabrics, and upload proof photos" },
  customers: { title: "Customers", subtitle: "Customer accounts, order history, and account settings" },
  transactions: { title: "Transaction & Payment History", subtitle: "Stripe payment intents, receipts, and order billing logs" },
  packages: { title: "Saver Packages & Bundles", subtitle: "Create, edit, and toggle active status of discounted bundles" },
  detergents: { title: "Detergent & Temperature Catalog", subtitle: "Manage laundry detergents and wash temperature options" },
  coupons: { title: "Promotional Coupons", subtitle: "Create and manage percentage and fixed-amount promo codes" },
  reviews: { title: "Customer Review Moderation", subtitle: "Audit 3-photo laundry uploads and moderate ratings" },
  faqs: { title: "FAQs & Terms Guarantees", subtitle: "Manage customer questions and policy guarantees" },
  settings: { title: "Operations, Facility & Rate Settings", subtitle: "Configure live service rates, free delivery thresholds, operational hours, and delivery zones" },
  rates: { title: "Operations, Facility & Rate Settings", subtitle: "Configure live service rates, free delivery thresholds, operational hours, and delivery zones" },
  account_settings: { title: "Administrator Account Settings", subtitle: "Manage personal profile and reset password via email verification" },
};

const CUSTOMER_HEADER_CONFIG: Record<string, { title: string; subtitle: string }> = {
  overview: { title: "Customer Dashboard Overview", subtitle: "Track your active wash cycle or book your next convenient slot" },
  orders: { title: "My Orders & Timeline Tracking", subtitle: "Inspect your real-time 4-stage order journey and photo proofs" },
  transactions: { title: "Payment History & Receipts", subtitle: "Search and inspect Stripe invoices, methods, and receipts" },
  ratings: { title: "Ratings & Reviews", subtitle: "Share your experience and 3-photo laundry uploads with neighbors" },
  account_settings: { title: "Account & Security Settings", subtitle: "Manage profile, saved addresses, and change password via email" },
};

function extractCustomers(list: Order[]): CustomerAccount[] {
  const map = new Map<string, CustomerAccount>();
  for (const o of list) {
    const k = o.customer_email || o.user_id || "guest";
    const e = map.get(k);
    if (e) {
      e.orders.push(o);
    } else {
      map.set(k, {
        id: o.user_id || `cust-${o.id}`,
        full_name: o.customer_name || o.user?.full_name || "Customer",
        email: o.customer_email || "customer@example.com",
        phone: o.customer_phone || "(847) 555-0100",
        address: o.pickup_address || "Lake in the Hills, IL",
        joined_date: o.created_at ? new Date(o.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently",
        orders: [o],
        reviews: [],
        payments: [],
      });
    }
  }
  return Array.from(map.values());
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAdmin, isLoading } = useAuth();

  const tabParam = searchParams.get("tab");
  const customerAllowedTabs = React.useMemo(() => new Set(["overview", "orders", "transactions", "ratings", "account_settings"]), []);
  const activeTab = isAdmin
    ? (tabParam || "orders")
    : (tabParam && customerAllowedTabs.has(tabParam) ? tabParam : "overview");

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [reviews, setReviews] = React.useState<OrderReview[]>([]);
  const [customers, setCustomers] = React.useState<CustomerAccount[]>([]);

  React.useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.orders)) {
          setOrders(data.orders);
          setCustomers(extractCustomers(data.orders));
        }
      })
      .catch(() => {});

    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.reviews)) setReviews(data.reviews);
      })
      .catch(() => {});
  }, [user, isAdmin]);

  const handleSelectTab = (tabId: string) => {
    router.push(`/dashboard?tab=${tabId}`);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, order_status: newStatus, updated_at: new Date().toISOString() } : o)));
    try { await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, status: newStatus }) }); } catch {}
  };

  const handleUpdateFinalWeight = async (orderId: string, finalWeight: number) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const subtotal = Math.round(finalWeight * 2.75 * 100) / 100;
      const deliveryFee = subtotal >= 40 ? 0 : 10;
      return { ...o, final_weight_kg: finalWeight, subtotal, delivery_fee: deliveryFee, total_amount: subtotal + deliveryFee };
    }));
    try { await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, finalWeight }) }); } catch {}
  };

  const handleUploadProof = async (orderId: string, proofType: "pickup" | "dropoff" | "damage", imageUrl: string, notes?: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      const isDamage = proofType === "damage";
      return {
        ...o,
        has_preexisting_damage: isDamage ? true : o.has_preexisting_damage,
        damage_notes: isDamage ? notes : o.damage_notes,
        damage_photo_url: isDamage ? imageUrl : o.damage_photo_url,
        customer_notified_damage: isDamage ? true : o.customer_notified_damage,
        proofs: [...(o.proofs || []), { id: `prf-${Date.now()}`, order_id: orderId, proof_type: proofType, image_url: imageUrl, notes, uploaded_by: "operations-admin", created_at: new Date().toISOString() }],
      };
    }));
    try { await fetch("/api/orders", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId, proofType, imageUrl, notes }) }); } catch {}
  };

  const handleApproveReview = async (id: string) => {
    setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: "approved" as const } : r)));
    try { await fetch("/api/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId: id, status: "approved" }) }); } catch {}
  };
  const handleRejectReview = async (id: string) => {
    setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: "rejected" as const } : r)));
    try { await fetch("/api/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reviewId: id, status: "rejected" }) }); } catch {}
  };
  const handleDeleteReview = async (id: string) => {
    setReviews((p) => p.filter((r) => r.id !== id));
    try { await fetch(`/api/reviews?id=${encodeURIComponent(id)}`, { method: "DELETE" }); } catch {}
  };
  const handleChangeReviewStatus = (id: string, s: "pending" | "approved" | "rejected") => {
    if (s === "approved") handleApproveReview(id);
    else if (s === "rejected") handleRejectReview(id);
    else setReviews((p) => p.map((r) => (r.id === id ? { ...r, status: s } : r)));
  };

  const pendingReviewsCount = reviews.filter((r) => r.status === "pending").length;
  const activeOrdersCount = orders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled").length;

  const displayName = user?.full_name || (isAdmin ? "Operations Admin" : "Valued Customer");
  const activeHeader = isAdmin
    ? ADMIN_HEADER_CONFIG[activeTab] || { title: "Admin Operations", subtitle: "Lake in the Hills Hub" }
    : CUSTOMER_HEADER_CONFIG[activeTab] || { title: `Welcome Back, ${displayName}`, subtitle: "Doorstep Laundry Service" };

  if (isLoading) return <div className="h-96 rounded-3xl bg-slate-100 animate-pulse m-6" />;

  return (
    <DashboardShell
      role={isAdmin ? "admin" : "customer"}
      userName={displayName}
      activeSection={activeTab}
      onSelectSection={handleSelectTab}
      ordersCount={activeOrdersCount}
      customersCount={customers.length}
      pendingReviewsCount={pendingReviewsCount}
      title={activeHeader.title}
      subtitle={activeHeader.subtitle}
      badgeText={isAdmin ? "Operations Portal" : "Active Customer"}
      badgeVariant="primary"
      actions={
        !isAdmin ? (
          <Link href="/order">
            <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 shadow-xs font-bold">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              <span>Book Pickup</span>
            </Button>
          </Link>
        ) : undefined
      }
    >
      <div className="space-y-6">
        {isAdmin ? (
          <>
            {activeTab === "overview" && <AdminOverview orders={orders} customers={customers} onNavigate={handleSelectTab} />}
            {activeTab === "orders" && <OrderPipeline orders={orders} onUpdateStatus={handleUpdateStatus} onUpdateFinalWeight={handleUpdateFinalWeight} onUploadProof={handleUploadProof} />}
            {activeTab === "customers" && <CustomersManager customers={customers} onViewOrder={() => handleSelectTab("orders")} />}
            {activeTab === "transactions" && <TransactionsManager orders={orders} onViewOrder={() => handleSelectTab("orders")} />}
            {(activeTab === "settings" || activeTab === "rates") && <AdminSettingsManager />}
            {activeTab === "packages" && <PricingManager currentSection="packages" />}
            {activeTab === "detergents" && <PricingManager currentSection="detergents" />}
            {activeTab === "coupons" && <PricingManager currentSection="coupons" />}
            {activeTab === "reviews" && <ReviewModerator reviews={reviews} onApprove={handleApproveReview} onReject={handleRejectReview} onDelete={handleDeleteReview} onChangeStatus={handleChangeReviewStatus} />}
            {activeTab === "faqs" && <FaqsTermsManager />}
            {activeTab === "account_settings" && <DashboardSettings />}
          </>
        ) : (
          <>
            {activeTab === "overview" && <CustomerOverview orders={orders} onNavigate={handleSelectTab} />}
            {activeTab === "orders" && <CustomerOrdersPage orders={orders} />}
            {activeTab === "transactions" && <CustomerTransactionsPage />}
            {activeTab === "ratings" && <CustomerRatingsPage />}
            {activeTab === "account_settings" && <DashboardSettings />}
          </>
        )}
      </div>
    </DashboardShell>
  );
}

export default function DashboardMasterPage() {
  return (
    <React.Suspense fallback={<div className="h-96 rounded-3xl bg-slate-100 animate-pulse m-6" />}>
      <DashboardContent />
    </React.Suspense>
  );
}
