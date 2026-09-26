"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ListOrdered,
  Sliders,
  Package,
  Sparkles,
  Tag,
  MessageSquare,
  ArrowLeft,
  Menu,
  X,
  Users,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type AdminSection =
  | "orders"
  | "customers"
  | "transactions"
  | "rates"
  | "packages"
  | "detergents"
  | "coupons"
  | "reviews";

interface AdminSidebarProps {
  activeSection: AdminSection;
  onSelectSection: (section: AdminSection) => void;
  ordersCount?: number;
  customersCount?: number;
  pendingReviewsCount?: number;
}

interface NavItem {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

/**
 * AdminSidebar Component
 *
 * Dedicated vertical operations navigation replacing legacy horizontal tabs.
 * Provides instant switching across Orders, Customers, Rates, Packages,
 * Detergents, Promo Coupons, and Review Moderation.
 */
export function AdminSidebar({
  activeSection,
  onSelectSection,
  ordersCount = 0,
  customersCount = 0,
  pendingReviewsCount = 0,
}: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navItems: NavItem[] = [
    {
      id: "orders",
      label: "Orders Pipeline",
      icon: ListOrdered,
      badge: ordersCount > 0 ? ordersCount : undefined,
    },
    {
      id: "customers",
      label: "Customers Directory",
      icon: Users,
      badge: customersCount > 0 ? customersCount : undefined,
    },
    {
      id: "transactions",
      label: "Transaction History",
      icon: CreditCard,
    },
    { id: "rates", label: "Rates & Free Delivery", icon: Sliders },
    { id: "packages", label: "Packages & Bundles", icon: Package },
    { id: "detergents", label: "Detergent Catalog", icon: Sparkles },
    { id: "coupons", label: "Promo Coupons", icon: Tag },
    {
      id: "reviews",
      label: "Review Moderation",
      icon: MessageSquare,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
  ];

  const handleSelect = (id: AdminSection) => {
    onSelectSection(id);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-black text-white border-r border-neutral-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-neutral-700 shrink-0">
            <Image
              src="/brand/logo-badge.jpg"
              alt="Laundry Express Admin"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <span className="font-black text-base text-white tracking-tight block truncate">
              Laundry Express
            </span>
            <span className="text-[11px] text-[#E91E63] font-bold block drop-shadow-[0_0_8px_rgba(233,30,99,0.5)]">
              Admin Dashboard
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-neutral-400 hover:text-white"
          aria-label="Close Sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Navigation Links with Glowing Punch-Pink */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
        <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500 px-3 block mb-2">
          Operations &amp; Catalog
        </span>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer ${
                isActive
                  ? "bg-[#E91E63] text-white shadow-[0_0_20px_rgba(233,30,99,0.55)] border border-[#E91E63]"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-900 hover:shadow-[0_0_12px_rgba(233,30,99,0.25)]"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-white" : "text-neutral-400"}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ${
                    isActive ? "bg-white text-[#E91E63]" : "bg-[#E91E63] text-white shadow-[0_0_8px_rgba(233,30,99,0.5)]"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-neutral-800 space-y-3">
        <Link href="/">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-neutral-900 text-neutral-200 border-neutral-800 hover:bg-neutral-800 hover:text-white text-xs justify-center"
          >
            <ArrowLeft className="h-3.5 w-3.5 mr-1.5 shrink-0" />
            <span>Return to Live Site</span>
          </Button>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Navigation Header */}
      <div className="lg:hidden bg-black text-white p-4 flex items-center justify-between border-b border-neutral-800 sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800"
            aria-label="Open Operations Menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-black text-sm text-white">Admin Dashboard</span>
        </div>

        <Link href="/">
          <Button variant="ghost" size="sm" className="text-xs text-neutral-300 hover:text-[#E91E63]">
            <ArrowLeft className="h-3.5 w-3.5 mr-1" />
            Live Site
          </Button>
        </Link>
      </div>

      {/* Mobile Backdrop Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xs"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop Fixed Side Rail */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0">
        {sidebarContent}
      </aside>
    </>
  );
}

export default AdminSidebar;
