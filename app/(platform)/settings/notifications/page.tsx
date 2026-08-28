import type { Metadata } from "next";
import { NotificationSettingsForm } from "@/components/notifications/notification-settings-form";

export const metadata: Metadata = {
  title: "Notification Settings",
};

export default function NotificationSettingsPage() {
  return <NotificationSettingsForm />;
}
