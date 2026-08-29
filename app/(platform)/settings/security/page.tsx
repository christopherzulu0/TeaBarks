import type { Metadata } from "next";
import { KeyRound, Smartphone, LaptopMinimal } from "lucide-react";
import { SaveButton } from "@/components/settings/save-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export const metadata: Metadata = {
  title: "Security Settings",
};

const sessions = [
  { device: "Windows · Chrome", location: "Cairo, EG", current: true, last: "Now" },
  { device: "iPhone 16 · TypeReact App", location: "Cairo, EG", current: false, last: "2h ago" },
  { device: "MacBook · Safari", location: "Alexandria, EG", current: false, last: "3d ago" },
];

export default function SecuritySettingsPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Use a long, unique password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="current-pw">Current password</Label>
              <Input id="current-pw" type="password" placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-pw">New password</Label>
              <Input id="new-pw" type="password" placeholder="••••••••" />
            </div>
          </div>
          <SaveButton label="Update password" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Add a second verification step when signing in.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Smartphone className="size-4 text-muted-foreground" aria-hidden />
              <div>
                <Label htmlFor="totp">Authenticator app</Label>
                <p className="text-xs text-muted-foreground">
                  Time-based codes from an authenticator app.
                </p>
              </div>
            </div>
            <Switch id="totp" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <KeyRound className="size-4 text-muted-foreground" aria-hidden />
              <div>
                <Label htmlFor="passkey">Passkeys</Label>
                <p className="text-xs text-muted-foreground">
                  Sign in with your device&apos;s biometrics or PIN.
                </p>
              </div>
            </div>
            <Switch id="passkey" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Devices currently signed in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.map((s) => (
            <div
              key={s.device}
              className="flex items-center justify-between gap-4 rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <LaptopMinimal
                  className="size-4 text-muted-foreground"
                  aria-hidden
                />
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {s.device}
                    {s.current && (
                      <Badge variant="secondary" className="text-[10px]">
                        This device
                      </Badge>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {s.location} · {s.last}
                  </p>
                </div>
              </div>
              {!s.current && (
                <Button variant="outline" size="sm">
                  Sign out
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
