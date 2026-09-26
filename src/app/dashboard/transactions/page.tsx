"use client";

import * as React from "react";
import Link from "next/link";
import { CreditCard, ExternalLink, ShieldCheck, Download, Search, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CUSTOMER_TRANSACTIONS } from "@/lib/mock-customer-data";
import { formatCurrency } from "@/lib/utils";

/**
 * Customer Payment History Page (/dashboard/transactions)
 *
 * Implements:
 * - Searchable list of Stripe payment records linked to orders
 * - Payment method, timestamp, and status badges
 * - Secure Stripe receipt links and total spend metrics
 */
export default function CustomerTransactionsPage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = CUSTOMER_TRANSACTIONS.filter((txn) => {
    const matchesSearch =
      txn.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = CUSTOMER_TRANSACTIONS.reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header & Highlights */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-100">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments &amp; Receipts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified Stripe transaction records for all your doorstep laundry services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 font-bold text-xs py-1">
            <ShieldCheck className="h-3.5 w-3.5 mr-1 text-emerald-600" />
            <span>Stripe End-to-End Encrypted</span>
          </Badge>
        </div>
      </div>

      {/* Summary Highlight Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Total Lifetime Paid</span>
          <span className="text-2xl font-black text-slate-900">{formatCurrency(totalPaid)}</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">3 Payments Succeeded</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Primary Payment Method</span>
          <span className="text-sm font-black text-slate-900 block">Apple Pay (•• 4242)</span>
          <span className="text-[11px] text-slate-400 font-medium block">Default 1-tap checkout</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500 block">Refunds &amp; Disputes</span>
          <span className="text-2xl font-black text-slate-900">$0.00</span>
          <span className="text-[11px] text-emerald-600 font-semibold block">100% Satisfaction Rate</span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by order or card..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              statusFilter === "all" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setStatusFilter("succeeded")}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors ${
              statusFilter === "succeeded" ? "bg-primary text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Succeeded
          </button>
        </div>
      </div>

      {/* Transactions Table / Card View */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {filtered.map((txn) => (
            <div
              key={txn.id}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-pink-50/20 transition-colors"
            >
              <div className="flex items-start sm:items-center gap-4">
                <div className="h-10 w-10 rounded-xl bg-pink-100 text-primary flex items-center justify-center shrink-0">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-slate-900 text-sm">{txn.order_number}</span>
                    <Badge variant="success" className="text-[10px] uppercase font-extrabold">
                      {txn.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-500 block">
                    {txn.date} • {txn.method} (ending in {txn.card_last4})
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 self-end sm:self-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <span className="text-base font-black text-slate-900 block">
                    {formatCurrency(txn.amount)}
                  </span>
                  <span className="text-[11px] text-slate-400">Upfront Stripe Pay</span>
                </div>

                {txn.receipt_url && (
                  <a
                    href={txn.receipt_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-primary hover:bg-pink-50 transition-colors"
                    title="View Stripe Digital Receipt"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
