import type { Metadata } from "next";
import { PrivacyForm } from "@/components/settings/privacy-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Settings",
};

export default function PrivacySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>
          Control what others can see and how they can reach you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PrivacyForm />
      </CardContent>
    </Card>
  );
}
