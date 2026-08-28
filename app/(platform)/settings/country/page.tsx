import type { Metadata } from "next";
import { CountryForm } from "@/components/settings/country-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Country Settings",
};

export default function CountrySettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Country & Region</CardTitle>
        <CardDescription>
          Your country powers the Local Feed and regional discussions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CountryForm />
      </CardContent>
    </Card>
  );
}
