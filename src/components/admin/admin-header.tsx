import Link from "next/link";
import Image from "next/image";
import { Shield, ArrowLeft, Activity, Sliders, MessageSquare, ListOrdered } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminHeaderProps {
  activeTab: "orders" | "pricing" | "reviews" | "logs";
  onTabChange: (tab: "orders" | "pricing" | "reviews" | "logs") => void;
  pendingReviewsCount: number;
}

export function AdminHeader({
  activeTab,
  onTabChange,
  pendingReviewsCount,
}: AdminHeaderProps) {
  const tabs = [
    { id: "orders" as const, label: "Live Order Pipeline", icon: ListOrdered },
    { id: "pricing" as const, label: "Pricing, Packages & Offers", icon: Sliders },
    {
      id: "reviews" as const,
      label: "Review Moderation",
      icon: MessageSquare,
      badge: pendingReviewsCount > 0 ? pendingReviewsCount : undefined,
    },
    { id: "logs" as const, label: "Master Audit Trail", icon: Activity },
  ];

  return (
    <div className="bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 rounded-xl overflow-hidden border border-slate-700">
              <Image
                src="/brand/logo-badge.jpg"
                alt="Laundry Express Admin"
                fill
                sizes="40px"
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white">Laundry Express</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase">
                  Admin 2FA Verified
                </span>
              </div>
              <p className="text-xs text-slate-400">Operations Control Center</p>
            </div>
          </div>

          <Link href="/">
            <Button variant="outline" size="sm" className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Live Site
            </Button>
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 pt-3 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-t border-x transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-slate-950 text-sky-400 border-slate-800 border-b-2 border-b-sky-400"
                    : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[10px]">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
