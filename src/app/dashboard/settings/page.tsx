"use client";

import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { AdminSettingsManager } from "@/components/admin/admin-settings-manager";
import { DashboardSettings } from "@/components/dashboard/dashboard-settings";
import { useAuth } from "@/context/auth-context";

export default function OperationsSettingsPage() {
  const { isAdmin } = useAuth();

  return (
    <DashboardPageLayout
      activeSection={isAdmin ? "settings" : "account_settings"}
      title={isAdmin ? "Operations, Facility & Rate Settings" : "Account Settings"}
      subtitle={isAdmin ? "Configure physical facility address, native clock pickup slots, service rates, and coverage zones" : "Manage your profile, doorstep address, and security credentials"}
    >
      {isAdmin ? <AdminSettingsManager /> : <DashboardSettings />}
    </DashboardPageLayout>
  );
}
