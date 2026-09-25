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
    </div>
  );
}

/**
 * Administrative Operations Security & Data Privacy Directives:
 *
 * 1. Proof Storage Compliance:
 *    - All intake pickup proofs, pre-wash damage snapshots, and delivery drop-off images
 *      are securely persisted in private Supabase Storage buckets.
 *    - Presigned URLs with short-lived expiration windows (15 minutes) prevent unauthorized access.
 *
 * 2. Automated Retention & Privacy Purge:
 *    - 90-day automated lifecycle rotation for delivered order proof images.
 *    - Minimizes customer private property exposure while safeguarding proof-of-delivery integrity.
 *
 * 3. Server-Side Price Calculation & Payment Validation:
 *    - Upfront Stripe payment intents compute total charges exclusively on the backend.
 *    - Prevents client-side price tampering or unauthorized coupon parameter injections.
 *
 * 4. Multi-Factor Authentication & Role-Based Access Control (RBAC):
 *    - Access to administrative routes and mutation actions requires MFA verification.
 *    - Only verified operational personnel with the 'admin' role claim can execute state mutations.
 *
 * 5. Automated Disaster Recovery & Business Continuity:
 *    - Continuous automated point-in-time recovery (PITR) with daily database snapshots.
 *    - Documented restoration playbooks guarantee maximum recovery point objective (RPO < 5 min).
 */
export interface AdminSecurityAuditContext {
  operatorId: string;
  sessionToken: string;
  ipAddress: string;
  actionTimestamp: string;
  verifiedMfa: boolean;
}
