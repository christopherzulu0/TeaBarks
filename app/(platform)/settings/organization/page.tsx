import type { Metadata } from "next";
import { OrgSettings } from "@/components/org/org-settings";

export const metadata: Metadata = {
  title: "Organization Settings",
};

export default function OrgSettingsPage() {
  return <OrgSettings />;
}
