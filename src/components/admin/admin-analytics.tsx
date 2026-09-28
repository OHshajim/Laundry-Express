"use client";

import * as React from "react";
import { DollarSign, CheckCircle2, TrendingUp, Calendar, ShoppingBag, Scale, Layers } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types";

export type TimeFilterKey = "oneday" | "week" | "month" | "year" | "lifetime";

interface AdminAnalyticsProps {
  orders: Order[];
}

export function AdminAnalytics({ orders }: AdminAnalyticsProps) {
  const [timeFilter, setTimeFilter] = React.useState<TimeFilterKey>("month");

  const filterCutoffDate = React.useMemo(() => {
    const now = new Date();
    if (timeFilter === "oneday") {
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    }
    if (timeFilter === "week") {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }
    if (timeFilter === "month") {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    if (timeFilter === "year") {
      return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
    }
    return null; // lifetime
  }, [timeFilter]);

  const filteredOrders = React.useMemo(() => {
    if (!filterCutoffDate) return orders;
    return orders.filter((o) => {
      const orderDate = new Date(o.created_at || o.pickup_date);
      return orderDate >= filterCutoffDate;
    });
  }, [orders, filterCutoffDate]);

  const metrics = React.useMemo(() => {
    const validOrders = filteredOrders.filter((o) => o.order_status !== "cancelled");
    const completedOrders = filteredOrders.filter((o) => o.order_status === "completed");
    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
    const aov = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    const bagOrders = validOrders.filter((o) => o.pricing_mode === "per_bag");
    const poundOrders = validOrders.filter((o) => o.pricing_mode === "per_lb" || (o.pricing_mode as string) === "per_kg");
    const pkgOrders = validOrders.filter((o) => o.pricing_mode === "package");

    const bagRevenue = bagOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const poundRevenue = poundOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);
    const pkgRevenue = pkgOrders.reduce((s, o) => s + Number(o.total_amount || 0), 0);

    return {
      totalRevenue,
      completedCount: completedOrders.length,
      totalOrdersCount: filteredOrders.length,
      activeDispatches: filteredOrders.filter((o) => o.order_status !== "completed" && o.order_status !== "cancelled").length,
      aov,
      bagCount: bagOrders.length,
      bagRevenue,
      poundCount: poundOrders.length,
      poundRevenue,
      pkgCount: pkgOrders.length,
      pkgRevenue,
    };
  }, [filteredOrders]);

  const filters: { id: TimeFilterKey; label: string }[] = [
    { id: "oneday", label: "Today (24h)" },
    { id: "week", label: "Last Week" },
    { id: "month", label: "Last Month" },
    { id: "year", label: "Last Year" },
    { id: "lifetime", label: "Lifetime" },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header & Time Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h3 className="text-base font-black text-slate-900 tracking-tight">Revenue &amp; Order Performance Analytics</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit live revenue calculations, turnaround metrics, and order distributions with zero simulated data.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80 self-start sm:self-auto overflow-x-auto max-w-full">
          {filters.map((f) => {
            const isSelected = timeFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setTimeFilter(f.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200/50" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/70 space-y-1">
          <div className="flex items-center justify-between text-emerald-800">
            <span className="text-[11px] font-black uppercase tracking-wider">Filtered Revenue</span>
            <DollarSign className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-emerald-950">{formatCurrency(metrics.totalRevenue)}</p>
          <span className="text-[11px] text-emerald-700 font-medium block">
            {metrics.totalOrdersCount} total orders placed
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/70 space-y-1">
          <div className="flex items-center justify-between text-sky-800">
            <span className="text-[11px] font-black uppercase tracking-wider">Completed Orders</span>
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-sky-950">{metrics.completedCount}</p>
          <span className="text-[11px] text-sky-700 font-medium block">
            {metrics.totalOrdersCount > 0 ? `${Math.round((metrics.completedCount / metrics.totalOrdersCount) * 100)}% fulfillment rate` : "No orders in range"}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/70 space-y-1">
          <div className="flex items-center justify-between text-purple-800">
            <span className="text-[11px] font-black uppercase tracking-wider">Average Order Value</span>
            <TrendingUp className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-purple-950">{formatCurrency(metrics.aov)}</p>
          <span className="text-[11px] text-purple-700 font-medium block">
            Per paid customer checkout
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 space-y-1">
          <div className="flex items-center justify-between text-amber-800">
            <span className="text-[11px] font-black uppercase tracking-wider">Active Dispatches</span>
            <Calendar className="h-4 w-4" />
          </div>
          <p className="text-2xl font-black text-amber-950">{metrics.activeDispatches}</p>
          <span className="text-[11px] text-amber-700 font-medium block">
            Pending / In-flight deliveries
          </span>
        </div>
      </div>

      {/* Breakdown by Plan Type */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">Revenue Breakdown by Pricing Model</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-pink-100 text-pink-700">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">By The Bag</span>
                <span className="text-slate-500">{metrics.bagCount} orders</span>
              </div>
            </div>
            <span className="font-black text-slate-900">{formatCurrency(metrics.bagRevenue)}</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Scale className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">By The Pound (lb)</span>
                <span className="text-slate-500">{metrics.poundCount} orders</span>
              </div>
            </div>
            <span className="font-black text-slate-900">{formatCurrency(metrics.poundRevenue)}</span>
          </div>

          <div className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Saver Bundles</span>
                <span className="text-slate-500">{metrics.pkgCount} credits</span>
              </div>
            </div>
            <span className="font-black text-slate-900">{formatCurrency(metrics.pkgRevenue)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
