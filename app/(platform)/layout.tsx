import { MobileNav } from "@/components/shell/mobile-nav";
import { PlatformMain } from "@/components/shell/platform-main";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopNav } from "@/components/shell/top-nav";
import { NotificationSound } from "@/components/notifications/notification-sound";
import { SHELL_STICKY_HEIGHT, SHELL_STICKY_TOP } from "@/lib/shell";
import { cn } from "@/lib/utils";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh min-w-0 flex-col overflow-x-hidden">
      <TopNav />
      <NotificationSound />
      <div className="flex min-h-0 min-w-0 flex-1">
        <aside
          className={cn(
            "sticky hidden w-60 shrink-0 border-r bg-sidebar lg:block",
            SHELL_STICKY_TOP,
            SHELL_STICKY_HEIGHT
          )}
        >
          <SidebarNav />
        </aside>
        <PlatformMain>{children}</PlatformMain>
      </div>
      <MobileNav />
    </div>
  );
}
