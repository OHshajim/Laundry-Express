import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "hero"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "accent";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Button Component
 *
 * Primary interactive element across Laundry Express.
 * Implements accessible touch targets (min 44px for sm/md/lg),
 * micro-interactions (active:scale-[0.98]), and brand theme gradients.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E88C7] focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] select-none cursor-pointer whitespace-nowrap shrink-0 max-w-full";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-[#1E88C7] text-white hover:bg-[#1670a5] hover:text-white shadow-sm active:bg-[#125c88]",
      hero:
        "bg-[#D63A3A] text-white hover:bg-[#b82e2e] hover:text-white shadow-lg shadow-rose-500/25 active:shadow-md",
      secondary:
        "bg-[#B9E1F5]/40 text-[#141B2E] hover:bg-[#B9E1F5] hover:text-[#141B2E] border border-[#B9E1F5] active:bg-[#B9E1F5]/70",
      outline:
        "border border-slate-300 bg-white text-[#141B2E] hover:bg-slate-100 hover:text-[#1E88C7] hover:border-slate-400 active:bg-slate-200",
      ghost:
        "text-[#141B2E] hover:text-[#1E88C7] hover:bg-[#B9E1F5]/30 active:bg-[#B9E1F5]/50",
      danger:
        "bg-[#D63A3A] text-white hover:bg-[#b82e2e] hover:text-white shadow-sm active:bg-[#a82525]",
      accent:
        "bg-[#F5A623] text-[#141B2E] hover:bg-[#e09216] hover:text-[#141B2E] shadow-md shadow-amber-400/20 font-black active:bg-[#c97f0a]",
    };

    const sizeStyles: Record<ButtonSize, string> = {
      xs: "min-h-[32px] px-2.5 text-[11px] gap-1 rounded-lg",
      sm: "min-h-[38px] px-3.5 text-xs gap-1.5",
      md: "min-h-[44px] px-5 text-sm gap-2",
      lg: "min-h-[48px] px-6 text-base gap-2.5",
      xl: "min-h-[56px] px-8 text-lg gap-3 rounded-2xl",
      icon: "h-11 w-11 p-0 shrink-0",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 shrink-0 text-current"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon && <span className="shrink-0 inline-flex items-center justify-center">{leftIcon}</span>
        )}

        <span className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0">
          {children}
        </span>

        {!isLoading && rightIcon && (
          <span className="shrink-0 inline-flex items-center justify-center">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
