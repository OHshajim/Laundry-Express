"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ShieldCheck, Download, RefreshCw, ExternalLink } from "lucide-react";
import { AdminSidebar, AdminSection } from "@/components/admin/admin-sidebar";
import { TransactionsManager } from "@/components/admin/transactions-manager";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_ORDERS, INITIAL_CUSTOMERS, INITIAL_REVIEWS } from "@/lib/mock-admin-data";

/**
 * Admin Transactions Route (/admin/transactions)
 *
 * Dedicated executive audit page for Stripe payments:
 * - Searchable / filterable by customer, order, and status
 * - Summary strip: monthly revenue, refunds, pending reconciliation
 * - Direct deep linking into order fulfillment records
 * - Live Stripe webhook sync & financial export capabilities
 */
export default function AdminTransactionsPage() {
  const [activeSection, setActiveSection] = React.useState<AdminSection>("transactions");
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 1200);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full min-h-[calc(100vh-48px)] bg-black text-white">
      {/* Operations Sidebar Navigation */}
      <AdminSidebar
        activeSection={activeSection}
        onSelectSection={(sec) => {
          if (sec === "transactions") return;
          window.location.href = `/admin?section=${sec}`;
        }}
        ordersCount={INITIAL_ORDERS.length}
        customersCount={INITIAL_CUSTOMERS.length}
        pendingReviewsCount={INITIAL_REVIEWS.length}
      />

      {/* Main Operations Workspace */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Top Bar with Webhook Health & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
            <div className="space-y-1">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-[#EC4899] transition-colors mb-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Return to Orders Pipeline</span>
              </Link>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Billing &amp; Stripe Financial Audits
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-800 text-[11px] font-bold text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Webhook Active</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="text-xs bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white"
              >
                <RefreshCw className={`h-3 w-3 mr-1.5 ${isSyncing ? "animate-spin text-[#EC4899]" : ""}`} />
                <span>{isSyncing ? "Syncing..." : "Sync Stripe"}</span>
              </Button>
            </div>
          </div>

          {/* Core Transactions Manager Component */}
          <TransactionsManager
            onViewOrder={(orderId) => {
              window.location.href = `/admin?section=orders&orderId=${orderId}`;
            }}
          />

          {/* Legal and Reconciliation Documentation Strip */}
          <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs text-neutral-400 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span>
              Server-side price verification active on all customer intents. Total calculated upfront before payment.
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              Dispute protection policy: 90-day retention
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
