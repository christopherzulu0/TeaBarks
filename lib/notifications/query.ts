import type { Notification, NotificationCategory } from "@/lib/types";

export type NotificationDoc = {
  _id: string;
  category: NotificationCategory;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: number;
};

export function toUiNotification(doc: NotificationDoc): Notification {
  return {
    id: doc._id,
    category: doc.category,
    title: doc.title,
    body: doc.body,
    time: new Date(doc.createdAt).toISOString(),
    read: doc.read,
    href: doc.href,
  };
}
