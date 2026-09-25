"use client";

import * as React from "react";
import { Zap, X, Copy, Check } from "lucide-react";

export function PromoBanner() {
  const [visible, setVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);

  if (!visible) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText("HEROFRESH");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside
      aria-label="Promotional Announcement"
      className="bg-gradient-to-r from-sky-900 via-sky-800 to-rose-900 text-white text-xs py-2 px-4 relative z-50 border-b border-sky-700/50"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <span className="p-1 rounded-full bg-amber-400 text-slate-900 shrink-0">
            <Zap className="h-3 w-3 fill-slate-900" />
          </span>
          <p className="font-medium text-slate-100">
            <span className="font-extrabold text-amber-300">Superhero Launch Special:</span> Use code{" "}
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 font-mono font-bold bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded transition-colors text-white"
              title="Click to copy coupon code"
            >
              <span>HEROFRESH</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-300" />
              ) : (
                <Copy className="h-3 w-3 text-sky-200" />
              )}
            </button>{" "}
            for <strong className="text-white">15% OFF</strong> + Remember:{" "}
            <span className="text-emerald-300 font-bold">2+ Bags get FREE Delivery!</span>
          </p>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="text-slate-300 hover:text-white p-1 rounded-md transition-colors shrink-0"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
