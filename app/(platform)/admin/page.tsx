import type { Metadata } from "next";
import { Suspense } from "react";
import { LayoutDashboard } from "lucide-react";
import { AdminAnalytics } from "@/components/admin/admin-analytics";
import { AdminCreators } from "@/components/admin/admin-creators";
import { AdminFlaggedStories } from "@/components/admin/admin-flagged-stories";
import { AdminModeration } from "@/components/admin/admin-moderation";
import { AdminReports } from "@/components/admin/admin-reports";
import { AdminStats } from "@/components/admin/admin-stats";
import { AdminUsers } from "@/components/admin/admin-users";
import { CaseReviewQueue } from "@/components/admin/case-review-queue";
import { ClerkSyncPanel } from "@/components/admin/clerk-sync-panel";
import { ContestAdminPanel } from "@/components/admin/contest-admin";
import { VerificationQueue } from "@/components/admin/verification-queue";
import { WriterApplicationsQueue } from "@/components/admin/writer-applications-queue";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminPage() {
  return (
    <div className="mx-auto w-full min-w-0 max-w-6xl space-y-6 px-4 py-8">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <LayoutDashboard className="size-5 text-primary" aria-hidden />
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform health, moderation, and verification oversight.
          </p>
        </div>
      </div>

      <AdminStats />

      <Tabs defaultValue="analytics" className="min-w-0">
        <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:overflow-visible sm:px-0">
          <TabsList className="inline-flex h-auto w-max max-w-none flex-nowrap gap-1 p-1 sm:w-full sm:max-w-full sm:flex-wrap [&_[data-slot=tabs-trigger]]:shrink-0 [&_[data-slot=tabs-trigger]]:flex-none sm:[&_[data-slot=tabs-trigger]]:flex-1">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="sync">Sync</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
            <TabsTrigger value="stories">Stories</TabsTrigger>
            <TabsTrigger value="contests">Contests</TabsTrigger>
            <TabsTrigger value="moderation">Moderation</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="analytics" className="mt-4 min-w-0">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="users" className="mt-4 min-w-0">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="creators" className="mt-4 min-w-0">
          <AdminCreators />
        </TabsContent>

        <TabsContent value="reports" className="mt-4 min-w-0">
          <AdminReports />
        </TabsContent>

        <TabsContent value="sync" className="mt-4 min-w-0">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sync…</p>}>
            <ClerkSyncPanel />
          </Suspense>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4 min-w-0">
          <CaseReviewQueue />
        </TabsContent>

        <TabsContent value="verification" className="mt-4 min-w-0">
          <VerificationQueue />
        </TabsContent>

        <TabsContent value="stories" className="mt-4 min-w-0 space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold">Flagged stories</h3>
            <AdminFlaggedStories />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold">
              Writer applications
            </h3>
            <WriterApplicationsQueue />
          </div>
        </TabsContent>

        <TabsContent value="contests" className="mt-4 min-w-0">
          <ContestAdminPanel />
        </TabsContent>

        <TabsContent value="moderation" className="mt-4 min-w-0">
          <AdminModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
