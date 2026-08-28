"use client";

import { CopyableCode } from "@/components/copyable-code";

export function CaseCode({
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
      label="case code"
      toastTitle="Case code copied"
      toastDescription="Others can paste it into Search to find this case."
    />
  );
}
