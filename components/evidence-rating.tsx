import { ShieldCheck } from "lucide-react";
import { evidenceRatingClass, evidenceRatingLabel } from "@/lib/meta";
import { cn } from "@/lib/utils";

export function EvidenceRating({
  rating,
  showLabel = true,
  className,
}: {
  rating: number;
  showLabel?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium tabular-nums",
        evidenceRatingClass(rating),
        className
      )}
      title={`Evidence rating: ${rating}/100`}
    >
      <ShieldCheck className="size-3.5" aria-hidden />
      {rating}
      {showLabel && (
        <span className="text-muted-foreground font-normal">
          · {evidenceRatingLabel(rating)}
        </span>
      )}
    </span>
  );
}
