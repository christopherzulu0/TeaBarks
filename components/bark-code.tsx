"use client";

import { CopyableCode } from "@/components/copyable-code";
import { REACTION_ID_LABEL } from "@/lib/brand";

export function BarkCode({
  code,
  size = "sm",
  className,
}: {
  code: string;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <CopyableCode
      code={code}
      size={size}
      className={className}
      label={REACTION_ID_LABEL}
      toastTitle={`${REACTION_ID_LABEL} copied`}
      toastDescription="Others can paste it into Search to find this reaction."
    />
  );
}
