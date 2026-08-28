import type { Metadata } from "next";
import { Suspense } from "react";
import { MessagesView } from "@/components/messages/messages-view";

export const metadata: Metadata = {
  title: "Messages",
};

export default function MessagesPage() {
  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
      <Suspense fallback={<div className="min-h-0 flex-1" />}>
        <MessagesView />
      </Suspense>
    </div>
  );
}
