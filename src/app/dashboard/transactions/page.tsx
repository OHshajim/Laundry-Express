"use client";

import * as React from "react";
import { CreditCard, ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { TransactionsManager } from "@/components/admin/transactions-manager";
import { useOrdersRealtime } from "@/hooks/use-orders-realtime";
import type { Order } from "@/types";

interface CustomerTxn {
  id: string;
  order_number: string;
  amount: number;
  status: "succeeded" | "pending" | "failed" | "refunded";
  date: string;
  method: string;
  card_last4: string;
  receipt_url?: string;
}

export default function TransactionsUnifiedPage() {
  const { user, isAdmin } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const loadOrders = React.useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data.orders)) setOrders(data.orders);
    } catch {}
    finally { setIsLoading(false); }
  }, []);

  useOrdersRealtime({
    onEvent: (event) => {
      const isRelevant = isAdmin || (user && (event.userId === user.id || event.customerEmail === user.email))
        || orders.some((o) => o.id === event.orderId || o.order_number === event.orderNumber);
      if (isRelevant) void loadOrders();
    },
  });

  React.useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  const transactions: CustomerTxn[] = React.useMemo(() => {
    return orders.map((o) => ({
      id: `txn-${o.id}`,
      order_number: o.order_number,
      amount: o.total_amount,
      status: o.payment_status === "paid" ? "succeeded"
        : o.payment_status === "refunded" ? "refunded"
          : o.payment_status === "failed" ? "failed" : "pending",
      date: o.created_at ? new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Today",
      method: o.payment_method === "card" ? "Credit Card" : o.payment_method === "apple_pay" ? "Apple Pay" : o.payment_method === "google_pay" ? "Google Pay" : "Doorstep Payment",
      card_last4: o.payment_method === "card" ? "Online" : "",
      receipt_url: o.stripe_payment_intent ? `https://dashboard.stripe.com/payments/${o.stripe_payment_intent}` : undefined,
    }));
  }, [orders]);

  const filtered = transactions.filter((txn) => {
    const matchesSearch =
      txn.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.method.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || txn.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPaid = transactions.filter((t) => t.status === "succeeded").reduce((acc, t) => acc + t.amount, 0);

  return (
    <DashboardPageLayout
      activeSection="transactions"
      title={isAdmin ? "Transaction & Payment History" : "Payments & Billing Records"}
      subtitle={isAdmin ? "Stripe payment intents, receipts, and order billing logs" : "Verified Stripe payment transactions for all your doorstep services"}
    >
      {isAdmin ? (
        <TransactionsManager orders={orders} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 block">Total Lifetime Paid</span>
              <span className="text-2xl font-black text-slate-900">{formatCurrency(totalPaid)}</span>
              <span className="text-[11px] text-emerald-600 font-semibold block">All transactions settled</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-pink-100 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-500 block">Payment Security</span>
              <span className="text-sm font-black text-slate-900 block">Stripe 256-Bit SSL Encrypted</span>
              <span className="text-[11px] text-slate-400 font-medium block">PCI-DSS Level 1 Compliant</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search order or method..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label htmlFor="txn-status-filter" className="text-xs font-bold text-slate-500">Status:</label>
              <select
                id="txn-status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-300 text-slate-900 text-xs font-bold py-1.5 px-3 rounded-xl cursor-pointer"
              >
                <option value="all">All Payments</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>
          </div>

          <div className="rounded-3xl bg-white border border-slate-200 shadow-xs overflow-hidden">
            <div className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs italic">
                  {isLoading ? "Loading transactions..." : "No payment records found."}
                </div>
              ) : (
                filtered.map((txn) => (
                  <div key={txn.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-pink-50/20">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-pink-100 text-primary flex items-center justify-center shrink-0">
                        <CreditCard className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-slate-900 text-xs sm:text-sm">#{txn.order_number}</span>
                          <Badge variant={txn.status === "succeeded" ? "success" : txn.status === "pending" ? "warning" : "danger"} className="text-[10px] uppercase font-bold">{txn.status}</Badge>
                        </div>
                        <span className="text-[11px] text-slate-500 block">{txn.date} • {txn.method}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                      <span className="text-sm sm:text-base font-black text-slate-900">{formatCurrency(txn.amount)}</span>
                      {txn.receipt_url && (
                        <a href={txn.receipt_url} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg text-slate-400 hover:text-primary">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
}
