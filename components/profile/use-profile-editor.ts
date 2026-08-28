"use client";

import * as React from "react";
import { useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { countries } from "@/lib/data";
import { defaultUserSettings } from "@/lib/user-settings";
import { normalizeUsername, usernameError } from "@/lib/username";

export function useProfileEditor() {
  const { user, isLoaded } = useUser();
  const { isAuthenticated } = useConvexAuth();
  const settings = useQuery(
    api.userSettings.getMine,
    isAuthenticated ? {} : "skip"
  );
  const mine = useQuery(
    api.profiles.getMine,
    isAuthenticated ? {} : "skip"
  );
  const updateSettings = useMutation(api.userSettings.update);
  const updateUsername = useMutation(api.profiles.updateUsername);

  const [name, setName] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [bio, setBio] = React.useState("");
  const [website, setWebsite] = React.useState("");
  const [country, setCountry] = React.useState(defaultUserSettings.country);
  const [saving, setSaving] = React.useState(false);
  const [avatarBusy, setAvatarBusy] = React.useState(false);

  const storedUsername = mine?.username ?? user?.username ?? "";

  const reset = React.useCallback(() => {
    if (user) {
      setName(user.fullName ?? user.firstName ?? "");
      setUsername(mine?.username ?? user.username ?? "");
    }
    if (settings) {
      setBio(settings.bio);
      setWebsite(settings.website);
      setCountry(settings.country || defaultUserSettings.country);
    } else {
      setBio("");
      setWebsite("");
      setCountry(defaultUserSettings.country);
    }
  }, [user, settings, mine]);

  React.useEffect(() => {
    if (!user || mine === undefined) return;
    const savedName = user.fullName ?? user.firstName ?? "";
    const savedUsername = mine?.username ?? user.username ?? "";
    setName((current) =>
      !current || current === savedName ? savedName : current
    );
    setUsername((current) =>
      !current || current === (user.username ?? "")
        ? savedUsername
        : current
    );
  }, [user, mine]);

  React.useEffect(() => {
    if (!settings) return;
    setBio(settings.bio);
    setWebsite(settings.website);
    setCountry(settings.country || defaultUserSettings.country);
  }, [settings?.bio, settings?.website, settings?.country]);

  const save = React.useCallback(
    async (successDescription = "Your profile has been updated.") => {
      if (!user) {
        toast.message("Sign in to save your profile");
        return false;
      }
      const trimmedName = name.trim();
      if (!trimmedName) {
        toast.error("Display name is required");
        return false;
      }
      const handleError = usernameError(username);
      if (handleError) {
        toast.error(handleError);
        return false;
      }
      const handle = normalizeUsername(username);
      const countryCode = country.trim().toUpperCase();
      if (!countries.some((item) => item.code === countryCode)) {
        toast.error("Select a country");
        return false;
      }
      setSaving(true);
      try {
        await updateUsername({ username: handle });

        const parts = trimmedName.split(/\s+/);
        const firstName = parts[0] ?? trimmedName;
        const lastName = parts.slice(1).join(" ");
        await user.update({
          firstName,
          lastName: lastName || undefined,
        });

        const clerkHandle = (user.username ?? "").toLowerCase();
        if (handle !== clerkHandle) {
          try {
            await user.update({ username: handle });
          } catch {
            // App username is stored in Convex; Clerk may not allow handles.
          }
        }

        const current = settings ?? defaultUserSettings;
        await updateSettings({
          ...current,
          bio: bio.trim(),
          website: website.trim(),
          country: countryCode,
        });
        toast.success("Profile updated", {
          description: successDescription,
        });
        return true;
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not save profile"
        );
        return false;
      } finally {
        setSaving(false);
      }
    },
    [
      user,
      name,
      username,
      bio,
      website,
      country,
      settings,
      updateSettings,
      updateUsername,
    ]
  );

  const changeAvatar = React.useCallback(
    async (file: File | null) => {
      if (!user) return;
      setAvatarBusy(true);
      try {
        await user.setProfileImage({ file });
        toast.success(file ? "Avatar updated" : "Avatar removed");
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Could not update avatar"
        );
      } finally {
        setAvatarBusy(false);
      }
    },
    [user]
  );

  return {
    user,
    isLoaded,
    settings,
    storedUsername,
    name,
    setName,
    username,
    setUsername,
    bio,
    setBio,
    website,
    setWebsite,
    country,
    setCountry,
    saving,
    avatarBusy,
    save,
    changeAvatar,
    reset,
  };
}
