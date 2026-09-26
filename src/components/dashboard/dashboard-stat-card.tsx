"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";

export type StatBadgeVariant = "success" | "warning" | "info" | "neutral" | "primary";

export interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: StatBadgeVariant;
  };
  trend?: {
    text: string;
    positive?: boolean;
  };
  accent?: "primary" | "emerald" | "sky" | "amber";
  className?: string;
  onClick?: () => void;
}

const BADGE_STYLES: Record<StatBadgeVariant, string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  warning: "bg-amber-50 text-amber-700 border-amber-200/80",
  info: "bg-sky-50 text-sky-700 border-sky-200/80",
  neutral: "bg-slate-50 text-slate-600 border-slate-200/80",
  primary: "bg-primary/10 text-primary border-primary/20",
};

const ACCENT_STYLES = {
  primary: "bg-primary/10 text-primary border-primary/20",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-200/60",
  sky: "bg-sky-50 text-sky-600 border-sky-200/60",
  amber: "bg-amber-50 text-amber-600 border-amber-200/60",
};

/**
 * DashboardStatCard Component
 *
 * Reusable light-themed highlight card shared across both Admin and Customer dashboards.
 * Displays key KPIs, volumetric loads, revenue metrics, or account highlights with:
 * - High-contrast readable typography
 * - Soft pastel icon containers with responsive sizing
 * - Status pills and trend badges
 * - Overflow-safe text truncation and word-wrapping
 * - Strictly compliant with the 100-250 lines rule
 */
export function DashboardStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  trend,
  accent = "primary",
  className = "",
  onClick,
}: DashboardStatCardProps) {
  const isClickable = !!onClick;

  return (
    <div
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      className={`p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs transition-all duration-200 flex flex-col justify-between min-w-0 overflow-hidden ${
        isClickable
          ? "cursor-pointer hover:shadow-md hover:border-primary/40 active:scale-[0.99]"
          : "hover:border-slate-300"
      } ${className}`}
    >
      {/* Top Header Row: Title & Optional Icon */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <span className="text-xs font-bold text-slate-500 truncate block">
          {title}
        </span>

        {Icon && (
          <div
            className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border ${ACCENT_STYLES[accent]}`}
          >
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      {/* Main Metric Value */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl font-black text-slate-900 tracking-tight break-words">
            {value}
          </span>

          {trend && (
            <span
              className={`text-xs font-bold ${
                trend.positive ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {trend.text}
            </span>
          )}
        </div>

        {/* Subtitle / Helper Description */}
        {subtitle && (
          <p className="text-[11px] text-slate-500 font-medium leading-relaxed break-words">
            {subtitle}
          </p>
        )}
      </div>

      {/* Optional Status Badge Pill */}
      {badge && (
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center">
          <span
            className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              BADGE_STYLES[badge.variant || "neutral"]
            }`}
          >
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
}

export default DashboardStatCard;
