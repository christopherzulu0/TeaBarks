import { BadgeCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function VerifiedBadge({ className }: { className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <BadgeCheck
          className={cn("size-4 shrink-0 text-verified", className)}
          aria-label="Verified"
        />
      </TooltipTrigger>
      <TooltipContent>Verified identity</TooltipContent>
    </Tooltip>
  );
}
