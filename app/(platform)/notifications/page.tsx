import type { Metadata } from "next";
import { NotificationsInbox } from "@/components/notifications/notifications-inbox";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function NotificationsPage() {
  return <NotificationsInbox />;
}
