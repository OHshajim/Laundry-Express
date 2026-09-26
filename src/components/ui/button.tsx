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
      "inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl active:scale-[0.98] select-none cursor-pointer whitespace-nowrap shrink-0 max-w-full";

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        "bg-primary text-white hover:bg-primary-dark hover:text-white shadow-md shadow-primary/20 active:bg-primary-dark",
      hero:
        "bg-primary text-white hover:bg-primary-dark hover:text-white shadow-lg shadow-primary/25 active:bg-primary-dark",
      secondary:
        "bg-secondary/15 text-deep hover:bg-secondary/30 hover:text-deep border border-secondary/40 active:bg-secondary/20",
      outline:
        "border border-slate-300 bg-white text-deep hover:bg-primary-pale/50 hover:text-primary hover:border-primary-light active:bg-primary-pale",
      ghost:
        "text-deep hover:text-primary hover:bg-primary-pale active:bg-primary-pale/60",
      danger:
        "bg-accent-alert text-white hover:opacity-90 hover:text-white shadow-sm active:opacity-80",
      accent:
        "bg-hero-amber text-deep hover:opacity-90 hover:text-deep shadow-md shadow-hero-amber/20 font-black active:opacity-80",
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
