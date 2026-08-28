import type { Metadata } from "next";
import Link from "next/link";
import { Scale } from "lucide-react";
import { listCases } from "@/app/actions/cases";
import { PermissionGate } from "@/components/auth/permission-gate";
import { CasesList } from "@/components/cases/cases-list";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Accountability Cases",
};

export default async function CasesPage() {
  const cases = await listCases();

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Accountability Cases
          </h1>
          <p className="text-sm text-muted-foreground">
            Structured, permanent investigations of public claims — with full
            version history and creator right-of-reply.
          </p>
        </div>
        <PermissionGate permission="org:cases:open" hideWhenDenied>
          <Button asChild className="shrink-0">
            <Link href="/cases/new">
              <Scale className="size-4" /> Open a case
            </Link>
          </Button>
        </PermissionGate>
      </div>
      <CasesList initialCases={cases} />
    </div>
  );
}
