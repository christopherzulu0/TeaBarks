import type { Metadata } from "next";
import { SavedLibrary } from "@/components/saved/saved-library";

export const metadata: Metadata = {
  title: "Saved",
};

export default function SavedPage() {
  return <SavedLibrary />;
}
