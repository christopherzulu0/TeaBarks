import type { Metadata } from "next";
import { Suspense } from "react";
import { listApprovedCreators } from "@/app/actions/creators";
import { PermissionGate } from "@/components/auth/permission-gate";
import { CaseWizard } from "@/components/cases/case-wizard";
import { RouteLoading } from "@/components/route-loading";

export const metadata: Metadata = {
  title: "Open an Accountability Case",
};

export default async function NewCasePage() {
  const creators = await listApprovedCreators();

  return (
    <PermissionGate permission="org:cases:open">
      <Suspense fallback={<RouteLoading variant="detail" />}>
        <CaseWizard initialCreators={creators} />
      </Suspense>
    </PermissionGate>
  );
}
