import type { Metadata } from "next";
import { PlatformIcon } from "@/components/platform-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SourcePlatform } from "@/lib/types";
import { platformMeta } from "@/lib/meta";

export const metadata: Metadata = {
  title: "Connected Accounts",
};

const connections: {
  platform: SourcePlatform;
  handle?: string;
  connected: boolean;
}[] = [
  { platform: "x", handle: "@yassinhaddad", connected: true },
  { platform: "youtube", handle: "Yassin Haddad Research", connected: true },
  { platform: "instagram", connected: false },
  { platform: "tiktok", connected: false },
  { platform: "facebook", connected: false },
  { platform: "podcast", connected: false },
];

export default function AccountsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>
          Link your public accounts to strengthen identity verification and let
          creators confirm who&apos;s engaging with their content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {connections.map((c) => (
          <div
            key={c.platform}
            className="flex items-center justify-between gap-4 rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-md bg-muted">
                <PlatformIcon platform={c.platform} className="size-4" />
              </span>
              <div>
                <p className="flex items-center gap-2 text-sm font-medium">
                  {platformMeta[c.platform].label}
                  {c.connected && (
                    <Badge
                      variant="outline"
                      className="bg-agree/15 text-agree border-agree/30 text-[10px]"
                    >
                      Connected
                    </Badge>
                  )}
                </p>
                {c.handle && (
                  <p className="text-xs text-muted-foreground">{c.handle}</p>
                )}
              </div>
            </div>
            <Button variant={c.connected ? "outline" : "default"} size="sm">
              {c.connected ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
