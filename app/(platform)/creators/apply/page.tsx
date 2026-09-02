import type { Metadata } from "next";
import { Suspense } from "react";
import { ApplyWizard } from "@/components/creator/apply-wizard";

export const metadata: Metadata = {
  title: "Become a Creator",
};

export default function CreatorApplyPage() {
  return (
    <Suspense fallback={<p className="px-4 py-8 text-sm text-muted-foreground">Loading…</p>}>
      <ApplyWizard />
    </Suspense>
  );
}
