"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Compass, Home, PenSquare, UserCircle } from "lucide-react";
import { UnreadCountBadge } from "@/components/notifications/unread-badge";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/create", label: "Create", icon: PenSquare, primary: true },
  { href: "/notifications", label: "Alerts", icon: Bell },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden"
    >
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const href = item.href;
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 py-2 text-[10px] font-medium transition-colors",
                item.primary
                  ? "text-primary"
                  : active
                    ? "text-foreground"
                    : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "relative flex items-center justify-center rounded-full",
                  item.primary &&
                    "size-8 -mt-1 bg-primary text-primary-foreground"
                )}
              >
                <Icon className={cn("size-5", item.primary && "size-4.5")} />
                {item.href === "/notifications" ? (
                  <UnreadCountBadge compact className="-right-1 -top-1" />
                ) : null}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
