import type { Metadata } from "next";
import { ContestBlindReview } from "@/components/admin/contest-blind-review";
import type { Id } from "@/convex/_generated/dataModel";

export const metadata: Metadata = {
  title: "Contest review",
};

export default async function ContestReviewPage(props: {
  params: Promise<{ contestId: string }>;
}) {
  const { contestId } = await props.params;
  return (
    <ContestBlindReview contestId={contestId as Id<"contests">} />
  );
}
