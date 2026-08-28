import { RequireSignIn } from "@/components/auth/require-sign-in";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireSignIn>
      <div className="mx-auto max-w-5xl space-y-6 px-4 py-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your account, privacy, and workspace preferences.
          </p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <SettingsNav />
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </RequireSignIn>
  );
}
