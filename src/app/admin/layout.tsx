import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Operations Control — Laundry Express",
  description: "Live order pipeline, review moderation, dynamic pricing, and audit logs.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen bg-slate-100">{children}</div>;
}
