"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AdminAnalytics } from "./admin-analytics";
import type { Order } from "@/types";
import type { CustomerAccount } from "./customer-detail-modal";

interface AdminOverviewProps {
  orders: Order[];
  customers: CustomerAccount[];
  onNavigate: (section: string) => void;
}

/**
 * AdminOverview Component
 * High-level operations overview, live dispatch metrics, revenue calculation, and quick actions.
 * No dummy or hardcoded fake stats.
 */
export function AdminOverview({ orders, onNavigate }: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Comprehensive Revenue & Order Performance Analytics with Multi-Time Filters */}
      <AdminAnalytics orders={orders} />

      {/* Operational Highlights & Recent Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Live Order Pipeline</h3>
              <p className="text-xs text-slate-500">Real-time status of pickups and returns</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => onNavigate("orders")} className="cursor-pointer text-xs">
              View All Orders
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No orders placed yet. Live orders will populate automatically.
              </div>
            ) : (
              orders.slice(0, 5).map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900">#{ord.order_number}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-slate-700">{ord.customer_name || ord.user?.full_name || "Direct Order"}</span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                      {ord.pickup_date} ({ord.pickup_slot}) • {ord.pricing_mode === "per_bag" ? `${ord.bag_count} Bag(s)` : `${ord.estimated_weight_lbs ?? 0} lbs`}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-900 block">{formatCurrency(ord.total_amount)}</span>
                    <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      {ord.order_status.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-900">Operations Control</h3>
            <p className="text-xs text-slate-500">Quick shortcuts to adjust live settings &amp; pricing</p>
          </div>

          <div className="space-y-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Adjust Rates &amp; Facility Settings →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("detergents")}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Manage Detergents &amp; Temperatures →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("coupons")}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Create or Toggle Coupon Codes →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("reviews")}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Moderate 3-Photo Customer Reviews →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("faqs")}
              className="w-full p-3 rounded-2xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Manage FAQs &amp; Terms Guarantees →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
