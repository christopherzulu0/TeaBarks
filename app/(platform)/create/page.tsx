import type { Metadata } from "next";
import { Suspense } from "react";
import { CreateWizard } from "@/components/create/create-wizard";
import { RouteLoading } from "@/components/route-loading";

export const metadata: Metadata = {
  title: "Create a Bark",
};

export default function CreatePage() {
  return (
    <Suspense fallback={<RouteLoading variant="detail" />}>
      <CreateWizard />
    </Suspense>
  );
}
