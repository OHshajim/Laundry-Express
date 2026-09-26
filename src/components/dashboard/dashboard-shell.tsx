"use client";

import * as React from "react";
import { DashboardSidebar, type DashboardRole } from "./dashboard-sidebar";
import { DashboardHeader, type DashboardHeaderProps } from "./dashboard-header";

export interface DashboardShellProps {
  role: DashboardRole;
  userName?: string;
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: DashboardHeaderProps["badgeVariant"];
  actions?: React.ReactNode;
  activeSection?: string;
  onSelectSection?: (section: string) => void;
  activeAdminSection?: string;
  onSelectAdminSection?: (section: any) => void;
  ordersCount?: number;
  customersCount?: number;
  pendingReviewsCount?: number;
  children: React.ReactNode;
}

/**
 * Unified DashboardShell Component
 *
 * Single shared layout container for both Customer and Admin dashboards:
 * - Common responsive desktop/mobile frame with light theme
 * - Sticky, fixed 100vh height sidebar preventing dynamic stretching
 * - Coordinated mobile drawer state with hamburger trigger in DashboardHeader
 * - Strict adherence to the < 250 lines rule
 */
export function DashboardShell({
  role,
  userName,
  title,
  subtitle,
  badgeText,
  badgeVariant = "primary",
  actions,
  activeSection,
  onSelectSection,
  activeAdminSection,
  onSelectAdminSection,
  ordersCount,
  customersCount,
  pendingReviewsCount,
  children,
}: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/60 w-full overflow-x-clip">
      {/* Unified Role-Aware Sidebar */}
      <DashboardSidebar
        role={role}
        userName={userName}
        activeSection={activeSection || activeAdminSection}
        onSelectSection={onSelectSection || onSelectAdminSection}
        ordersCount={ordersCount}
        customersCount={customersCount}
        pendingReviewsCount={pendingReviewsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col min-w-0 w-full max-w-full">
        {/* Unified Light Header */}
        <DashboardHeader
          title={title}
          subtitle={subtitle}
          badgeText={badgeText}
          badgeVariant={badgeVariant}
          portalName={role === "admin" ? "Admin Operations" : "Customer Portal"}
          showBackToSite={false}
          actions={actions}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        />

        {/* Dynamic Nested Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
