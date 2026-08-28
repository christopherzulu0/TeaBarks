import type { Metadata } from "next";
import { Suspense } from "react";
import { listActiveContests } from "@/app/actions/contests";
import { listPublicStories } from "@/app/actions/stories";
import { StoriesHome } from "@/components/stories/stories-home";
import { RouteLoading } from "@/components/route-loading";

export const metadata: Metadata = {
  title: "Stories",
};

export default async function StoriesHomePage() {
  const [stories, activeContests] = await Promise.all([
    listPublicStories(),
    listActiveContests(),
  ]);
  return (
    <Suspense fallback={<RouteLoading variant="grid" />}>
      <StoriesHome initialStories={stories} contests={activeContests} />
    </Suspense>
  );
}
