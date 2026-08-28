import type { Metadata } from "next";
import { WriterApplyWizard } from "@/components/stories/writer-apply-wizard";

export const metadata: Metadata = {
  title: "Become a Writer",
};

export default function WriterApplyPage() {
  return <WriterApplyWizard />;
}
