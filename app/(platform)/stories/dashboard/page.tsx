import type { Metadata } from "next";
import { FeatureGate } from "@/components/auth/feature-gate";
import { WriterDashboardGate } from "@/components/stories/writer-dashboard-gate";
import { FEATURES } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Writer Dashboard",
};

export default function WriterDashboardPage() {
  return (
    <FeatureGate feature={FEATURES.writerDashboard}>
      <WriterDashboardGate initialWriter={null} initialStories={[]} />
    </FeatureGate>
  );
}
