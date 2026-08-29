"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, BadgeCheck, PenLine } from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { useProfileEditor } from "@/components/profile/use-profile-editor";
import { CountrySelect } from "@/components/profile/country-select";
import { PersonAvatar } from "@/components/person-avatar";
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
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";

export function ProfileForm() {
  const { isAuthenticated } = useConvexAuth();
  const editor = useProfileEditor();
  const { user, isLoaded } = editor;
  const fileRef = React.useRef<HTMLInputElement>(null);
  const writerApp = useQuery(
    api.writers.getMyApplication,
    isAuthenticated ? {} : "skip"
  );
  const creator = useQuery(
    api.creators.getMine,
    isAuthenticated ? {} : "skip"
  );

  const displayName = user?.fullName ?? user?.firstName ?? "You";
  const avatarId = user?.id ?? "guest";

  if (!isLoaded) {
    return (
      <p className="text-sm text-muted-foreground">Loading profile…</p>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            How you appear across reactions, cases, and replies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <PersonAvatar
              id={avatarId}
              name={displayName}
              imageUrl={user?.imageUrl}
              className="size-16 text-xl"
            />
            <div className="flex flex-wrap gap-2">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void editor.changeAvatar(file);
                  e.target.value = "";
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!user || editor.avatarBusy}
                onClick={() => fileRef.current?.click()}
              >
                {editor.avatarBusy ? "Updating…" : "Change avatar"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={!user || editor.avatarBusy || !user.imageUrl}
                onClick={() => void editor.changeAvatar(null)}
              >
                Remove
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={editor.name}
                onChange={(e) => editor.setName(e.target.value)}
                autoComplete="name"
                className="h-10 md:h-8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={editor.username}
                onChange={(e) => editor.setUsername(e.target.value)}
                placeholder="yourname"
                autoComplete="username"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className="h-10 md:h-8"
              />
              <p className="text-xs text-muted-foreground">
                3–30 characters. Letters, numbers, and underscores.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={editor.bio}
              onChange={(e) => editor.setBio(e.target.value)}
              className="min-h-24"
            />
            <p className="text-xs text-muted-foreground">
              Shown on your profile. Sourcing habits and expertise help readers
              calibrate trust.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={editor.website}
                onChange={(e) => editor.setWebsite(e.target.value)}
                placeholder="https://your-research-site.org"
                inputMode="url"
                autoCapitalize="none"
                autoCorrect="off"
                className="h-10 md:h-8"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <CountrySelect
                id="country"
                value={editor.country}
                onChange={editor.setCountry}
                disabled={editor.saving}
              />
            </div>
          </div>
          <Button
            className="h-10 w-full sm:h-8 sm:w-auto"
            onClick={() => void editor.save()}
            disabled={editor.saving || !user}
          >
            {editor.saving ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PenLine className="size-5 text-primary" aria-hidden />
            {writerApp?.status === "approved"
              ? "Writer dashboard"
              : "Become a Writer"}
          </CardTitle>
          <CardDescription>
            {writerApp?.status === "approved"
              ? "Publish serialized fiction from your writer dashboard."
              : writerApp?.status === "pending"
                ? "Your writing sample is under review."
                : "Publish serialized fiction on TypeReact Stories. Submit a short writing sample to unlock the writer dashboard, contests, and publishing tools."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link
              href={
                writerApp?.status === "approved"
                  ? "/stories/dashboard"
                  : "/stories/apply"
              }
            >
              {writerApp?.status === "approved"
                ? "Open writer dashboard"
                : writerApp?.status === "pending"
                  ? "View application"
                  : "Apply as a writer"}{" "}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BadgeCheck className="size-5 text-verified" aria-hidden />
            {creator ? "Creator profile" : "Become a Creator"}
          </CardTitle>
          <CardDescription>
            {creator
              ? `@${creator.handle} is live. Respond officially to reactions and cases about your content.`
              : "Do you publish content on YouTube, TikTok, podcasts, or elsewhere? Verify channel ownership to get the verified badge and respond officially to reactions and accountability cases about your content."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild variant="outline">
            <Link
              href={creator ? `/creators/${creator.handle}` : "/creators/apply"}
            >
              {creator ? "View creator profile" : "Start creator application"}{" "}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
