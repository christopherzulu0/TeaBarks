"use client";

import * as React from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { CountrySelect } from "@/components/profile/country-select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { defaultUserSettings } from "@/lib/user-settings";
import { countries } from "@/lib/data";

export function CountryForm() {
  const { isAuthenticated } = useConvexAuth();
  const remote = useQuery(
    api.userSettings.getMine,
    isAuthenticated ? {} : "skip"
  );
  const updateSettings = useMutation(api.userSettings.update);
  const [country, setCountry] = React.useState(defaultUserSettings.country);
  const [prioritizeLocalFeed, setPrioritizeLocalFeed] = React.useState(
    defaultUserSettings.prioritizeLocalFeed
  );
  const [regionalTrends, setRegionalTrends] = React.useState(
    defaultUserSettings.regionalTrends
  );
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!remote) return;
    setCountry(remote.country);
    setPrioritizeLocalFeed(remote.prioritizeLocalFeed);
    setRegionalTrends(remote.regionalTrends);
  }, [remote]);

  const save = async () => {
    if (!isAuthenticated) {
      toast.message("Sign in to save country settings");
      return;
    }
    const countryCode = country.trim().toUpperCase();
    if (!countries.some((item) => item.code === countryCode)) {
      toast.error("Select a country");
      return;
    }
    setSaving(true);
    try {
      await updateSettings({
        ...(remote ?? defaultUserSettings),
        country: countryCode,
        prioritizeLocalFeed,
        regionalTrends,
      });
      toast.success("Settings saved", {
        description: "Your country and feed preferences have been updated.",
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
      <div className="space-y-2">
        <Label htmlFor="settings-country">Country</Label>
        <CountrySelect
          id="settings-country"
          value={country}
          onChange={setCountry}
          disabled={saving}
          className="max-w-full sm:max-w-sm"
        />
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="local-feed">Prioritize local feed</Label>
          <p className="text-xs text-muted-foreground">
            Rank discussions from your country higher on the homepage.
          </p>
        </div>
        <Switch
          id="local-feed"
          checked={prioritizeLocalFeed}
          onCheckedChange={setPrioritizeLocalFeed}
        />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="regional-trends">Regional trending topics</Label>
          <p className="text-xs text-muted-foreground">
            Include regional trends alongside global ones.
          </p>
        </div>
        <Switch
          id="regional-trends"
          checked={regionalTrends}
          onCheckedChange={setRegionalTrends}
        />
      </div>
      <Button
        className="h-10 w-full sm:h-8 sm:w-auto"
        onClick={() => void save()}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
