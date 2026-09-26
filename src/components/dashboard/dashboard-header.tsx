"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MascotBadge } from "@/components/shared/mascot-badge";

export interface DashboardHeaderProps {
  title: string;
  subtitle?: string;
  badgeText?: string;
  badgeVariant?: "success" | "warning" | "info" | "primary" | "neutral";
  actions?: React.ReactNode;
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
  portalName?: string;
  showBackToSite?: boolean;
}

const BADGE_CLASSES = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
  primary: "bg-primary/10 text-primary border-primary/20",
  neutral: "bg-slate-100 text-slate-700 border-slate-200",
};

/**
 * DashboardHeader Component
 *
 * Unified light-themed top navigation header shared across both Admin and Customer dashboards.
 * Provides:
 * - Responsive desktop title, subtitle, and action buttons
 * - Mobile hamburger trigger with live drawer state
 * - Clean white background with slate border and soft shadow
 * - Back to live site link and action button slots
 * - Strict adherence to the 100-250 lines rule
 */
export function DashboardHeader({
  title,
  subtitle,
  badgeText,
  badgeVariant = "primary",
  actions,
  onToggleMobileMenu,
  mobileMenuOpen = false,
  portalName = "Dashboard",
  showBackToSite = false,
}: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-20 shadow-2xs">
      {/* Mobile Top Bar (< lg screens) */}
      <div className="lg:hidden flex items-center justify-between p-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          {onToggleMobileMenu && (
            <button
              type="button"
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl text-slate-700 hover:text-primary hover:bg-pink-50 transition-colors"
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}

          <Link href="/" className="flex items-center gap-2">
            <MascotBadge size="xs" />
            <span className="font-black text-slate-900 text-xs truncate">
              {portalName}
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          {showBackToSite && (
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-xs text-slate-600 hover:text-primary px-2.5">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                <span>Site</span>
              </Button>
            </Link>
          )}

          {actions}
        </div>
      </div>

      {/* Desktop Bar (>= lg screens) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3.5 max-w-full">
        <div className="min-w-0 pr-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-base font-black text-slate-900 tracking-tight truncate">
              {title}
            </h1>

            {badgeText && (
              <span
                className={`inline-flex items-center text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${BADGE_CLASSES[badgeVariant]}`}
              >
                {badgeText}
              </span>
            )}
          </div>

          {subtitle && (
            <p className="text-xs text-slate-500 font-medium truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Right Action Slot */}
        <div className="flex items-center gap-3 shrink-0">
          {showBackToSite && (
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="text-xs border-slate-200 text-slate-600 hover:text-slate-900 h-8.5"
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                <span>Live Website</span>
              </Button>
            </Link>
          )}

          {actions}
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
