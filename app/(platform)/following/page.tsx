import type { Metadata } from "next";
import { FollowingFeed } from "@/components/following/following-feed";

export const metadata: Metadata = {
  title: "Following",
};

export default function FollowingPage() {
  return <FollowingFeed />;
}
