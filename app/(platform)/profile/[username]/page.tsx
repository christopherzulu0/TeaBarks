import type { Metadata } from "next";
import { PublicProfileView } from "@/components/profile/public-profile-view";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const slug = decodeURIComponent(username).trim();
  return <PublicProfileView slug={slug} />;
}
