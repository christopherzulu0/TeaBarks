"use client";

import { ALargeSmall } from "lucide-react";
import { useReadingTextSize } from "@/components/reading-text-size-provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  readingTextSizeLabels,
  readingTextSizes,
  type ReadingTextSize,
} from "@/lib/reading-text-size";
import { cn } from "@/lib/utils";

export function ReadingTextSizeControl({
  variant = "icon",
  className,
}: {
  variant?: "icon" | "sm";
  className?: string;
}) {
  const { textSize, setTextSize } = useReadingTextSize();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size={variant === "icon" ? "icon" : "sm"}
          className={className}
          aria-label="Text size"
        >
          <ALargeSmall className="size-4" />
          {variant === "sm" ? (
            <span className="sr-only sm:not-sr-only">
              {readingTextSizeLabels[textSize]}
            </span>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Text size</DropdownMenuLabel>
        {readingTextSizes.map((size) => (
          <DropdownMenuItem
            key={size}
            onSelect={() => setTextSize(size as ReadingTextSize)}
            className={cn(textSize === size && "bg-accent")}
          >
            {readingTextSizeLabels[size]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
