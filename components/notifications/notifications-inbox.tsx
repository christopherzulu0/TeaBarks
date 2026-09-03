"use client";

import Link from "next/link";
import { Show, SignInButton } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  AtSign,
  BadgeCheck,
  Bell,
  FileStack,
  Mail,
  MessageSquare,
  Rss,
  ShieldCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { timeAgo } from "@/lib/format";
import { notificationCategoryMeta } from "@/lib/meta";
import { toUiNotification } from "@/lib/notifications/query";
import type { Notification, NotificationCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<NotificationCategory, LucideIcon> = {
  reply: MessageSquare,
  mention: AtSign,
  follower: UserPlus,
  following: Rss,
  "creator-response": BadgeCheck,
  evidence: FileStack,
  verification: ShieldCheck,
  message: Mail,
  circle: Users,
};

function NotificationsHeader() {
  return (
    <div>
      <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
        Notifications
      </h1>
      <p className="text-sm text-muted-foreground">
        Replies, mentions, evidence updates, and creator responses.
      </p>
    </div>
  );
}

function NotificationItem({ n }: { n: Notification }) {
  const markRead = useMutation(api.notifications.markRead);
  const Icon = categoryIcons[n.category];
  return (
    <Link
      href={n.href}
      className="block"
      onClick={() => {
        if (!n.read) {
          void markRead({
            notificationId: n.id as Id<"notifications">,
          }).catch(() => undefined);
        }
      }}
    >
      <Card
        className={cn(
          "flex-row items-start gap-3 p-4 transition-colors hover:border-primary/40",
          !n.read && "border-primary/30 bg-primary/[0.03]"
        )}
      >
        <span
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            n.read ? "bg-muted" : "bg-primary/10"
          )}
        >
          <Icon
            className={cn(
              "size-4",
              n.read ? "text-muted-foreground" : "text-primary"
            )}
            aria-hidden
          />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium leading-snug">{n.title}</p>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {n.body}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {timeAgo(n.time)} · {notificationCategoryMeta[n.category].label}
          </p>
        </div>
        {!n.read && (
          <span
            className="mt-1.5 size-2 shrink-0 rounded-full bg-primary"
            aria-label="Unread"
          />
        )}
      </Card>
    </Link>
  );
}

function NotificationsSignedIn() {
  const { isAuthenticated } = useConvexAuth();
  const docs = useQuery(
    api.notifications.listMine,
    isAuthenticated ? {} : "skip"
  );
  const unreadState = useQuery(
    api.notifications.unreadCount,
    isAuthenticated ? {} : "skip"
  );
  const markAllRead = useMutation(api.notifications.markAllRead);

  if (!isAuthenticated || docs === undefined) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
        <NotificationsHeader />
        <p className="py-16 text-center text-sm text-muted-foreground">
          Loading notifications…
        </p>
      </div>
    );
  }

  const items = docs.map(toUiNotification);
  const unread = unreadState?.count ?? items.filter((n) => !n.read).length;
  const categories = Object.keys(
    notificationCategoryMeta
  ) as NotificationCategory[];

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            Notifications
            {unread > 0 && <Badge>{unread} new</Badge>}
          </h1>
          <p className="text-sm text-muted-foreground">
            Replies, mentions, evidence updates, and creator responses.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={unread === 0}
          onClick={() => {
            void (async () => {
              try {
                await markAllRead({});
              } catch (error) {
                toast.error(
                  error instanceof Error
                    ? error.message
                    : "Could not mark notifications as read"
                );
              }
            })();
          }}
        >
          Mark all as read
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          {categories.map((c) => (
            <TabsTrigger key={c} value={c}>
              {notificationCategoryMeta[c].label}
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="all" className="mt-4 space-y-2">
          {items.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nothing here yet"
              description="Replies, follows, and case updates will show up here."
            />
          ) : (
            items.map((n) => <NotificationItem key={n.id} n={n} />)
          )}
        </TabsContent>
        {categories.map((c) => {
          const filtered = items.filter((n) => n.category === c);
          return (
            <TabsContent key={c} value={c} className="mt-4 space-y-2">
              {filtered.length === 0 ? (
                <EmptyState
                  icon={Bell}
                  title="Nothing here yet"
                  description={`You'll see ${notificationCategoryMeta[c].label.toLowerCase()} notifications here.`}
                />
              ) : (
                filtered.map((n) => <NotificationItem key={n.id} n={n} />)
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}

export function NotificationsInbox() {
  return (
    <>
      <Show when="signed-out">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
          <NotificationsHeader />
          <EmptyState
            icon={Bell}
            title="Sign in to see notifications"
            description="Replies, mentions, evidence updates, and creator responses land here."
            action={
              <SignInButton>
                <Button>Sign in</Button>
              </SignInButton>
            }
          />
        </div>
      </Show>
      <Show when="signed-in">
        <NotificationsSignedIn />
      </Show>
    </>
  );
}
