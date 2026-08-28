import type { Metadata } from "next";
import { ApplyWizard } from "@/components/creator/apply-wizard";

export const metadata: Metadata = {
  title: "Become a Creator",
};

export default function CreatorApplyPage() {
  return <ApplyWizard />;
}
