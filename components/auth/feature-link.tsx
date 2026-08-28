"use client";

import Link from "next/link";
import { useBillingAccess } from "@/components/auth/use-billing";

export function FeatureLink({
  feature,
  href,
  className,
  children,
  ...props
}: {
  feature: string;
  href: string;
} & Omit<React.ComponentProps<typeof Link>, "href">) {
  const billing = useBillingAccess();
  const target = billing.hrefFor(feature, href);
  return (
    <Link href={target} className={className} {...props}>
      {children}
    </Link>
  );
}
