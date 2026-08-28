import type { Metadata } from "next";
import { LanguageForm } from "@/components/settings/language-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Language Settings",
};

export default function LanguageSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Language</CardTitle>
        <CardDescription>
          Interface language, RTL layout, and content preferences.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <LanguageForm />
      </CardContent>
    </Card>
  );
}
