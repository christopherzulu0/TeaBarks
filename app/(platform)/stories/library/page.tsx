import type { Metadata } from "next";
import { listPublicStories } from "@/app/actions/stories";
import { StoryLibrary } from "@/components/stories/story-library";

export const metadata: Metadata = {
  title: "My Library",
};

export default async function LibraryPage() {
  const stories = await listPublicStories();
  return <StoryLibrary initialStories={stories} />;
}
