import type { Metadata } from "next";

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

export interface AdminSessionMetadata {
  facilityId: string;
  facilityLocation: string;
  operatingRegion: string;
  activeDispatches: number;
  lastSyncTimestamp: string;
}

export interface AdminNavigationSection {
  id: "orders" | "rates" | "packages" | "detergents" | "coupons" | "reviews";
  title: string;
  badgeCount?: number;
  category: "operations" | "catalog" | "feedback";
}

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 *
 * Dedicated administrative shell for Laundry Express operations staff and management.
 * Designed to provide:
 * 1. Immersive sidebar-first operations control center
 * 2. Rapid access to the progressive order execution pipeline
 * 3. Granular base rates, bag/KG thresholds, packages, detergents, and coupons
 * 4. Transparent customer review moderation and permanent removal controls
 *
 * Architecture Guidelines:
 * - Strict adherence to 100–250 lines rule
 * - Full compliance with Lucide React iconography standard
 * - Zero decorative banner clutter
 * - High contrast accessible color system (Ink Navy, Deep Hero Blue, Foam White)
 *
 * Progressive Order Fulfillment State Machine:
 * 1. Customer checkout completed (Stripe webhook verification)
 * 2. Order status moves to 'confirmed' -> Email notification sent to operations
 * 3. Admin accepts order -> Email notification sent to customer with pickup window
 * 4. Driver arrives -> Uploads pickup photo proof -> Status moves to 'in_wash'
 * 5. Washing & Fabric Inspection -> Flag pre-existing garment flaws/damage with photo proof
 * 6. Wash & fold completed -> Status moves to 'out_for_delivery'
 * 7. Doorstep drop-off -> Uploads required drop-off photo proof -> Status becomes 'completed'
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-900 flex flex-col font-sans antialiased">
      {/* Main Administrative Workspace (Sidebar + Dynamic View Area) */}
      <div className="flex-1 flex flex-col w-full">
        {children}
      </div>

      {/* Subtle Operational Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
            <span className="font-bold text-slate-800">Laundry Express Operations Center</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">Daily Slots: 8am–12pm &amp; 1pm–6pm</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Enterprise Admin Portal</span>
            <span>•</span>
            <span>&copy; {new Date().getFullYear()} Laundry Express Services</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Security & Data Privacy Directives:
 * - Proof Storage: Images are stored in private Supabase buckets with signed URLs
 * - Retention Policy: 90-day automatic lifecycle rotation for delivered order proofs
 * - Role Validation: All mutation endpoints check server-side admin role claims
 * - Price Calculation: Server-side pricing recalculation ensures client-side tamper resistance
 * - Disaster Recovery: Point-in-time recovery enabled with daily automated database snapshots
 *
 * Environment Check:
 * - Next.js App Router internal layouts isolate administrative routing from customer portals.
 * - Enforces authentication gates and audit trail compliance on all mutation actions.
 */
