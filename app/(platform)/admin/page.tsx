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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
          <LayoutDashboard className="size-5 text-primary" aria-hidden />
        </span>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Platform health, moderation, and verification oversight.
          </p>
        </div>
      </div>

      <AdminStats />

      <Tabs defaultValue="analytics">
        <TabsList className="h-auto w-full flex-wrap justify-start">
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

        <TabsContent value="analytics" className="mt-4">
          <AdminAnalytics />
        </TabsContent>

        <TabsContent value="users" className="mt-4">
          <AdminUsers />
        </TabsContent>

        <TabsContent value="creators" className="mt-4">
          <AdminCreators />
        </TabsContent>

        <TabsContent value="reports" className="mt-4">
          <AdminReports />
        </TabsContent>

        <TabsContent value="sync" className="mt-4">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Loading sync…</p>}>
            <ClerkSyncPanel />
          </Suspense>
        </TabsContent>

        <TabsContent value="evidence" className="mt-4">
          <CaseReviewQueue />
        </TabsContent>

        <TabsContent value="verification" className="mt-4">
          <VerificationQueue />
        </TabsContent>

        <TabsContent value="stories" className="mt-4 space-y-6">
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

        <TabsContent value="contests" className="mt-4">
          <ContestAdminPanel />
        </TabsContent>

        <TabsContent value="moderation" className="mt-4">
          <AdminModeration />
        </TabsContent>
      </Tabs>
    </div>
  );
}
