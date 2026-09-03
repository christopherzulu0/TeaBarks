"use client";

import * as React from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { playNotificationChime } from "@/components/notifications/notification-sound";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { notificationCategoryMeta } from "@/lib/meta";
import type { NotificationCategory } from "@/lib/types";

const descriptions: Record<NotificationCategory, string> = {
  reply: "When someone replies to your reactions or reply chains.",
  mention: "When someone mentions you with @.",
  follower: "When someone starts following you.",
  following: "When someone you follow publishes a reaction.",
  "creator-response":
    "When a creator officially responds to a discussion you follow.",
  evidence: "When evidence is added or a case you follow changes status.",
  verification: "When your evidence or identity verification status changes.",
  message: "When someone sends you a private message about a reaction, case, or creator.",
  circle: "When you’re invited to a research circle or someone accepts your invite.",
};

const categoryPrefKey: Record<
  NotificationCategory,
  | "reply"
  | "mention"
  | "follower"
  | "followingActivity"
  | "creatorResponse"
  | "evidence"
  | "verification"
  | "message"
  | "circle"
> = {
  reply: "reply",
  mention: "mention",
  follower: "follower",
  following: "followingActivity",
  "creator-response": "creatorResponse",
  evidence: "evidence",
  verification: "verification",
  message: "message",
  circle: "circle",
};

type PrefsState = {
  reply: boolean;
  mention: boolean;
  follower: boolean;
  followingActivity: boolean;
  creatorResponse: boolean;
  evidence: boolean;
  verification: boolean;
  message: boolean;
  circle: boolean;
  soundEnabled: boolean;
  emailEnabled: boolean;
  digestWeekly: boolean;
  digestCaseEmail: boolean;
};

const defaultPrefs: PrefsState = {
  reply: true,
  mention: true,
  follower: true,
  followingActivity: true,
  creatorResponse: true,
  evidence: true,
  verification: true,
  message: true,
  circle: true,
  soundEnabled: true,
  emailEnabled: true,
  digestWeekly: true,
  digestCaseEmail: true,
};

export function NotificationSettingsForm() {
  const { isAuthenticated } = useConvexAuth();
  const remote = useQuery(
    api.notifications.getPrefs,
    isAuthenticated ? {} : "skip"
  );
  const updatePrefs = useMutation(api.notifications.updatePrefs);
  const [prefs, setPrefs] = React.useState<PrefsState>(defaultPrefs);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!remote) return;
    setPrefs({
      reply: remote.reply,
      mention: remote.mention,
      follower: remote.follower,
      followingActivity: remote.followingActivity ?? true,
      creatorResponse: remote.creatorResponse,
      evidence: remote.evidence,
      verification: remote.verification,
      message: remote.message,
      circle: remote.circle ?? true,
      soundEnabled: remote.soundEnabled,
      emailEnabled: remote.emailEnabled ?? true,
      digestWeekly: remote.digestWeekly,
      digestCaseEmail: remote.digestCaseEmail,
    });
  }, [remote]);

  const categories = Object.keys(
    notificationCategoryMeta
  ) as NotificationCategory[];

  const setFlag = (key: keyof PrefsState, value: boolean) => {
    setPrefs((current) => ({ ...current, [key]: value }));
  };

  const save = async () => {
    if (!isAuthenticated) {
      toast.message("Sign in to save notification settings");
      return;
    }
    setSaving(true);
    try {
      await updatePrefs(prefs);
      toast.success("Settings saved", {
        description: "Your preferences have been updated.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save settings"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>In-app notifications</CardTitle>
          <CardDescription>
            Choose which activity appears in your notification center.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {categories.map((c, i) => {
            const key = categoryPrefKey[c];
            return (
              <div key={c}>
                {i > 0 && <Separator className="mb-5" />}
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor={`notif-${c}`}>
                      {notificationCategoryMeta[c].label}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {descriptions[c]}
                    </p>
                  </div>
                  <Switch
                    id={`notif-${c}`}
                    checked={prefs[key]}
                    onCheckedChange={(checked) => setFlag(key, checked)}
                  />
                </div>
              </div>
            );
          })}
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="notif-sound">Notification sound</Label>
              <p className="text-xs text-muted-foreground">
                Play a short chime when a new notification arrives. Click the
                page once if the browser blocks audio.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  void playNotificationChime().then((played) => {
                    if (played) {
                      toast.success("Played notification sound");
                    } else {
                      toast.message("Click anywhere on the page, then try again");
                    }
                  });
                }}
              >
                Test sound
              </Button>
              <Switch
                id="notif-sound"
                checked={prefs.soundEnabled}
                onCheckedChange={(checked) => setFlag("soundEnabled", checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email</CardTitle>
          <CardDescription>
            Get the same alerts by email. Category switches above also apply to
            email delivery.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="email-enabled">Email notifications</Label>
              <p className="text-xs text-muted-foreground">
                Send an email for each in-app notification when this is on.
              </p>
            </div>
            <Switch
              id="email-enabled"
              checked={prefs.emailEnabled}
              onCheckedChange={(checked) => setFlag("emailEnabled", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="digest-weekly">Weekly research digest</Label>
              <p className="text-xs text-muted-foreground">
                Coming soon — top reactions and case updates every Monday.
                Preference is saved for when digests ship.
              </p>
            </div>
            <Switch
              id="digest-weekly"
              checked={prefs.digestWeekly}
              onCheckedChange={(checked) => setFlag("digestWeekly", checked)}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor="digest-case">Case status preference</Label>
              <p className="text-xs text-muted-foreground">
                Saved for future digest filtering. Case status changes already
                email when Email notifications and Evidence Updates are on.
              </p>
            </div>
            <Switch
              id="digest-case"
              checked={prefs.digestCaseEmail}
              onCheckedChange={(checked) =>
                setFlag("digestCaseEmail", checked)
              }
            />
          </div>
          <Button onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
