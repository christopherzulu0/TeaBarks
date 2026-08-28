"use client";

import { useConvexAuth, useQuery } from "convex/react";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { cn } from "@/lib/utils";

export function useUnreadNotificationCount() {
  const { isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.notifications.unreadCount,
    isAuthenticated ? {} : "skip"
  );
  return data?.count ?? 0;
}

export function useUnreadMessageCount() {
  const { isAuthenticated } = useConvexAuth();
  const data = useQuery(
    api.messages.unreadCount,
    isAuthenticated ? {} : "skip"
  );
  return data?.count ?? 0;
}

function CountBadge({
  count,
  className,
  compact = false,
}: {
  count: number;
  className?: string;
  compact?: boolean;
}) {
  if (count <= 0) return null;
  return (
    <Badge
      className={cn(
        compact
          ? "absolute -right-0.5 -top-0.5 size-4 justify-center rounded-full p-0 text-[9px]"
          : "h-5 min-w-5 justify-center rounded-full px-1 text-[10px]",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </Badge>
  );
}

export function UnreadCountBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <CountBadge
      count={useUnreadNotificationCount()}
      className={className}
      compact={compact}
    />
  );
}

export function MessagesUnreadBadge({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <CountBadge
      count={useUnreadMessageCount()}
      className={className}
      compact={compact}
    />
  );
}
