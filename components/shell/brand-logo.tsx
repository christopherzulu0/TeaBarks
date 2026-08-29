import { cn } from "@/lib/utils";

export function BrandLogo({
  alt = "TypeReact",
  className,
}: {
  alt?: string;
  className?: string;
}) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={cn("block h-auto w-auto shrink-0", className)}
    />
  );
}
