import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Flag, MailQuestion, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Enforcement & Appeals",
};

const ladder = [
  {
    step: "Dismiss",
    className: "bg-muted text-muted-foreground border-border",
    description:
      "The report doesn't show a violation. The reporter is notified with a short explanation; the content stays up.",
  },
  {
    step: "Warn",
    className: "bg-verified/15 text-verified border-verified/30",
    description:
      "First or minor violation. The author receives a warning citing the specific guideline; the content may be edited or removed.",
  },
  {
    step: "Remove",
    className: "bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed",
    description:
      "The content is taken down. A public placeholder notes it was removed for a guideline violation, preserving thread integrity.",
  },
  {
    step: "Restrict",
    className: "bg-unpack/15 text-unpack border-unpack/30",
    description:
      "Repeated or serious violations. The account temporarily loses posting, replying, or case-opening privileges.",
  },
  {
    step: "Ban",
    className: "bg-disagree/15 text-disagree border-disagree/30",
    description:
      "Severe or persistent abuse — hate speech, fabricated evidence, doxxing, ban evasion. The account is permanently removed.",
  },
];

const process = [
  {
    icon: Flag,
    title: "1. Report is filed",
    body: "Any user can report reactions, replies, cases, profiles, or messages via the flag in the content menu. Reports are private — the reported party never sees who filed.",
  },
  {
    icon: Scale,
    title: "2. Moderation review",
    body: "Reports are triaged by severity. Racism, discrimination, doxxing, and fabricated evidence are prioritized. Moderators review the content against the specific guideline cited, with full context.",
  },
  {
    icon: MailQuestion,
    title: "3. Outcome and notification",
    body: "Both the reporter and the content author are notified of the outcome. Enforcement actions cite the exact guideline violated and are logged in the moderation record.",
  },
];

export default function EnforcementPage() {
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
          Enforcement & Appeals
        </h1>
        <p className="text-muted-foreground">
          What happens after you report content, and how decisions can be
          challenged.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {process.map((p) => {
          const Icon = p.icon;
          return (
            <Card key={p.title}>
              <CardHeader>
                <span className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-4.5 text-primary" aria-hidden />
                </span>
                <CardTitle className="text-sm">{p.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {p.body}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>The enforcement ladder</CardTitle>
          <CardDescription>
            Consequences scale with severity and repetition. Severe violations
            skip straight to the top of the ladder.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {ladder.map((l) => (
            <div
              key={l.step}
              className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4"
            >
              <Badge
                variant="outline"
                className={`${l.className} w-20 shrink-0 justify-center`}
              >
                {l.step}
              </Badge>
              <p className="text-sm text-muted-foreground">{l.description}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appeals</CardTitle>
          <CardDescription className="leading-relaxed">
            Every enforcement action can be appealed once, within 30 days, from
            the notification you receive. Appeals are reviewed by a moderator
            who was not involved in the original decision. If new evidence shows
            the decision was wrong, the action is reversed and expunged from
            your record. Accountability case removals can additionally be
            appealed with new evidence at any time — the version history keeps
            the full trail.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
