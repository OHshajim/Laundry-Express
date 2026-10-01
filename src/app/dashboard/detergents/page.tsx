"use client";

import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { DetergentsManager } from "@/components/admin/detergents-manager";

export default function DetergentsPage() {
  return (
    <DashboardPageLayout
      activeSection="detergents"
      title="Detergent Options & Fabric Safety"
      subtitle="Standardized on 100% cold-water eco wash cycle for all garments with custom detergent selections"
    >
      <DetergentsManager />
    </DashboardPageLayout>
  );
}
