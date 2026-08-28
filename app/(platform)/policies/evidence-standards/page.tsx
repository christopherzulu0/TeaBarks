import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata: Metadata = {
  title: "Evidence Standards",
};

const tiers = [
  {
    label: "Strong",
    className: "bg-agree/15 text-agree border-agree/30",
    description:
      "Primary sources: original footage with timestamps, official documents, court records, peer-reviewed research, archived pages of the original statement.",
  },
  {
    label: "Moderate",
    className: "bg-verified/15 text-verified border-verified/30",
    description:
      "Reputable secondary sources: established journalism citing named sources, expert analysis, multiple independent corroborations.",
  },
  {
    label: "Weak",
    className: "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
    description:
      "Single uncorroborated accounts, anonymous claims, screenshots without archive links, secondhand summaries.",
  },
  {
    label: "Poor",
    className: "bg-disagree/15 text-disagree border-disagree/30",
    description:
      "Unsourced assertions, rumors, content from known fabrication accounts, or evidence that fails verification.",
  },
];

const requirements = [
  {
    title: "Every claim needs evidence",
    body: "Barks and accountability cases must attach at least one evidence item per factual claim. Opinion and analysis are welcome, but they must be clearly distinguishable from asserted fact.",
  },
  {
    title: "Original context required",
    body: "Quotes and clips must link to or archive the full original source so readers can check context. Clips edited to change meaning violate the community guidelines.",
  },
  {
    title: "Screenshots must be verifiable",
    body: "Screenshots should include a link to the live or archived original. Unverifiable screenshots are marked as such and weigh less in the evidence rating.",
  },
  {
    title: "Corrections are versioned, not hidden",
    body: "When evidence is retracted or corrected, authors update the bark or case; the version history keeps the record transparent. Silent deletion of refuted claims is a violation.",
  },
  {
    title: "Community verification",
    body: "Evidence items can be reviewed by other users and moderators. Verified items get the verified mark; disputed items are flagged inline so readers see the dispute where it matters.",
  },
];

export default function EvidenceStandardsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="space-y-3">
        <Link
          href="/policies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> All policies
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Evidence Standards</h1>
        <p className="text-muted-foreground">
          Evidence ratings on barks and cases are computed from the quality,
          independence, and verifiability of attached sources. Here is what each
          tier means and what the platform requires.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Evidence tiers</CardTitle>
          <CardDescription>
            The rating shown next to every bark and case.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tiers.map((t, i) => (
            <div key={t.label}>
              {i > 0 && <Separator className="mb-4" />}
              <div className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
                <Badge variant="outline" className={`${t.className} shrink-0`}>
                  {t.label}
                </Badge>
                <p className="text-sm text-muted-foreground">{t.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {requirements.map((r, i) => (
          <Card key={r.title}>
            <CardHeader>
              <CardTitle className="text-base">
                {i + 1}. {r.title}
              </CardTitle>
              <CardDescription className="pt-1 leading-relaxed">
                {r.body}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
