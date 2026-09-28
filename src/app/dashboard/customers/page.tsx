"use client";

import * as React from "react";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { CustomersManager } from "@/components/admin/customers-manager";
import type { CustomerAccount } from "@/components/admin/customer-detail-modal";

export default function CustomersPage() {
  const [customers, setCustomers] = React.useState<CustomerAccount[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.customers)) setCustomers(data.customers);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  return (
    <DashboardPageLayout
      activeSection="customers"
      title="Customer Accounts & Profiles"
      subtitle="Inspect customer order frequencies, saved doorstep addresses, and verified accounts"
    >
      {isLoading ? (
        <div className="h-64 rounded-3xl bg-slate-100 animate-pulse" />
      ) : (
        <CustomersManager customers={customers} />
      )}
    </DashboardPageLayout>
  );
}
