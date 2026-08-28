import { RequireSignIn } from "@/components/auth/require-sign-in";

export default function OrgLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireSignIn>{children}</RequireSignIn>;
}
