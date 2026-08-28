import type { Metadata } from "next";
import { Suspense } from "react";
import { FeatureGate } from "@/components/auth/feature-gate";
import { CreateWizard } from "@/components/create/create-wizard";
import { RouteLoading } from "@/components/route-loading";
import { FEATURES } from "@/lib/billing";

export const metadata: Metadata = {
  title: "Create a Bark",
};

export default function CreatePage() {
  return (
    <FeatureGate feature={FEATURES.createBark}>
      <Suspense fallback={<RouteLoading variant="detail" />}>
        <CreateWizard />
      </Suspense>
    </FeatureGate>
  );
}
