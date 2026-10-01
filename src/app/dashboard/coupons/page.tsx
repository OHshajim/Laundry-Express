"use client";

import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { CouponsManager } from "@/components/admin/coupons-manager";

export default function CouponsPage() {
  return (
    <DashboardPageLayout
      activeSection="coupons"
      title="Promotional Coupons & Discounts"
      subtitle="Create, edit, toggle active status, and audit redemption thresholds for marketing codes"
    >
      <CouponsManager />
    </DashboardPageLayout>
  );
}
