"use client";

import * as React from "react";
import Link from "next/link";
import { SignInButton, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  ClipboardCopy,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { PlatformIcon } from "@/components/platform-icon";
import { api } from "@/convex/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { CountrySelect } from "@/components/profile/country-select";
import { topics } from "@/lib/data";
import { platformMeta } from "@/lib/meta";
import type { SourcePlatform } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Platforms", "Ownership", "Identity", "Review"] as const;

const applicablePlatforms: SourcePlatform[] = [
  "youtube",
  "tiktok",
  "instagram",
  "facebook",
  "x",
  "podcast",
  "livestream",
];

const VERIFICATION_CODE = "TB-VRF-8K3QM";

function Stepper({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                i < step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === step
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[11px] font-medium sm:block",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <Progress
        value={((step + 1) / STEPS.length) * 100}
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
      />
    </div>
  );
}

export function ApplyWizard() {
  const { isSignedIn, user } = useUser();
  const apply = useMutation(api.creators.apply);
  const [step, setStep] = React.useState(0);
  const [selected, setSelected] = React.useState<SourcePlatform[]>([]);
  const [links, setLinks] = React.useState<Record<string, string>>({});
  const [displayName, setDisplayName] = React.useState("");
  const [category, setCategory] = React.useState<string>("");
  const [country, setCountry] = React.useState("EG");
  const [about, setAbout] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [applicationCode, setApplicationCode] = React.useState<string | null>(
    null
  );

  React.useEffect(() => {
    const name = user?.fullName ?? user?.username ?? "";
    if (name) setDisplayName((current) => current || name);
  }, [user?.fullName, user?.username]);

  const togglePlatform = (p: SourcePlatform) =>
    setSelected((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );

  const next = () => {
    if (step === 0) {
      if (selected.length === 0) {
        toast.error("Select at least one platform you create on.");
        return;
      }
      const missingLink = selected.filter(
        (p) => !(links[p] ?? "").trim()
      );
      if (missingLink.length > 0) {
        toast.error(
          `Add a link for ${missingLink
            .map((p) => platformMeta[p].label)
            .join(", ")}.`
        );
        return;
      }
    }
    if (step === 2 && (!displayName.trim() || !category)) {
      toast.error("Add your public name and a content category.");
      return;
    }
    setStep((s) => s + 1);
  };

  const submit = async () => {
    if (!isSignedIn) {
      toast.error("Sign in to submit a creator application.");
      return;
    }
    setSubmitting(true);
    try {
      const officialLinks = selected
        .map((platform) => ({
          label: platformMeta[platform].label,
          url: (links[platform] ?? "").trim(),
        }))
        .filter((link) => link.url);
      const result = await apply({
        name: displayName.trim(),
        bio: about.trim(),
        country,
        category,
        platforms: selected,
        officialLinks,
        verificationMethod: "code",
      });
      setApplicationCode(result.applicationCode);
      toast.success("Application submitted", {
        description:
          "Our verification team reviews applications within 3–5 days. You'll be notified of the outcome.",
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (applicationCode) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-mixed/20">
              <Clock3 className="size-7 text-mixed-foreground dark:text-mixed" aria-hidden />
            </span>
            <CardTitle>Application pending review</CardTitle>
            <CardDescription className="leading-relaxed">
              Your creator application{" "}
              <span className="font-mono">{applicationCode}</span>{" "}
              is with the verification team. Once approved, your profile gets the{" "}
              <BadgeCheck className="inline size-4 text-verified" aria-hidden />{" "}
              verified badge and you can post Official Responses to barks and
              cases about your content.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-2">
            <Button asChild>
              <Link href="/profile">Go to profile</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Become a Creator</h1>
        <p className="text-sm text-muted-foreground">
          Verify that you own the public channels being discussed on TypeReact.
          Verified creators get a badge, an official profile, and the ability to
          respond to barks and accountability cases about their content.
        </p>
      </div>

      <Stepper step={step} />

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Where do you create?</CardTitle>
            <CardDescription>
              Select your platforms and paste a link to your channel or profile
              on each.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {applicablePlatforms.map((p) => {
              const active = selected.includes(p);
              return (
                <div
                  key={p}
                  className={cn(
                    "rounded-lg border p-3 transition-colors",
                    active && "border-primary/50 bg-accent/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Checkbox
                      id={`platform-${p}`}
                      checked={active}
                      onCheckedChange={() => togglePlatform(p)}
                    />
                    <Label
                      htmlFor={`platform-${p}`}
                      className="flex flex-1 cursor-pointer items-center gap-2"
                    >
                      <PlatformIcon platform={p} className="size-4" />
                      {platformMeta[p].label}
                    </Label>
                  </div>
                  {active && (
                    <Input
                      className="mt-3"
                      placeholder={`Link to your ${platformMeta[p].label} channel or profile`}
                      value={links[p] ?? ""}
                      onChange={(e) =>
                        setLinks((prev) => ({ ...prev, [p]: e.target.value }))
                      }
                      aria-label={`${platformMeta[p].label} link`}
                    />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Prove ownership</CardTitle>
            <CardDescription>
              Place a one-time code in your channel bio or a pinned post.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Add this code to the bio or a pinned post of each selected
              channel, then submit. We check for it during review and you can
              remove it after approval.
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-md border bg-muted px-3 py-2 font-mono text-sm">
                {VERIFICATION_CODE}
              </code>
              <Button
                variant="outline"
                size="icon"
                aria-label="Copy verification code"
                onClick={() => {
                  navigator.clipboard.writeText(VERIFICATION_CODE);
                  toast.success("Code copied to clipboard");
                }}
              >
                <ClipboardCopy className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Public identity</CardTitle>
            <CardDescription>
              How your creator profile will appear on TypeReact.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="creator-name">Public name</Label>
                <Input
                  id="creator-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Content category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger aria-label="Content category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {topics.map((t) => (
                      <SelectItem key={t.slug} value={t.slug}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="creator-country">Country</Label>
              <CountrySelect
                id="creator-country"
                value={country}
                onChange={setCountry}
                className="sm:max-w-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="creator-about">About your content</Label>
              <Textarea
                id="creator-about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="What do you make, and for whom?"
                className="min-h-24"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Review and submit</CardTitle>
            <CardDescription>
              The verification team reviews applications within 3–5 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Public name</dt>
                <dd className="font-medium">{displayName}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Category</dt>
                <dd className="font-medium">
                  {topics.find((t) => t.slug === category)?.name ?? "—"}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Platforms</dt>
                <dd className="flex flex-wrap justify-end gap-1.5">
                  {selected.map((p) => (
                    <Badge key={p} variant="secondary" className="gap-1">
                      <PlatformIcon platform={p} className="size-3" />
                      {platformMeta[p].label}
                    </Badge>
                  ))}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Ownership proof</dt>
                <dd className="font-medium">Verification code in bio</dd>
              </div>
            </dl>
            <Separator />
            <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p>
                By submitting you confirm you own these channels and agree to
                the{" "}
                <Link
                  href="/policies/community-guidelines"
                  className="text-primary underline underline-offset-4"
                >
                  Community Guidelines
                </Link>
                . Misrepresenting ownership is impersonation and leads to a
                permanent ban.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : !isSignedIn ? (
          <SignInButton>
            <Button>
              <BadgeCheck className="size-4" /> Sign in to submit
            </Button>
          </SignInButton>
        ) : (
          <Button onClick={submit} disabled={submitting}>
            <BadgeCheck className="size-4" />
            {submitting ? "Submitting…" : "Submit application"}
          </Button>
        )}
      </div>
    </div>
  );
}
