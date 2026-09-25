import * as React from "react";
import { cn } from "@/lib/utils";

export type CardVariant = "default" | "interactive" | "hero" | "flat" | "glass";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

/**
 * Card Component
 *
 * Core container block for services, plans, and order wizards.
 * Supports glassmorphism, interactive hover lifting, and brand borders.
 */
export function Card({
  className,
  variant = "default",
  children,
  ...props
}: CardProps) {
  const variantStyles: Record<CardVariant, string> = {
    default: "border-slate-200 bg-white shadow-2xs hover:shadow-md hover:border-sky-200",
    interactive: "border-slate-200 bg-white shadow-xs hover:shadow-xl hover:border-sky-400 hover:-translate-y-0.5 cursor-pointer",
    hero: "border-2 border-sky-300 bg-gradient-to-b from-white to-sky-50/40 shadow-xl",
    flat: "border-slate-200 bg-slate-50 shadow-none",
    glass: "border-white/60 bg-white/80 backdrop-blur-md shadow-lg",
  };

  return (
    <div
      className={cn(
        "rounded-3xl border transition-all duration-200 overflow-hidden",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pb-3 border-b border-slate-100 flex flex-col gap-1", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg sm:text-xl font-black text-slate-900 tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs sm:text-sm text-slate-500 font-medium", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 text-xs text-slate-600", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "p-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
