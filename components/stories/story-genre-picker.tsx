"use client";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { genreMeta } from "@/lib/story-meta";
import type { StoryGenre } from "@/lib/story-types";

const genres = Object.keys(genreMeta) as StoryGenre[];

export function StoryGenrePicker({
  value,
  onChange,
}: {
  value: StoryGenre | "";
  onChange: (genre: StoryGenre) => void;
}) {
  return (
    <Command className="rounded-lg border bg-transparent">
      <CommandInput placeholder="Search True Crime, Mysteries, UFO…" />
      <CommandList className="max-h-56">
        <CommandEmpty>No genre matches.</CommandEmpty>
        {genres.map((g) => {
          const meta = genreMeta[g];
          const Icon = meta.icon;
          return (
            <CommandItem
              key={g}
              value={`${meta.label} ${g}`}
              data-checked={value === g}
              onSelect={() => onChange(g)}
            >
              <Icon className="size-4 text-muted-foreground" aria-hidden />
              {meta.label}
            </CommandItem>
          );
        })}
      </CommandList>
    </Command>
  );
}
