"use client";

import * as React from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { defaultUserSettings } from "@/lib/user-settings";

const options = [
  {
    id: "publicProfile" as const,
    label: "Public profile",
    description: "Anyone can view your profile, reactions, and evidence history.",
  },
  {
    id: "showCountry" as const,
    label: "Show country on profile",
    description: "Display your country next to your name in discussions.",
  },
  {
    id: "searchable" as const,
    label: "Appear in search engines",
    description: "Allow your public reactions to be indexed outside TypeReact.",
  },
  {
    id: "dmAnyone" as const,
    label: "Messages from anyone",
    description: "If off, only people you follow can start a conversation.",
  },
  {
    id: "activityStatus" as const,
    label: "Show activity status",
    description: "Let others see when you're active on the platform.",
  },
];

export function PrivacyForm() {
  const { isAuthenticated } = useConvexAuth();
  const remote = useQuery(
    api.userSettings.getMine,
    isAuthenticated ? {} : "skip"
  );
  const updateSettings = useMutation(api.userSettings.update);
  const [prefs, setPrefs] = React.useState({
    publicProfile: defaultUserSettings.publicProfile,
    showCountry: defaultUserSettings.showCountry,
    searchable: defaultUserSettings.searchable,
    dmAnyone: defaultUserSettings.dmAnyone,
    activityStatus: defaultUserSettings.activityStatus,
  });
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!remote) return;
    setPrefs({
      publicProfile: remote.publicProfile,
      showCountry: remote.showCountry,
      searchable: remote.searchable,
      dmAnyone: remote.dmAnyone,
      activityStatus: remote.activityStatus,
    });
  }, [remote]);

  const save = async () => {
    if (!isAuthenticated) {
      toast.message("Sign in to save privacy settings");
      return;
    }
    setSaving(true);
    try {
      await updateSettings({ ...(remote ?? defaultUserSettings), ...prefs });
      toast.success("Settings saved", {
        description: "Your privacy preferences have been updated.",
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
    <div className="space-y-5">
      {options.map((o, i) => (
        <div key={o.id}>
          {i > 0 && <Separator className="mb-5" />}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <Label htmlFor={o.id}>{o.label}</Label>
              <p className="text-xs text-muted-foreground">{o.description}</p>
            </div>
            <Switch
              id={o.id}
              checked={prefs[o.id]}
              onCheckedChange={(checked) =>
                setPrefs((current) => ({ ...current, [o.id]: checked }))
              }
            />
          </div>
        </div>
      ))}
      <Button onClick={() => void save()} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
