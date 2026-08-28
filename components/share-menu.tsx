"use client";

import { Check, Copy, Link2, Quote, Share2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

async function copyText(text: string, success: string, description?: string) {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(success, description ? { description } : undefined);
    return true;
  } catch {
    toast.error("Couldn't copy. Select and copy it manually.");
    return false;
  }
}

export function ShareMenu({
  code,
  title,
  kind,
  path,
}: {
  code: string;
  title: string;
  kind: "bark" | "case";
  /** Absolute path, e.g. `/barks/BRK-2026-0341` */
  path: string;
}) {
  const [copied, setCopied] = React.useState<"code" | "url" | "cite" | null>(
    null
  );

  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}${path}`
      : path;

  const cite =
    kind === "bark"
      ? `${title} (${code}). TeaBarks. ${url}`
      : `${title} (${code}). TeaBarks Accountability Case. ${url}`;

  const mark = (key: "code" | "url" | "cite") => {
    setCopied(key);
    window.setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" aria-label={`Share ${kind}`}>
          <Share2 className="size-3.5" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Share this {kind}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={async () => {
            if (await copyText(code, `${kind === "bark" ? "Bark" : "Case"} code copied`, "Paste into Search to find it.")) {
              mark("code");
            }
          }}
        >
          {copied === "code" ? (
            <Check className="size-4 text-agree" />
          ) : (
            <Copy className="size-4" />
          )}
          Copy {kind} code
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            if (await copyText(url, "Link copied")) mark("url");
          }}
        >
          {copied === "url" ? (
            <Check className="size-4 text-agree" />
          ) : (
            <Link2 className="size-4" />
          )}
          Copy link
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={async () => {
            if (
              await copyText(
                cite,
                "Citation copied",
                "Ready to paste into notes or replies."
              )
            ) {
              mark("cite");
            }
          }}
        >
          {copied === "cite" ? (
            <Check className="size-4 text-agree" />
          ) : (
            <Quote className="size-4" />
          )}
          Copy citation
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
