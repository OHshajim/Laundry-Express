"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  CreditCard,
  PlusCircle,
  ArrowRight,
  Clock,
  Sparkles,
  Camera,
  MapPin,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CURRENT_CUSTOMER,
  CUSTOMER_ORDERS,
  CUSTOMER_TRANSACTIONS,
} from "@/lib/mock-customer-data";
import { formatCurrency } from "@/lib/utils";

/**
 * Customer Dashboard Overview Page (/dashboard)
 *
 * Implements:
 * - Active Order Tracker widget with current stage and progress
 * - Quick stats (Total Orders, Lifetime Spend, Member status)
 * - "Book Again" prominent action in Bubble Pink
 * - Recent order history preview
 */
export default function DashboardOverviewPage() {
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
              <Link href="/dashboard/orders">
                <Button size="sm" variant="outline" className="border-pink-200 text-primary hover:bg-pink-50">
                  <span>View Timeline &amp; Photos</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </div>

          {/* 4-Stage Progress Stepper Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-primary" />
              <span className="font-extrabold text-slate-900 block text-[11px]">1. Picked Up</span>
              <span className="text-[10px] text-emerald-600 font-bold">Photo Proof Logged</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-primary" />
              <span className="font-extrabold text-slate-900 block text-[11px]">2. In Sanitization</span>
              <span className="text-[10px] text-primary font-bold">Tide Ultra Oxi</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-slate-200" />
              <span className="font-medium text-slate-400 block text-[11px]">3. Crisp Fold</span>
              <span className="text-[10px] text-slate-400">Next</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-slate-200" />
              <span className="font-medium text-slate-400 block text-[11px]">4. Porch Delivery</span>
              <span className="text-[10px] text-slate-400">Photo Proof</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-pink-50/50 border border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700">
            <div>
              <span className="font-bold block text-slate-900">
                Scheduled Slot: {activeOrder.pickup_date} ({activeOrder.pickup_slot})
              </span>
              <span className="text-slate-500">
                {activeOrder.bag_count} Standard 13-Gal Bags • {formatCurrency(activeOrder.total_amount)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary-dark font-bold">
              <Camera className="h-4 w-4" />
              <span>Intake Photo Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Past Orders & Recent Transactions Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Past Orders Preview (7 Cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Completed Laundry Orders</h3>
            <Link href="/dashboard/orders" className="text-xs font-bold text-primary hover:underline">
              View All ({pastOrders.length})
            </Link>
          </div>

          {pastOrders.map((ord) => (
            <div
              key={ord.id}
              className="p-4 rounded-2xl bg-slate-50 hover:bg-pink-50/40 border border-slate-100 transition-colors flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-slate-900 text-sm">#{ord.order_number}</span>
                  <Badge variant="success" className="text-[10px]">Delivered</Badge>
                </div>
                <span className="text-xs text-slate-500 block">
                  {ord.pickup_date} • {ord.bag_count} Bag(s) • {formatCurrency(ord.total_amount)}
                </span>
              </div>

              <Link href="/order">
                <Button size="sm" variant="outline" className="border-pink-200 text-primary hover:bg-pink-50 text-xs">
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  <span>Book Again</span>
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Payments Summary (5 Cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-black text-slate-900 text-base">Recent Payments</h3>
            <Link href="/dashboard/transactions" className="text-xs font-bold text-primary hover:underline">
              View History
            </Link>
          </div>

          {CUSTOMER_TRANSACTIONS.slice(0, 3).map((txn) => (
            <div
              key={txn.id}
              className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between text-xs"
            >
              <div>
                <span className="font-bold text-slate-900 block">{txn.order_number}</span>
                <span className="text-[11px] text-slate-400">{txn.date} • {txn.method}</span>
              </div>
              <div className="text-right">
                <span className="font-black text-slate-900 block">{formatCurrency(txn.amount)}</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">{txn.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
