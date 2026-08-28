"use client";

import * as React from "react";
import { Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊",
  "😇", "🙂", "😉", "😍", "🤩", "😘", "😗", "😋",
  "😜", "🤪", "🤑", "🤗", "🤔", "🤨", "😐", "😏",
  "😒", "🙄", "😬", "😌", "😴", "😷", "🤒", "🤯",
  "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁",
  "😮", "😯", "😲", "😳", "🥺", "😢", "😭", "😤",
  "😠", "😡", "🤬", "😈", "💀", "💩", "🤡", "👻",
  "👍", "👎", "👏", "🙌", "🤝", "🙏", "💪", "🔥",
  "✨", "⭐", "💯", "❤️", "🧡", "💛", "💚", "💙",
  "💜", "🖤", "🤍", "☕", "🍵", "🐶", "📚", "⚖️",
];

export function EmojiPicker({
  onPick,
}: {
  onPick: (emoji: string) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button type="button" variant="ghost" size="sm" className="h-8 px-2">
          <Smile className="size-4" aria-hidden />
          <span className="sr-only">Insert emoji</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-2">
        <p className="mb-2 text-xs font-medium text-muted-foreground">Emoji</p>
        <div className="grid max-h-48 grid-cols-8 gap-0.5 overflow-y-auto">
          {EMOJIS.map((emoji) => (
            <button
              key={emoji}
              type="button"
              className="flex size-8 items-center justify-center rounded-md text-lg hover:bg-muted"
              onClick={() => {
                onPick(emoji);
                setOpen(false);
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
