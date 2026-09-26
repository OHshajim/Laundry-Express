"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CURRENT_CUSTOMER,
  CUSTOMER_ORDERS,
} from "@/lib/mock-customer-data";
import { formatCurrency } from "@/lib/utils";

interface CustomerOverviewProps {
  onNavigate?: (tab: string) => void;
}

/**
 * CustomerOverview Component
 *
 * Primary customer portal view:
 * - Active Order Tracker widget with current stage and progress
 * - Quick stats (Total Orders, Lifetime Spend, Saved Address)
 * - "Book Again" action button
 * - Recent orders quick inspection
 * - Strictly complies with the < 250 lines rule
 */
export function CustomerOverview({ onNavigate }: CustomerOverviewProps) {
  const activeOrder = CUSTOMER_ORDERS.find((o) => o.order_status !== "completed");
  const pastOrders = CUSTOMER_ORDERS.filter((o) => o.order_status === "completed");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner & Quick Action */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge className="bg-white/20 text-white border-0 font-bold uppercase tracking-wider text-[10px]">
            Active Customer Session
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Doorstep Laundry at Your Service
          </h2>
          <p className="text-xs sm:text-sm text-pink-100 font-medium">
            Remember: 2+ Bags always qualify for 100% FREE delivery. Track your active wash cycle or book your next convenient slot below.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link href="/order">
            <Button size="lg" className="bg-white text-slate-900 hover:bg-pink-50 font-black shadow-lg">
              <RotateCcw className="h-4 w-4 mr-2 text-primary" />
              <span>Book Again</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Account Highlights Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Lifetime Orders</span>
          <span className="text-2xl font-black text-slate-900">{CURRENT_CUSTOMER.total_orders} Orders</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">All photo proof verified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Laundry Saved</span>
          <span className="text-2xl font-black text-primary">~16 Loads</span>
          <span className="text-[11px] text-slate-500 font-medium block">Over 24 hours of free time</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Saved Doorstep Address</span>
          <span className="text-sm font-black text-slate-900 truncate block">1420 Algonquin Rd</span>
          <span className="text-[11px] text-slate-400 font-medium block">Lake in the Hills, IL 60156</span>
        </div>
      </div>

      {/* Active Order Spotlight Tracker */}
      {activeOrder && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border-2 border-pink-300 shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-pink-50">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-primary-dark text-xs font-black mb-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Active Order In-Flight</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Order #{activeOrder.order_number}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="warning" className="uppercase font-extrabold text-xs">
                {activeOrder.order_status.replace("_", " ")}
              </Badge>
              <button
                type="button"
                onClick={() => onNavigate?.("orders")}
                className="px-3 py-1 rounded-full text-xs font-bold text-primary hover:bg-pink-50 border border-pink-200 cursor-pointer"
              >
                Track Live &rarr;
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block">Pickup Slot</span>
              <strong className="text-slate-800">{activeOrder.pickup_date} ({activeOrder.pickup_slot})</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Bag Count</span>
              <strong className="text-slate-800">{activeOrder.bag_count} Bags (13 Gal)</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Detergent &amp; Wash</span>
              <strong className="text-slate-800">{activeOrder.detergent_id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Total Charged</span>
              <strong className="text-primary font-black">{formatCurrency(activeOrder.total_amount)}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Recent Past Orders Strip */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-slate-900">Recent Completed Orders</h3>
          <button
            type="button"
            onClick={() => onNavigate?.("orders")}
            className="text-xs font-bold text-primary hover:underline cursor-pointer"
          >
            View All ({pastOrders.length}) &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pastOrders.slice(0, 2).map((order) => (
            <div
              key={order.id}
              onClick={() => onNavigate?.("orders")}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-pink-300 transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-black text-slate-900 text-sm">Order #{order.order_number}</span>
                <Badge variant="success" className="text-[10px] uppercase font-bold">
                  Completed
                </Badge>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{order.pickup_date} • {order.bag_count} Bags</span>
                <span className="font-bold text-slate-800">{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
