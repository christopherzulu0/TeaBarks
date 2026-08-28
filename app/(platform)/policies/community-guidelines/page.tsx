import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Community Guidelines",
};

type Severity = "severe" | "high" | "moderate";

const severityBadge: Record<Severity, { label: string; className: string }> = {
  severe: {
    label: "Severe — removal + account action",
    className: "bg-disagree/15 text-disagree border-disagree/30",
  },
  high: {
    label: "High — removal, repeat leads to restriction",
    className: "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
  },
  moderate: {
    label: "Moderate — removal or warning",
    className: "bg-muted text-muted-foreground border-border",
  },
};

const rules: {
  title: string;
  severity: Severity;
  body: string;
  examples: string[];
}[] = [
  {
    title: "Hate speech and racism",
    severity: "severe",
    body: "Content that attacks, demeans, or dehumanizes people based on race, ethnicity, or national origin is prohibited. This applies to slurs, racist stereotypes, coded language, and 'jokes' that rely on racial denigration. Documenting racist statements by a public figure as evidence in a bark or case is allowed; endorsing or repeating them as your own speech is not.",
    examples: [
      "Slurs or epithets targeting a racial or ethnic group",
      "Claims that a race or ethnicity is inherently inferior or dangerous",
      "Dog-whistles and coded racist language used approvingly",
    ],
  },
  {
    title: "Discrimination",
    severity: "severe",
    body: "Advocating for the exclusion, denial of rights, or unequal treatment of people based on religion, gender, sexual orientation, nationality, disability, or age is prohibited — even where such speech is legal. Critique of ideas, institutions, and public conduct is welcome; attacks on people for who they are is not.",
    examples: [
      "Calling for a group to be denied services, jobs, or participation",
      "Content demeaning people for a disability or their gender",
      "Religious intolerance framed as 'just asking questions'",
    ],
  },
  {
    title: "Harassment and personal attacks",
    severity: "high",
    body: "Debate the argument, not the person. Sustained insults, name-calling, pile-ons, sexual harassment, and threats are prohibited. Strong disagreement — including blunt criticism of a creator's public claims — is exactly what TeaBarks is for, but it must target the content, evidence, and reasoning.",
    examples: [
      "Insulting a user instead of addressing their evidence",
      "Coordinated pile-ons against an individual",
      "Unwanted sexualized comments",
    ],
  },
  {
    title: "Doxxing and privacy violations",
    severity: "severe",
    body: "Publishing private information — home addresses, phone numbers, private accounts, non-public workplace details — is prohibited, including in evidence attachments. Accountability covers public conduct only.",
    examples: [
      "Posting a creator's home address in a case timeline",
      "Sharing screenshots of private conversations without consent",
    ],
  },
  {
    title: "Fabricated or manipulated evidence",
    severity: "severe",
    body: "TeaBarks runs on evidence, so forging it is among the most serious violations. Doctored screenshots, selectively edited clips that reverse meaning, fake documents, and AI-generated 'proof' presented as real all qualify.",
    examples: [
      "Edited screenshots presented as authentic",
      "Clips cut to invert what a speaker actually said",
      "Fake documents attributed to a creator or organization",
    ],
  },
  {
    title: "Misinformation presented as fact",
    severity: "high",
    body: "Asserting demonstrably false claims as established fact — especially in barks and cases — violates our standards. Honest mistakes corrected via the version history are fine; repeated or willful misinformation is not.",
    examples: [
      "Citing retracted studies as current science without disclosure",
      "Repeating debunked claims after correction",
    ],
  },
  {
    title: "Spam and platform manipulation",
    severity: "moderate",
    body: "Repetitive low-effort barks, engagement farming, vote manipulation, and coordinated inauthentic behavior are prohibited.",
    examples: [
      "Mass-posting near-identical barks",
      "Networks of accounts boosting the same content",
    ],
  },
  {
    title: "Impersonation",
    severity: "high",
    body: "Pretending to be another person, creator, or organization is prohibited. Parody must be clearly labeled. Creator verification exists precisely so official responses can be trusted.",
    examples: [
      "Accounts posing as a verified creator to issue fake responses",
      "Unlabeled parody of an organization",
    ],
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10">
      <div className="space-y-3">
        <Link
          href="/policies"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" aria-hidden /> All policies
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">
          Community Guidelines
        </h1>
        <p className="text-muted-foreground">
          These rules are stricter than the law. Content doesn&apos;t need to be
          illegal to be removed — it needs to be incompatible with evidence-based,
          good-faith discussion. Every rule below is a valid reason to{" "}
          <span className="inline-flex items-center gap-1 font-medium text-foreground">
            <Flag className="size-3.5" aria-hidden /> report
          </span>{" "}
          content anywhere on the platform.
        </p>
      </div>

      <div className="space-y-4">
        {rules.map((rule, i) => (
          <Card key={rule.title} id={rule.title.toLowerCase().replace(/[^a-z]+/g, "-")}>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {i + 1}. {rule.title}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={severityBadge[rule.severity].className}
                >
                  {severityBadge[rule.severity].label}
                </Badge>
              </div>
              <CardDescription className="pt-1 text-sm leading-relaxed">
                {rule.body}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Examples
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {rule.examples.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-muted/40">
        <CardContent className="space-y-1.5 text-sm">
          <p className="font-medium">Reporting vs. opening a case</p>
          <p className="text-muted-foreground">
            Use <span className="font-medium text-foreground">Report</span> (the
            flag in any content menu) to privately alert moderators to a
            guideline violation. Open an{" "}
            <Link href="/cases/new" className="text-primary underline underline-offset-4">
              Accountability Case
            </Link>{" "}
            when a creator&apos;s public conduct — like a pattern of
            discriminatory statements — deserves documented, evidence-backed
            public scrutiny. Cases require evidence for every claim and give the
            creator a right of response.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
