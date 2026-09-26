import * as React from "react";
import type { Metadata } from "next";
import { DashboardSettings } from "@/components/dashboard/dashboard-settings";
import {
  Settings,
  ShieldCheck,
  CloudUpload,
  UserCheck,
  Database,
  Lock,
} from "lucide-react";

/**
 * Customer Account Settings Page (/dashboard/settings)
 *
 * Implements AGENTS.md 5.e:
 * - Profile photo upload & hosting in Supabase Storage ('avatars' bucket)
 * - User personal details (name, email, phone number)
 * - Addresses, password reset, and notification channels
 * - Strictly adheres to 100-250 lines architectural limit
 */

export const metadata: Metadata = {
  title: "Account Settings & Profile | Laundry Express",
  description:
    "Manage your personal profile, Supabase-hosted profile photo, delivery addresses, and security settings.",
};

export default function CustomerSettingsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="pb-4 border-b border-pink-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Account Settings
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your personal profile, avatar hosting, delivery addresses, and notification preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
            <UserCheck className="h-3.5 w-3.5" />
            Active Customer Account
          </span>
        </div>
      </div>

      {/* Feature Highlights Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-pink-50 flex items-center justify-center text-primary shrink-0">
            <CloudUpload className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">Supabase Image CDN</h4>
            <p className="text-[11px] text-slate-400 truncate">Fast global photo delivery</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">Encrypted Security</h4>
            <p className="text-[11px] text-slate-400 truncate">End-to-end data safety</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <Database className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-800 truncate">Live PostgreSQL Sync</h4>
            <p className="text-[11px] text-slate-400 truncate">Real-time profile updates</p>
          </div>
        </div>
      </div>

      {/* Main Settings Form Component */}
      <DashboardSettings />

      {/* Security and Storage Architecture Notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 space-y-2">
        <div className="flex items-center gap-2 text-slate-700 font-bold">
          <Lock className="h-4 w-4 text-primary" />
          <span>Security &amp; Cloud Asset Storage Information</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Your uploaded profile pictures are stored within the isolated <code>avatars</code> bucket
          in Supabase Cloud Storage. All image paths are signed or served via high-speed global CDN
          endpoints to ensure minimal latency and strict data governance compliance.
        </p>
      </div>
    </div>
  );
}
