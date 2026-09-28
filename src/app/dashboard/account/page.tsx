"use client";

import * as React from "react";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { DashboardSettings } from "@/components/dashboard/dashboard-settings";
import { useAuth } from "@/context/auth-context";

export default function AccountSettingsPage() {
  const { isAdmin } = useAuth();

  return (
    <DashboardPageLayout
      activeSection="account_settings"
      title={isAdmin ? "Administrator Account Settings" : "Customer Account & Address Settings"}
      subtitle="Manage profile details, pick verified delivery coverage areas, and manage credentials"
    >
      <DashboardSettings />
    </DashboardPageLayout>
  );
}
