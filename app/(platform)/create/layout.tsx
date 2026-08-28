import { RequireSignIn } from "@/components/auth/require-sign-in";

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireSignIn>{children}</RequireSignIn>;
}
