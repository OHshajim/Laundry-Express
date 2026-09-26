"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Star,
  Settings,
  PlusCircle,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotBadge } from "@/components/shared/mascot-badge";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { APP_CONFIG } from "@/lib/constants";
import { CURRENT_CUSTOMER } from "@/lib/mock-customer-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DASHBOARD_NAV = [
  { href: "/dashboard", label: "Dashboard Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/orders", label: "My Orders & Tracking", icon: ShoppingBag, exact: false },
  { href: "/dashboard/transactions", label: "Payment History", icon: CreditCard, exact: false },
  { href: "/dashboard/ratings", label: "Ratings & Reviews", icon: Star, exact: false },
  { href: "/dashboard/settings", label: "Account Settings", icon: Settings, exact: false },
];

/**
 * CustomerDashboardLayout Component
 *
 * Provides customer authenticated navigation with:
 * - Slim, proportional light sidebar (w-60) matching the Admin dashboard
 * - Responsive desktop sidebar & mobile drawer menu with backdrop blur
 * - Reusable DashboardHeader with live status and quick action slots
 * - Strict overflow-x-hidden safety preventing cutoffs on any screen size
 * - Strict adherence to the 100-250 lines rule
 */
export default function CustomerDashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50/60 w-full overflow-x-hidden">
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Slim Proportional Light Sidebar (w-60 desktop & mobile drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-60 bg-white border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-200 shrink-0 shadow-2xs lg:static lg:translate-x-0 ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-4 space-y-4">
          {/* Brand & Customer Identity */}
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <MascotBadge size="xs" />
            <div className="min-w-0">
              <span className="font-black text-slate-900 text-xs block truncate">Customer Portal</span>
              <span className="text-[11px] text-primary font-bold block truncate">
                {CURRENT_CUSTOMER.full_name}
              </span>
            </div>
          </div>

          {/* Compact Navigation Links */}
          <nav className="space-y-1" aria-label="Customer Navigation">
            {DASHBOARD_NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${active
                    ? "bg-primary text-white shadow-xs shadow-primary/25"
                    : "text-slate-600 hover:bg-pink-50/70 hover:text-primary"
                    }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Compact Sidebar Footer */}
        <div className="p-3.5 border-t border-slate-100 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-slate-900 transition-colors pt-0.5 px-1"
          >
            <ArrowLeft className="h-3 w-3 shrink-0" />
            <span>Back to Home</span>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard Workspace Content */}
      <main className="flex-1 flex flex-col min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden">
        {/* Reusable DashboardHeader Component */}
        <DashboardHeader
          title={`Welcome Back, ${CURRENT_CUSTOMER.full_name}`}
          subtitle="Lake in the Hills Hub • Serving 30-Mile Radius • Daily 8am–12pm & 1pm–6pm"
          badgeText="Active Customer"
          badgeVariant="primary"
          portalName="Customer Portal"
          showBackToSite={false}
          onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
          actions={
            <Link href="/order">
              <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-xs h-8 shadow-xs">
                <PlusCircle className="h-3.5 w-3.5 mr-1" />
                <span>Book Pickup</span>
              </Button>
            </Link>
          }
        />

        {/* Dynamic Nested Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto space-y-6 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}
