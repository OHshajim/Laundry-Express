"use client";

import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { PackagesManager } from "@/components/admin/packages-manager";

export default function PackagesPage() {
  return (
    <DashboardPageLayout
      activeSection="packages"
      title="Saver Packages & Bundles"
      subtitle="Configure prepaid laundry credits with clear placeholders, textarea highlights, and instant activation toggles"
    >
      <PackagesManager />
    </DashboardPageLayout>
  );
}
