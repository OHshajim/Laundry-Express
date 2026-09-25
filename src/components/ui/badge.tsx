import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "hero"
  | "outline"
  | "glass";

export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  dotColor?: string;
  icon?: React.ReactNode;
}

/**
 * Badge Component
 *
 * Micro-element used across Laundry Express for plan tags, delivery fee badges,
 * photo verification indicators, and order status pills.
 */
export function Badge({
  className,
  variant = "default",
  size = "md",
  dot = false,
  dotColor,
  icon,
  children,
  ...props
}: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-sky-50 text-sky-800 border-sky-200",
    secondary: "bg-slate-100 text-slate-700 border-slate-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    danger: "bg-rose-50 text-rose-800 border-rose-200",
    hero: "bg-gradient-to-r from-sky-500 to-rose-500 text-white border-transparent shadow-xs font-black",
    outline: "bg-white text-slate-700 border-slate-200",
    glass: "bg-white/80 backdrop-blur-xs text-slate-800 border-white/40 shadow-xs",
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
    lg: "px-3.5 py-1 text-xs sm:text-sm font-bold",
  };

  const defaultDotColors: Record<BadgeVariant, string> = {
    default: "bg-sky-500",
    secondary: "bg-slate-400",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-rose-500",
    hero: "bg-white",
    outline: "bg-slate-400",
    glass: "bg-sky-400",
  };

  return (
    <div
      role="status"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold border transition-all duration-150 select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            dotColor || defaultDotColors[variant]
          )}
          aria-hidden="true"
        />
      )}

      {icon && (
        <span className="shrink-0 flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}

      <span>{children}</span>
    </div>
  );
}

/**
 * StatusBadge Component
 *
 * Specialized badge wrapper with automatic pulsating dot indicator for live orders.
 */
export function StatusBadge({
  statusText,
  variant = "default",
  isLive = false,
}: {
  statusText: string;
  variant?: BadgeVariant;
  isLive?: boolean;
}) {
  return (
    <Badge variant={variant} dot={isLive}>
      <span>{statusText}</span>
    </Badge>
  );
}
