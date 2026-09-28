"use client";

import * as React from "react";
import { DashboardPageLayout } from "@/components/dashboard/dashboard-page-layout";
import { FaqsTermsManager } from "@/components/admin/faqs-terms-manager";

export default function FaqsPage() {
  return (
    <DashboardPageLayout
      activeSection="faqs"
      title="FAQs & Terms Guarantees"
      subtitle="Manage customer questions, markdown formatting, and service guarantees in database"
    >
      <FaqsTermsManager />
    </DashboardPageLayout>
  );
}
