"use client";

import * as React from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { useAuth } from "@/context/auth-context";
import { AdminOverview } from "@/components/admin/admin-overview";
import { CustomerOverview } from "@/components/dashboard/customer-overview";
import type { Order } from "@/types";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";

export default function DashboardOverviewMasterPage() {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [customers, setCustomers] = React.useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchPromises: Promise<any>[] = [
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data.orders)) setOrders(data.orders);
        })
        .catch(() => {}),
    ];

    if (isAdmin) {
      fetchPromises.push(
        fetch("/api/customers")
          .then((r) => r.json())
          .then((data) => {
            if (Array.isArray(data.customers)) setCustomers(data.customers);
          })
          .catch(() => {})
      );
    }

    Promise.all(fetchPromises).finally(() => setIsLoading(false));
  }, [isAdmin]);

  return (
    <DashboardPageLayout
      activeSection="overview"
      title={isAdmin ? "Operations Overview & Telemetry" : "Customer Dashboard"}
      subtitle={
        isAdmin
          ? "Real-time sales metrics, completed order earnings, and incoming wash pipeline"
          : "Track your transaction totals, orders overview, and turnaround journey"
      }
      actions={
        !isAdmin ? (
          <Link href="/order">
            <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 shadow-xs font-bold">
              <PlusCircle className="h-3.5 w-3.5 mr-1" />
              <span>Book Pickup</span>
            </Button>
          </Link>
        ) : undefined
      }
    >
      {isLoading ? (
        <div className="h-96 rounded-3xl bg-slate-100 animate-pulse" />
      ) : isAdmin ? (
        <AdminOverview orders={orders} customers={customers} />
      ) : (
        <CustomerOverview orders={orders} />
      )}
    </DashboardPageLayout>
  );
}
