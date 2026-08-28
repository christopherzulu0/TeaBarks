import type { Metadata } from "next";
import { OrgWorkspace } from "@/components/org/org-workspace";

export const metadata: Metadata = {
  title: "Organization",
};

export default function OrgDashboardPage() {
  return <OrgWorkspace />;
}
