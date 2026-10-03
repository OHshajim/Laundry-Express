"use client";

import * as React from "react";
import { User as UserIcon, MapPin, KeyRound } from "lucide-react";
import { SettingsProfile } from "./settings-profile";
import { SettingsAddresses } from "./settings-addresses";
import { SettingsPassword } from "./settings-password";
import { useAuth } from "@/context/auth-context";

export type SettingsTab = "profile" | "address" | "password";

export function DashboardSettings() {
  const [activeTab, setActiveTab] = React.useState<SettingsTab>(() => {
    if (typeof window !== "undefined") {
      const urlTab = new URLSearchParams(window.location.search).get("tab") as SettingsTab | null;
      if (urlTab && ["profile", "address", "password"].includes(urlTab)) return urlTab;
      const cached = sessionStorage.getItem("laundry_active_settings_tab") as SettingsTab | null;
      if (cached && ["profile", "address", "password"].includes(cached)) return cached;
    }
    return "profile";
  });

  const { user } = useAuth();

  const handleTabSelect = (tab: SettingsTab) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("laundry_active_settings_tab", tab);
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.replaceState(null, "", url.toString());
    }
  };

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: UserIcon },
    { id: "address" as const, label: "Addresses", icon: MapPin },
    { id: "password" as const, label: "Password & Security", icon: KeyRound },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap border-b border-slate-200 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabSelect(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "border-primary text-primary bg-pink-50/40 rounded-t-xl"
                  : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
      {activeTab === "profile" && <SettingsProfile />}
      {activeTab === "address" && <SettingsAddresses />}
      {activeTab === "password" && (
        <SettingsPassword
          userEmail={user?.email || ""}
          userPhone={user?.phone || ""}
        />
      )}
    </div>
  );
}

export default DashboardSettings;
