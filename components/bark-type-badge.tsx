import { Badge } from "@/components/ui/badge";
import { barkTypeMeta } from "@/lib/meta";
import type { BarkType } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BarkTypeBadge({
  type,
  className,
}: {
  type: BarkType;
  className?: string;
}) {
  const meta = barkTypeMeta[type] ?? {
    label: type || "Reaction",
    badgeClass: "bg-muted text-muted-foreground border-border",
  };
  return (
    <Badge
      variant="outline"
      className={cn("font-medium", meta.badgeClass, className)}
    >
      {meta.label}
    </Badge>
  );
}
