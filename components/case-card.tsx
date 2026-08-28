import Link from "next/link";
import { FileStack, Users } from "lucide-react";
import { CaseCode } from "@/components/case-code";
import { PersonAvatar } from "@/components/person-avatar";
import { PlatformIcon } from "@/components/platform-icon";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getCreator, getSource } from "@/lib/data";
import { formatNumber, timeAgo } from "@/lib/format";
import { caseStatusMeta } from "@/lib/meta";
import type { AccountabilityCase } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CaseCard({
  accountabilityCase: c,
  className,
}: {
  accountabilityCase: AccountabilityCase;
  className?: string;
}) {
  const source = getSource(c.sourceId);
  const creator = getCreator(c.creatorId);
  const creatorName = creator?.name ?? c.creatorName;
  const status = caseStatusMeta[c.status];

  return (
    <Card className={cn("gap-0 p-0", className)}>
      <div className="flex flex-col gap-3 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <CaseCode code={c.code} size="sm" />
          <Badge variant="outline" className={status.badgeClass}>
            {status.label}
          </Badge>
          <span className="ml-auto text-xs text-muted-foreground">
            Updated {timeAgo(c.updatedAt)}
          </span>
        </div>

        <Link
          href={`/cases/${c.code}`}
          className="group rounded-sm focus-visible:outline-2 focus-visible:outline-ring"
        >
          <h3 className="font-semibold leading-snug tracking-tight group-hover:text-primary transition-colors">
            {c.title}
          </h3>
        </Link>

        <p className="line-clamp-2 text-sm text-muted-foreground">{c.summary}</p>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-muted-foreground">
          {creatorName && (
            <span className="flex items-center gap-2">
              <PersonAvatar
                id={creator?.id ?? c.creatorId}
                name={creatorName}
                className="size-5"
              />
              <span className="font-medium text-foreground">{creatorName}</span>
              {source && (
                <span className="inline-flex items-center gap-1">
                  <PlatformIcon platform={source.platform} className="size-3.5" />
                </span>
              )}
            </span>
          )}
          <span className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <FileStack className="size-3.5" aria-hidden />
              {c.evidence.length} evidence items
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" aria-hidden />
              {formatNumber(c.followers)} following
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
