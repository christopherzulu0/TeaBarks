"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function CopyableCode({
  code,
  label,
  toastTitle,
  toastDescription,
  size = "sm",
  className,
}: {
  code: string;
  label: string;
  toastTitle: string;
  toastDescription: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success(toastTitle, { description: toastDescription });
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(`Couldn't copy the ${label}. Select and copy it manually.`);
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${label}`}
      aria-label={`Copy ${label} ${code}`}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border bg-muted/60 font-mono text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
        size === "sm" && "px-1.5 py-0.5 text-[10px]",
        size === "md" && "px-2 py-1 text-xs",
        className
      )}
    >
      <span>{code}</span>
      {copied ? (
        <Check className="size-3 text-agree" aria-hidden />
      ) : (
        <Copy className="size-3 opacity-70" aria-hidden />
      )}
    </button>
  );
}
