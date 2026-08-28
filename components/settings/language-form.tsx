"use client";

import * as React from "react";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { useLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { api } from "@/convex/_generated/api";
import { defaultUserSettings } from "@/lib/user-settings";

const languages = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية (Arabic) — RTL" },
  { value: "es", label: "Español (Spanish)" },
  { value: "de", label: "Deutsch (German)" },
  { value: "fr", label: "Français (French)" },
  { value: "ko", label: "한국어 (Korean)" },
  { value: "hi", label: "हिन्दी (Hindi)" },
] as const;

type ContentLanguages = "en-ar" | "en" | "all";

export function LanguageForm() {
  const { locale, dir, setLocale } = useLocale();
  const { isAuthenticated } = useConvexAuth();
  const remote = useQuery(
    api.userSettings.getMine,
    isAuthenticated ? {} : "skip"
  );
  const updateSettings = useMutation(api.userSettings.update);
  const [contentLanguages, setContentLanguages] =
    React.useState<ContentLanguages>(defaultUserSettings.contentLanguages);
  const [autoTranslate, setAutoTranslate] = React.useState(
    defaultUserSettings.autoTranslate
  );
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    if (!remote) return;
    setContentLanguages(remote.contentLanguages);
    setAutoTranslate(remote.autoTranslate);
  }, [remote]);

  const save = async () => {
    setSaving(true);
    try {
      if (isAuthenticated) {
        await updateSettings({
          ...(remote ?? defaultUserSettings),
          contentLanguages,
          autoTranslate,
        });
      }
      toast.success("Language preferences saved", {
        description:
          dir === "rtl"
            ? "RTL layout is active for this browser."
            : "Interface language updated for this browser.",
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
        <Label>Interface language</Label>
        <Select
          value={locale}
          onValueChange={(v) =>
            setLocale(v as (typeof languages)[number]["value"])
          }
        >
          <SelectTrigger className="w-full max-w-sm" aria-label="Interface language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {languages.map((l) => (
              <SelectItem key={l.value} value={l.value}>
                {l.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Layout direction: <span className="font-medium uppercase">{dir}</span>
          {dir === "rtl"
            ? " — Arabic flips the shell for this prototype."
            : " — switch to Arabic to preview RTL."}
        </p>
      </div>
      <div className="space-y-2">
        <Label>Content languages</Label>
        <Select
          value={contentLanguages}
          onValueChange={(v) => setContentLanguages(v as ContentLanguages)}
        >
          <SelectTrigger className="w-full max-w-sm" aria-label="Content languages">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-ar">English + Arabic</SelectItem>
            <SelectItem value="en">English only</SelectItem>
            <SelectItem value="all">All languages</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Feeds prioritize barks written in these languages.
        </p>
      </div>
      <Separator />
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-0.5">
          <Label htmlFor="auto-translate">Auto-translate barks</Label>
          <p className="text-xs text-muted-foreground">
            Show a translation option on barks in other languages.
          </p>
        </div>
        <Switch
          id="auto-translate"
          checked={autoTranslate}
          onCheckedChange={setAutoTranslate}
        />
      </div>
      <Button onClick={() => void save()} disabled={saving}>
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
