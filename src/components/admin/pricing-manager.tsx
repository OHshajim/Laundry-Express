"use client";

import * as React from "react";
import { PackagesManager } from "./packages-manager";
import { DetergentsManager } from "./detergents-manager";
import { CouponsManager } from "./coupons-manager";
import { AdminSettingsManager } from "./admin-settings-manager";

export type PricingSubSection = "rates" | "packages" | "detergents" | "coupons";

interface PricingManagerProps {
  currentSection?: PricingSubSection;
}

/**
 * PricingManager Component
 * Hub for packages, detergents, and coupons catalog.
 * If 'rates' is selected, delegates directly to the unified AdminSettingsManager.
 */
export function PricingManager({ currentSection = "rates" }: PricingManagerProps) {
  const [activeSubTab, setActiveSubTab] = React.useState<PricingSubSection>(currentSection);

  React.useEffect(() => {
    setActiveSubTab(currentSection);
  }, [currentSection]);

  return (
    <div className="space-y-6">
      {activeSubTab === "rates" && <AdminSettingsManager />}
      {activeSubTab === "packages" && <PackagesManager />}
      {activeSubTab === "detergents" && <DetergentsManager />}
      {activeSubTab === "coupons" && <CouponsManager />}
    </div>
  );
}

export default PricingManager;
