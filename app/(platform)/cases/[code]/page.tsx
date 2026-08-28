import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCaseByCodeAction } from "@/app/actions/cases";
import { getCreatorByHandleAction } from "@/app/actions/creators";
import { CaseFile } from "@/components/cases/case-file";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/cases/[code]">
): Promise<Metadata> {
  const { code } = await props.params;
  const c = await getCaseByCodeAction(code);
  return { title: c ? `${c.code} — ${c.title}` : "Case not found" };
}

export default async function CasePage(props: PageProps<"/cases/[code]">) {
  const { code } = await props.params;
  const accountabilityCase = await getCaseByCodeAction(code);
  if (!accountabilityCase) notFound();

  const claimed = accountabilityCase.creatorHandle
    ? Boolean(await getCreatorByHandleAction(accountabilityCase.creatorHandle))
    : false;

  return (
    <CaseFile
      initialCase={accountabilityCase}
      claimedProfile={claimed}
    />
  );
}
