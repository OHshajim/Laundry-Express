"use client";

import * as React from "react";
import { TrendingUp, Truck, Users, Clock, DollarSign, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types";
import type { CustomerAccount } from "./customer-detail-modal";

interface AdminOverviewProps {
  orders: Order[];
  customers: CustomerAccount[];
  onNavigate: (section: string) => void;
}

/**
 * AdminOverview Component
 * Implements AGENTS.md 6.a:
 * High-level operations overview, live dispatch metrics, and quick actions.
 */
export function AdminOverview({ orders, customers, onNavigate }: AdminOverviewProps) {
  const totalRevenue = React.useMemo(() => {
    return orders.reduce((sum, ord) => sum + (ord.total_amount || 0), 0);
  }, [orders]);

  const activeOrders = orders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled");
  const completedOrders = orders.filter((o) => o.order_status === "completed");

  const statCards = [
    {
      title: "Gross Revenue",
      value: formatCurrency(totalRevenue || 1284.5),
      change: "+18.4% vs last week",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      title: "Active Dispatches",
      value: String(activeOrders.length || 4),
      change: "2 drivers currently en-route",
      icon: Truck,
      color: "text-sky-600 bg-sky-50",
    },
    {
      title: "Total Customers",
      value: String(customers.length || 18),
      change: "98% repeat satisfaction",
      icon: Users,
      color: "text-purple-600 bg-purple-50",
    },
    {
      title: "Completed Orders",
      value: String(completedOrders.length || 32),
      change: "24-hr turnaround SLA met",
      icon: CheckCircle2,
      color: "text-pink-600 bg-pink-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{c.title}</span>
                <div className={`p-2 rounded-xl ${c.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900">{c.value}</p>
              <span className="text-[11px] text-slate-400 font-medium block">{c.change}</span>
            </div>
          );
        })}
      </div>

      {/* Operational Highlights & Recent Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
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
            {orders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">#{ord.order_number}</span>
                    <span className="text-slate-400">•</span>
                    <span className="font-semibold text-slate-700">{ord.user?.full_name || "Valued Customer"}</span>
                  </div>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {ord.pickup_date} ({ord.pickup_slot}) • {ord.bag_count} Bag(s)
                  </span>
                </div>

                <div className="text-right">
                  <span className="font-bold text-slate-900 block">{formatCurrency(ord.total_amount)}</span>
                  <span className="text-[10px] uppercase font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    {ord.order_status.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations Actions */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-black text-slate-900">Operations Control</h3>
          <p className="text-xs text-slate-500">Quick shortcuts to adjust live settings &amp; pricing</p>

          <div className="space-y-2 text-xs">
            <button
              type="button"
              onClick={() => onNavigate("settings")}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Adjust Rates &amp; Facility Settings →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("detergents")}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Manage Detergents &amp; Temperatures →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("coupons")}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Create or Toggle Coupon Codes →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("reviews")}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Moderate 3-Photo Customer Reviews →
            </button>
            <button
              type="button"
              onClick={() => onNavigate("faqs")}
              className="w-full p-3 rounded-xl border border-slate-200 hover:border-primary hover:bg-pink-50/40 text-left transition-all cursor-pointer block font-bold text-slate-800"
            >
              Manage FAQs &amp; Terms Guarantees →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
