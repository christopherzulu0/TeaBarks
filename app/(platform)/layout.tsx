import { MobileNav } from "@/components/shell/mobile-nav";
import { PlatformMain } from "@/components/shell/platform-main";
import { SidebarNav } from "@/components/shell/sidebar-nav";
import { TopNav } from "@/components/shell/top-nav";
import { NotificationSound } from "@/components/notifications/notification-sound";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <TopNav />
      <NotificationSound />
      <div className="flex min-h-0 min-w-0 flex-1">
        <aside className="sticky top-20 hidden h-[calc(100svh-5rem)] w-60 shrink-0 border-r bg-sidebar lg:block">
          <SidebarNav />
        </aside>
        <PlatformMain>{children}</PlatformMain>
      </div>
      <MobileNav />
    </div>
  );
}
