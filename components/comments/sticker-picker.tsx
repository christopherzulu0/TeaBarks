"use client";

import * as React from "react";
import { Sticker, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarkSticker,
  barkStickers,
  type BarkStickerId,
} from "@/lib/barks/stickers";

export function StickerPicker({
  value,
  onPick,
}: {
  value: BarkStickerId | null;
  onPick: (id: BarkStickerId | null) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-1">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
            <Sticker className="size-4" aria-hidden />
            <span className="sr-only">Send a sticker</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-64 p-2">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Stickers
          </p>
          <div className="grid grid-cols-5 gap-1">
            {barkStickers.map((sticker) => (
              <button
                key={sticker.id}
                type="button"
                className="flex flex-col items-center gap-1 rounded-md p-1.5 hover:bg-muted"
                onClick={() => {
                  onPick(sticker.id);
                  setOpen(false);
                }}
              >
                <sticker.Icon className="size-10" />
                <span className="text-[10px] text-muted-foreground">
                  {sticker.label}
                </span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      {value ? (
        <span className="inline-flex items-center gap-1 rounded-md border bg-muted/40 py-0.5 pl-1 pr-0.5">
          <BarkSticker id={value} className="size-7" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-6 p-0"
            onClick={() => onPick(null)}
            aria-label="Remove sticker"
          >
            <X className="size-3" />
          </Button>
        </span>
      ) : null}
    </div>
  );
}
