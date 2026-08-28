"use client";

import { CopyableCode } from "@/components/copyable-code";

export function ReviewCode({
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
      label="review code"
      toastTitle="Review code copied"
      toastDescription="Others can paste it into Search to find this review."
    />
  );
}
