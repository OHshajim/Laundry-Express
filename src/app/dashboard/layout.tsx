"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  CreditCard,
  Star,
  PlusCircle,
  Phone,
  ArrowLeft,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotBadge } from "@/components/shared/mascot-badge";
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
];

/**
 * CustomerDashboardLayout Component
 *
 * Provides customer authenticated navigation with:
 * - Bubble Pink (#EC4899) active navigation indicators
 * - Responsive desktop sidebar & mobile drawer menu
 * - Customer identity badge and quick "Book Pickup" action
 */
export default function CustomerDashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#F8FAFC]">
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-pink-100 shadow-xs sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2">
          <MascotBadge size="xs" />
          <span className="font-black text-slate-900 text-sm">Laundry Express</span>
        </Link>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-xl text-slate-700 hover:text-[#EC4899] hover:bg-pink-50"
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Responsive Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-pink-100 flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6">
          {/* Brand & Customer Identity */}
          <div className="flex items-center gap-3 pb-5 border-b border-pink-50">
            <MascotBadge size="sm" />
            <div>
              <span className="font-extrabold text-slate-900 text-sm block">Customer Portal</span>
              <span className="text-[11px] text-[#EC4899] font-bold block">
                {CURRENT_CUSTOMER.full_name}
              </span>
            </div>
          </div>

          {/* Navigation Links with Bubble Pink Active State */}
          <nav className="space-y-1.5" aria-label="Customer Navigation">
            {DASHBOARD_NAV.map((item) => {
              const active = isActive(item.href, item.exact);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    active
                      ? "bg-[#EC4899] text-white shadow-md shadow-pink-500/25"
                      : "text-slate-600 hover:bg-pink-50 hover:text-[#EC4899]"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Support & Back to Site */}
        <div className="p-6 border-t border-pink-50 space-y-3">
          <Link href="/order" className="block">
            <Button className="w-full bg-[#EC4899] hover:bg-[#BE185D] text-white shadow-md shadow-pink-500/20 text-xs">
              <PlusCircle className="h-4 w-4 mr-2" />
              <span>Book New Pickup</span>
            </Button>
          </Link>

          <div className="p-3 rounded-xl bg-pink-50/60 border border-pink-100 text-[11px] text-slate-600 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <ShieldCheck className="h-3.5 w-3.5 text-[#EC4899]" />
              <span>Doorstep Photo Support</span>
            </div>
            <a
              href={`tel:${APP_CONFIG.supportPhone}`}
              className="text-[#EC4899] font-bold hover:underline flex items-center gap-1"
            >
              <Phone className="h-3 w-3" />
              <span>{APP_CONFIG.supportPhone}</span>
            </a>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors pt-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Return to Main Website</span>
          </Link>
        </div>
      </aside>

      {/* Main Dashboard Workspace Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Strip */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-pink-100 shadow-2xs">
          <div>
            <h1 className="text-lg font-black text-slate-900">
              Welcome Back, {CURRENT_CUSTOMER.full_name}
            </h1>
            <p className="text-xs text-slate-500">
              Lake in the Hills Hub • Serving 30-Mile Radius • 2+ Bags = FREE Delivery
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a href={`tel:${APP_CONFIG.supportPhone}`}>
              <Button variant="outline" size="sm" className="text-xs border-slate-300">
                <Phone className="h-3.5 w-3.5 mr-1.5 text-[#EC4899]" />
                <span>Support: {APP_CONFIG.supportPhone}</span>
              </Button>
            </a>
            <Link href="/order">
              <Button size="sm" className="bg-[#EC4899] hover:bg-[#BE185D] text-white text-xs">
                <span>Book Pickup</span>
              </Button>
            </Link>
          </div>
        </header>

        {/* Dynamic Nested Page Content */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">{children}</div>
      </main>
    </div>
  );
}
