import type { Metadata } from "next";
import { ContinueWritingRoute } from "@/components/stories/continue-writing-route";

export const metadata: Metadata = {
  title: "Continue writing",
};

export default function ContinueWritingPage() {
  return <ContinueWritingRoute />;
}
