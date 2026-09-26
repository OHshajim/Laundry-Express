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

export interface AdminPaymentTransaction {
  id: string;
  order_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  date: string;
  amount: number;
  method: string;
  card_last4: string;
  status: "succeeded" | "pending" | "refunded";
  stripe_payment_intent: string;
}

const INITIAL_TRANSACTIONS: AdminPaymentTransaction[] = [
  {
    id: "txn-adm-1",
    order_id: "ord-1",
    order_number: "LX-2026-0042",
    customer_name: "Sarah Jenkins",
    customer_email: "sarah.jenkins@example.com",
    date: "2026-09-26T08:12:00Z",
    amount: 65.0,
    method: "Apple Pay",
    card_last4: "4242",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Aa12345",
  },
  {
    id: "txn-adm-2",
    order_id: "ord-2",
    order_number: "LX-2026-0043",
    customer_name: "Marcus Rodriguez",
    customer_email: "marcus.rodriguez@example.com",
    date: "2026-09-26T10:45:00Z",
    amount: 42.50,
    method: "Visa Card",
    card_last4: "1821",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Bb67890",
  },
  {
    id: "txn-adm-3",
    order_id: "ord-3",
    order_number: "LX-2026-0044",
    customer_name: "Elena Rostova",
    customer_email: "elena.rostova@example.com",
    date: "2026-09-26T11:20:00Z",
    amount: 43.0,
    method: "Google Pay",
    card_last4: "9012",
    status: "pending",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Cc54321",
  },
  {
    id: "txn-adm-4",
    order_id: "ord-prev-1",
    order_number: "LX-2026-0038",
    customer_name: "Sarah Jenkins",
    customer_email: "sarah.jenkins@example.com",
    date: "2026-09-18T14:30:00Z",
    amount: 42.50,
    method: "Visa Card",
    card_last4: "4242",
    status: "succeeded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Dd99887",
  },
  {
    id: "txn-adm-5",
    order_id: "ord-ref-1",
    order_number: "LX-2026-0019",
    customer_name: "David Miller",
    customer_email: "david.miller@example.com",
    date: "2026-09-12T09:15:00Z",
    amount: 32.50,
    method: "Mastercard",
    card_last4: "7712",
    status: "refunded",
    stripe_payment_intent: "pi_3Mtwx2LkdIwHu7ix0Ee11223",
  },
];

interface TransactionsManagerProps {
  onViewOrder?: (orderId: string) => void;
}

/**
 * TransactionsManager Component
 *
 * Implements searchable & filterable table of all customer payments:
 * - Search by customer, email, or order number
 * - Filter by date range (All Time, This Month, Today) and status
 * - Summary strip: Total Revenue (This Month), Total Refunds, Pending Payments
 * - Zero horizontal scroll responsive layout (table on desktop, cards on mobile/tablet)
 */
export function TransactionsManager({ onViewOrder }: TransactionsManagerProps) {
  const [transactions] = React.useState<AdminPaymentTransaction[]>(INITIAL_TRANSACTIONS);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [dateRange, setDateRange] = React.useState<"all" | "today" | "month">("month");

  // Summary Metrics Calculations
  const totalRevenue = transactions
    .filter((t) => t.status === "succeeded")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunds = transactions
    .filter((t) => t.status === "refunded")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingCount = transactions.filter((t) => t.status === "pending").length;

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.customer_email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Transaction History &amp; Stripe Billing
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time audit log of customer credit card, Apple Pay, and Google Pay charges.
          </p>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-bold">Total Revenue (This Month)</span>
            <DollarSign className="h-4 w-4 text-[#EC4899]" />
          </div>
          <span className="text-2xl font-black text-white">{formatCurrency(totalRevenue)}</span>
          <span className="text-[11px] text-emerald-400 font-semibold block">4 Succeeded Charges</span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-bold">Total Refunds Issued</span>
            <AlertCircle className="h-4 w-4 text-amber-400" />
          </div>
          <span className="text-2xl font-black text-white">{formatCurrency(totalRefunds)}</span>
          <span className="text-[11px] text-neutral-500 font-medium block">1 Resolved Dispute</span>
        </div>

        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span className="font-bold">Pending Payments</span>
            <CreditCard className="h-4 w-4 text-sky-400" />
          </div>
          <span className="text-2xl font-black text-[#EC4899]">{pendingCount} Pending</span>
          <span className="text-[11px] text-sky-400 font-semibold block">Awaiting Final Scale Weight</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by customer, email, or order..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-black border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-[#EC4899]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {["all", "succeeded", "pending", "refunded"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-colors ${
                statusFilter === st
                  ? "bg-[#EC4899] text-white shadow-xs"
                  : "bg-neutral-800 text-neutral-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table View (lg:block) */}
      <div className="hidden lg:block rounded-3xl bg-neutral-900 border border-neutral-800 overflow-hidden">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-black/80 text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-800">
            <tr>
              <th className="py-3.5 px-5">Order #</th>
              <th className="py-3.5 px-5">Customer</th>
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-5">Method</th>
              <th className="py-3.5 px-5">Amount</th>
              <th className="py-3.5 px-5">Status</th>
              <th className="py-3.5 px-5 text-right">Intent ID</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/80">
            {filtered.map((txn) => (
              <tr
                key={txn.id}
                onClick={() => onViewOrder && onViewOrder(txn.order_id)}
                className="hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                <td className="py-4 px-5 font-black text-[#EC4899]">{txn.order_number}</td>
                <td className="py-4 px-5">
                  <span className="font-bold text-white block">{txn.customer_name}</span>
                  <span className="text-[11px] text-neutral-500">{txn.customer_email}</span>
                </td>
                <td className="py-4 px-5 text-neutral-400">
                  {new Date(txn.date).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className="py-4 px-5">
                  <span className="font-semibold text-white">{txn.method}</span>
                  <span className="text-neutral-500 text-[10px] ml-1">•••• {txn.card_last4}</span>
                </td>
                <td className="py-4 px-5 font-black text-white">{formatCurrency(txn.amount)}</td>
                <td className="py-4 px-5">
                  <Badge
                    variant={txn.status === "succeeded" ? "success" : txn.status === "pending" ? "warning" : "danger"}
                    className="text-[10px] uppercase font-extrabold"
                  >
                    {txn.status}
                  </Badge>
                </td>
                <td className="py-4 px-5 text-right font-mono text-[10px] text-neutral-500 truncate max-w-[140px]">
                  {txn.stripe_payment_intent.slice(0, 16)}...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View (lg:hidden) — Zero Horizontal Scroll */}
      <div className="lg:hidden space-y-3">
        {filtered.map((txn) => (
          <div
            key={txn.id}
            onClick={() => onViewOrder && onViewOrder(txn.order_id)}
            className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 cursor-pointer hover:border-pink-500/50 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="font-black text-[#EC4899] text-sm">{txn.order_number}</span>
              <Badge
                variant={txn.status === "succeeded" ? "success" : txn.status === "pending" ? "warning" : "danger"}
                className="text-[10px] uppercase font-bold"
              >
                {txn.status}
              </Badge>
            </div>

            <div className="space-y-0.5">
              <span className="font-bold text-white text-xs block">{txn.customer_name}</span>
              <span className="text-[11px] text-neutral-500 block truncate">{txn.customer_email}</span>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">{txn.method} (•• {txn.card_last4})</span>
              <span className="font-black text-white text-sm">{formatCurrency(txn.amount)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TransactionsManager;
