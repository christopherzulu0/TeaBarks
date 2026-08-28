import { RequireAdmin } from "@/components/auth/require-admin";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireAdmin>
      <div className="min-w-0 w-full overflow-x-hidden">{children}</div>
    </RequireAdmin>
  );
}
