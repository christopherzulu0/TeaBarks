"use client";

import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  LayoutDashboard,
  Library,
  PenLine,
} from "lucide-react";
import { useConvexAuth, useQuery } from "convex/react";
import { FeatureLink } from "@/components/auth/feature-link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/convex/_generated/api";
import { FEATURES } from "@/lib/billing";

export function useMyWriterApplication() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const application = useQuery(
    api.writers.getMyApplication,
    isAuthenticated ? {} : "skip"
  );
  const loading = isLoading || (isAuthenticated && application === undefined);
  return { loading, isAuthenticated, application };
}

export function WriterHomeBanner() {
  const { loading, application } = useMyWriterApplication();

  if (loading) {
    return <Skeleton className="h-28 w-full rounded-xl" />;
  }

  if (application && application.status === "approved") {
    return (
      <Card className="flex flex-col gap-4 border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 font-semibold">
            <LayoutDashboard className="size-4 text-primary" aria-hidden />
            Writer dashboard
          </p>
          <p className="text-sm text-muted-foreground">
            Create drafts, publish parts, and manage your stories.
          </p>
        </div>
        <Button asChild className="shrink-0">
          <FeatureLink
            feature={FEATURES.writerDashboard}
            href="/stories/dashboard"
          >
            Open dashboard <ArrowRight className="size-4" />
          </FeatureLink>
        </Button>
      </Card>
    );
  }

  if (application && application.status === "pending") {
    return (
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 font-semibold">
            <Clock3 className="size-4 text-primary" aria-hidden />
            Application under review
          </p>
          <p className="text-sm text-muted-foreground">
            Application{" "}
            <span className="font-mono">{application.applicationCode}</span> is
            with the editorial team.
          </p>
        </div>
      </Card>
    );
  }

  if (application && application.status === "rejected") {
    return (
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p className="flex items-center gap-2 font-semibold">
            <PenLine className="size-4 text-muted-foreground" aria-hidden />
            Writer application on file
          </p>
          <p className="text-sm text-muted-foreground">
            This account already has a writer application, so a new submission
            is not available.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col gap-4 border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <p className="flex items-center gap-2 font-semibold">
          <PenLine className="size-4 text-primary" aria-hidden />
          Apply to become a writer
        </p>
        <p className="text-sm text-muted-foreground">
          Submit a short writing sample and publishing commitments. Takes about
          five minutes.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button asChild>
          <Link href="/stories/apply">
            Apply now <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <FeatureLink
            feature={FEATURES.writerDashboard}
            href="/stories/dashboard"
          >
            Dashboard
          </FeatureLink>
        </Button>
      </div>
    </Card>
  );
}

export function WriterDiscoverCtas() {
  const { loading, application } = useMyWriterApplication();
  const status = application?.status;

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {loading ? (
          <Skeleton className="h-10 w-44" />
        ) : status === "approved" ? (
          <Button asChild size="lg">
            <FeatureLink
              feature={FEATURES.writerDashboard}
              href="/stories/dashboard"
            >
              <LayoutDashboard className="size-4" /> Writer dashboard
            </FeatureLink>
          </Button>
        ) : !status ? (
          <Button asChild size="lg">
            <Link href="/stories/apply">
              <PenLine className="size-4" /> Become a Writer
            </Link>
          </Button>
        ) : null}
        <Button asChild size="lg" variant="outline">
          <Link href="/stories/library">
            <Library className="size-4" /> My library
          </Link>
        </Button>
      </div>
      {loading || status ? null : (
        <p className="text-xs text-muted-foreground">
          Want to publish? Apply once — approval unlocks the writer dashboard
          and contests.
        </p>
      )}
    </>
  );
}

export function WriterContestsCta() {
  const { loading, application } = useMyWriterApplication();
  const status = application?.status;

  if (loading) {
    return <Skeleton className="mt-4 h-3 w-56" />;
  }

  if (status === "approved") {
    return (
      <p className="text-xs text-muted-foreground">
        Enter from the{" "}
        <FeatureLink
          feature={FEATURES.writerDashboard}
          href="/stories/dashboard"
          className="text-primary underline underline-offset-4"
        >
          writer dashboard
        </FeatureLink>
        .
      </p>
    );
  }

  if (status === "pending" || status === "rejected") {
    return null;
  }

  return (
    <p className="text-xs text-muted-foreground">
      Want in next time?{" "}
      <Link
        href="/stories/apply"
        className="text-primary underline underline-offset-4"
      >
        Become a writer
      </Link>{" "}
      to enter contests.
    </p>
  );
}
