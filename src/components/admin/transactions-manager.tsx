"use client";

import * as React from "react";
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  INITIAL_ADMIN_TRANSACTIONS,
  getTransactionSummaryStats,
  type AdminPaymentTransaction,
} from "@/lib/mock-transactions-data";

interface TransactionsManagerProps {
  onViewOrder?: (orderId: string) => void;
}

/**
 * TransactionsManager Component
 * Searchable & filterable table of customer payments with zero horizontal scrolling.
 */
export function TransactionsManager({ onViewOrder }: TransactionsManagerProps) {
  const [transactions] = React.useState<AdminPaymentTransaction[]>(INITIAL_ADMIN_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<"all" | "today" | "month">("month");

  const { totalRevenue, totalRefunds, pendingCount } = getTransactionSummaryStats(transactions);

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.stripe_payment_intent.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;

    let matchesDate = true;
    if (dateRange === "today") {
      const todayStr = new Date().toISOString().split("T")[0];
      matchesDate = txn.date.startsWith(todayStr);
    } else if (dateRange === "month") {
      const monthPrefix = new Date().toISOString().substring(0, 7);
      matchesDate = txn.date.startsWith(monthPrefix);
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6">
      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue (This Month)
            </span>
            <p className="text-2xl font-black text-slate-900">{formatCurrency(totalRevenue)}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Refunds Issued
            </span>
            <p className="text-2xl font-black text-rose-600">{formatCurrency(totalRefunds)}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pending Stripe Holds
            </span>
            <p className="text-2xl font-black text-amber-600">{pendingCount}</p>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <AlertCircle className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer, order #, or PI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#EC4899]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <Calendar className="h-3.5 w-3.5 text-slate-500 ml-2" />
            <button
              onClick={() => setDateRange("month")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateRange === "month" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
            >
              This Month
            </button>
            <button
              onClick={() => setDateRange("today")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateRange === "today" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
            >
              Today
            </button>
            <button
              onClick={() => setDateRange("all")}
              className={`px-3 py-1.5 rounded-lg transition-colors ${dateRange === "all" ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
            >
              All Time
            </button>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <Filter className="h-3.5 w-3.5 text-slate-500 ml-2" />
            {(["all", "succeeded", "pending", "refunded"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 rounded-lg capitalize transition-colors ${statusFilter === st ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">Date &amp; Time</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Order #</th>
              <th className="py-3.5 px-4">Method</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Stripe Intent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-pink-50/30 transition-colors">
                <td className="py-3.5 px-4 text-xs text-slate-600">
                  {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="py-3.5 px-4">
                  <p className="font-bold text-slate-900">{txn.customer_name}</p>
                  <p className="text-xs text-slate-500">{txn.customer_email}</p>
                </td>
                <td className="py-3.5 px-4">
                  <button
                    onClick={() => onViewOrder && onViewOrder(txn.order_id)}
                    className="font-mono text-xs font-bold text-[#EC4899] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    {txn.order_number}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </td>
                <td className="py-3.5 px-4 text-xs font-semibold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                    {txn.method} (•••• {txn.card_last4})
                  </span>
                </td>
                <td className="py-3.5 px-4 font-black text-slate-900">{formatCurrency(txn.amount)}</td>
                <td className="py-3.5 px-4">
                  <Badge variant={txn.status === "succeeded" ? "success" : txn.status === "refunded" ? "danger" : "warning"}>
                    {txn.status}
                  </Badge>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{txn.stripe_payment_intent.slice(0, 14)}...</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {filteredTransactions.map((txn) => (
          <div key={txn.id} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900 text-sm">{txn.customer_name}</p>
                <p className="text-xs text-slate-500">{new Date(txn.date).toLocaleDateString()}</p>
              </div>
              <Badge variant={txn.status === "succeeded" ? "success" : txn.status === "refunded" ? "danger" : "warning"}>
                {txn.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">Order: <strong className="text-slate-900">{txn.order_number}</strong></span>
              <span className="text-base font-black text-slate-900">{formatCurrency(txn.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsManager;
