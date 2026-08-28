import type { Metadata } from "next";
import { listActiveContests } from "@/app/actions/contests";
import { listPublicStories } from "@/app/actions/stories";
import { StoriesHome } from "@/components/stories/stories-home";

export const metadata: Metadata = {
  title: "Stories",
};

export default async function StoriesHomePage() {
  const [stories, activeContests] = await Promise.all([
    listPublicStories(),
    listActiveContests(),
  ]);
  return <StoriesHome initialStories={stories} contests={activeContests} />;
}
