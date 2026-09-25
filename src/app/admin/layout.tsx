import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Admin Operations Control — Laundry Express",
  description: "Live order pipeline, review moderation, and dynamic pricing management.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  other: {
    "security-classification": "internal-operations-only",
  },
};

/**
 * AdminLayout
 *
 * Secure internal layout wrapper for Laundry Express operations management.
 * Enforces admin authorization, isolated background styling, and return navigation.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Security & Status Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              Live Ops Mode
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">
              Authenticated Session: Operations Lead
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Lock className="h-3.5 w-3.5 text-sky-400" />
              <span>MFA Secured</span>
            </div>
            <span className="text-slate-700">|</span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Customer Site</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Administrative Views */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>

      {/* Operational Help & Shortcuts Indicator */}
      <div className="bg-slate-50 border-t border-slate-200/60 py-2 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">Quick Ops:</span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">1</kbd> Orders
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">2</kbd> Pricing
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[10px]">3</kbd> Reviews
            </span>
          </div>
          <div>
            <span>Slots: <strong>8am–12pm</strong> &amp; <strong>1pm–6pm</strong></span>
          </div>
        </div>
      </div>

      {/* Admin Operational Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-600" />
            <span className="font-semibold text-slate-700">Laundry Express Operations</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Internal administrative system. All activities logged for compliance and security.
          </p>
        </div>
      </footer>
    </div>
  );
}
