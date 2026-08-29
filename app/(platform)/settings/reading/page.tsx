import type { Metadata } from "next";
import { ReadingForm } from "@/components/settings/reading-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Reading Settings",
};

export default function ReadingSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reading</CardTitle>
        <CardDescription>
          Adjust text size for long-form content across TeaBarks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ReadingForm />
      </CardContent>
    </Card>
  );
}
