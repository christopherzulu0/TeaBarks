"use client";

import { useReadingTextSize } from "@/components/reading-text-size-provider";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  readingTextSizeLabels,
  readingTextSizes,
  type ReadingTextSize,
} from "@/lib/reading-text-size";

export function ReadingForm() {
  const { textSize, setTextSize } = useReadingTextSize();

  return (
    <div className="space-y-2">
      <Label htmlFor="reading-text-size">Text size</Label>
      <Select
        value={textSize}
        onValueChange={(value) => setTextSize(value as ReadingTextSize)}
      >
        <SelectTrigger
          id="reading-text-size"
          className="w-full max-w-sm"
          aria-label="Reading text size"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {readingTextSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {readingTextSizeLabels[size]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        Applies to reaction analysis, story chapters, case files, and creator
        reviews. Saved in this browser.
      </p>
    </div>
  );
}
