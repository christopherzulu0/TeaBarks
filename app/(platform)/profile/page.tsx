import type { Metadata } from "next";
import { RequireSignIn } from "@/components/auth/require-sign-in";
import { ProfilePageClient } from "@/components/profile/profile-page-client";

export const metadata: Metadata = {
  title: "Profile",
};

export default function ProfilePage() {
  return (
    <RequireSignIn>
      <ProfilePageClient />
    </RequireSignIn>
  );
}
