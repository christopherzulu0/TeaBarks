import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreatorProfile } from "@/components/creators/creator-profile";
import { listPublicBarks } from "@/app/actions/barks";
import { listCases } from "@/app/actions/cases";
import { getCreatorByHandleAction } from "@/app/actions/creators";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/creators/[handle]">
): Promise<Metadata> {
  const { handle } = await props.params;
  const creator = await getCreatorByHandleAction(handle);
  return {
    title: creator ? creator.name : "Creator not found",
    description: creator?.bio,
  };
}

export default async function CreatorPage(
  props: PageProps<"/creators/[handle]">
) {
  const { handle } = await props.params;
  const creator = await getCreatorByHandleAction(handle);
  if (!creator) notFound();

  const [publishedBarks, publishedCases] = await Promise.all([
    listPublicBarks(),
    listCases(),
  ]);
  const handleKey = creator.handle.toLowerCase();
  const barksAbout = publishedBarks.filter((b) => {
    const name = b.sourceCreatorName?.toLowerCase();
    return (
      b.sourceCreatorName === creator.name ||
      name === handleKey ||
      name === creator.name.toLowerCase()
    );
  });
  const creatorCases = publishedCases.filter(
    (c) =>
      c.creatorId === creator.id ||
      c.creatorHandle?.toLowerCase() === handleKey
  );

  return (
    <CreatorProfile
      creator={creator}
      sources={[]}
      barksAbout={barksAbout}
      cases={creatorCases}
    />
  );
}
