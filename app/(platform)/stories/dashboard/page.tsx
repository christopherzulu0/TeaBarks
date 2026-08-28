import type { Metadata } from "next";
import { WriterDashboardGate } from "@/components/stories/writer-dashboard-gate";

export const metadata: Metadata = {
  title: "Writer Dashboard",
};

export default function WriterDashboardPage() {
  return <WriterDashboardGate initialWriter={null} initialStories={[]} />;
}
