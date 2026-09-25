"use client";

import * as React from "react";
import { Zap, X, Copy, Check, Clock, Sparkles } from "lucide-react";

/**
 * PromoBanner Component
 *
 * Sticky dismissible top notification bar.
 * Announces the launch promotional coupon code (HEROFRESH) and highlights
 * the key value proposition: 2+ Bags = 100% FREE Delivery ($0.00).
 */
export function PromoBanner() {
  const [visible, setVisible] = React.useState(true);
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  if (!visible) return null;

  const handleCopy = (code: string) => {
    try {
      navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2500);
    }
  };

  return (
    <aside
      role="complementary"
      aria-label="Promotional Announcement"
      className="bg-gradient-to-r from-sky-950 via-slate-900 to-blue-950 text-white text-xs py-2 px-4 relative z-50 border-b border-sky-800/60"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 mx-auto sm:mx-0 flex-wrap">
          <span className="p-1 rounded-full bg-amber-400 text-slate-950 shrink-0">
            <Zap className="h-3 w-3 fill-slate-950" />
          </span>

          <p className="font-medium text-slate-200">
            <span className="font-extrabold text-amber-300">Superhero Launch Offer:</span>{" "}
            Use code{" "}
            <button
              type="button"
              onClick={() => handleCopy("HEROFRESH")}
              className="inline-flex items-center gap-1 font-mono font-bold bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md transition-colors text-white cursor-pointer select-all"
              title="Click to copy coupon code"
              aria-label="Copy coupon code HEROFRESH"
            >
              <span>HEROFRESH</span>
              {copiedCode === "HEROFRESH" ? (
                <Check className="h-3 w-3 text-emerald-300 animate-in zoom-in" />
              ) : (
                <Copy className="h-3 w-3 text-sky-200" />
              )}
            </button>{" "}
            for <strong className="text-white">15% OFF</strong>!{" "}
            <span className="hidden sm:inline">
              Or use{" "}
              <button
                type="button"
                onClick={() => handleCopy("FREESHIP")}
                className="inline-flex items-center gap-1 font-mono font-bold bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md transition-colors text-white cursor-pointer"
                title="Click to copy coupon code"
                aria-label="Copy coupon code FREESHIP"
              >
                <span>FREESHIP</span>
                {copiedCode === "FREESHIP" ? (
                  <Check className="h-3 w-3 text-emerald-300 animate-in zoom-in" />
                ) : (
                  <Sparkles className="h-3 w-3 text-amber-300" />
                )}
              </button>{" "}
              for $10 off single bags.
            </span>
          </p>

          <span className="hidden md:inline text-slate-500">•</span>

          <span className="hidden md:inline-flex items-center gap-1 text-emerald-300 font-bold">
            ⚡ 2+ Bags = Always FREE Delivery ($0.00)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors shrink-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-400"
          aria-label="Dismiss promotional banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
