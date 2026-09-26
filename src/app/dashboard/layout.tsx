import * as React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard & Operations Control — Laundry Express",
  description: "Unified customer order tracking and administrative operations workspace.",
  robots: {
    index: false,
    follow: false,
  },
};

/**
 * Unified Dashboard Layout
 *
 * Dedicated shell layout for the unified /dashboard directory:
 * - One layout wrapping the master role-based dashboard page
 * - Prevents double shell nesting while ensuring searchParams reactivity
 * - Strictly complies with the < 250 lines rule
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-50/60 font-sans antialiased overflow-x-clip">{children}</div>;
}
