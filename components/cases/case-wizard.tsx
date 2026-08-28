"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useQuery } from "convex/react";
import { publishCase } from "@/app/actions/cases";
import { caseKeys } from "@/lib/cases/query";
import { api } from "@/convex/_generated/api";
import { toUiCreator } from "@/lib/creators/query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Link2,
  Plus,
  Scale,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { CaseCode } from "@/components/case-code";
import { PersonAvatar } from "@/components/person-avatar";
import { VerifiedBadge } from "@/components/verified-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { formatNumber } from "@/lib/format";
import { caseCategoryMeta, caseStatusMeta } from "@/lib/meta";
import type { CaseCategory, Creator, EvidenceType } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Creator", "Category", "Claims", "Review"] as const;

const categoryGroups: Record<string, CaseCategory[]> = {
  Conduct: ["racism", "discrimination", "harassment"],
  Integrity: ["misinformation", "fabricated-content", "undisclosed-sponsorship"],
  Behavior: ["scam", "plagiarism"],
};

interface DraftClaim {
  id: string;
  text: string;
  evidence: { title: string; url: string; type: EvidenceType }[];
}

function Stepper({ step }: { step: number }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
                i < step
                  ? "border-primary bg-primary text-primary-foreground"
                  : i === step
                    ? "border-primary text-primary"
                    : "border-border text-muted-foreground"
              )}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="size-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-[11px] font-medium sm:block",
                i === step ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
      <Progress
        value={((step + 1) / STEPS.length) * 100}
        aria-label={`Step ${step + 1} of ${STEPS.length}`}
      />
    </div>
  );
}

export function CaseWizard({
  initialCreators,
}: {
  initialCreators: Creator[];
}) {
  const searchParams = useSearchParams();
  const docs = useQuery(api.creators.listApproved);
  const creators = docs ? docs.map(toUiCreator) : initialCreators;
  const [step, setStep] = React.useState(0);
  const [query, setQuery] = React.useState("");
  const [creator, setCreator] = React.useState<Creator | null>(null);
  const [category, setCategory] = React.useState<CaseCategory | null>(null);
  const [title, setTitle] = React.useState("");
  const [claims, setClaims] = React.useState<DraftClaim[]>([]);
  const [claimText, setClaimText] = React.useState("");
  const [evTitle, setEvTitle] = React.useState("");
  const [evUrl, setEvUrl] = React.useState("");
  const [evType, setEvType] = React.useState<EvidenceType>("link");
  const [activeClaim, setActiveClaim] = React.useState<string | null>(null);
  const [submittedCode, setSubmittedCode] = React.useState<string | null>(null);
  const queryClient = useQueryClient();
  const publishMutation = useMutation({
    mutationFn: publishCase,
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: caseKeys.list });
      setSubmittedCode(result.code);
      toast.success(`Case ${result.code} submitted for review`, {
        description:
          "Moderators will verify the evidence before the case becomes public. The creator will be notified and can respond.",
      });
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Could not submit case");
    },
  });

  React.useEffect(() => {
    const handle = searchParams.get("creator")?.replace(/^@/, "").toLowerCase();
    if (!handle) return;
    const match = creators.find((c) => c.handle.toLowerCase() === handle);
    if (match) {
      setCreator(match);
      setQuery(match.name);
    }
  }, [creators, searchParams]);

  const filtered = creators.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.handle.toLowerCase().includes(query.toLowerCase())
  );

  const addClaim = () => {
    if (!claimText.trim()) {
      toast.error("Write the claim first.");
      return;
    }
    const id = `claim-${Date.now()}`;
    setClaims((prev) => [...prev, { id, text: claimText.trim(), evidence: [] }]);
    setClaimText("");
    setActiveClaim(id);
  };

  const addEvidence = (claimId: string) => {
    if (!evTitle.trim()) {
      toast.error("Give the evidence a title.");
      return;
    }
    setClaims((prev) =>
      prev.map((c) =>
        c.id === claimId
          ? {
              ...c,
              evidence: [
                ...c.evidence,
                { title: evTitle.trim(), url: evUrl.trim(), type: evType },
              ],
            }
          : c
      )
    );
    setEvTitle("");
    setEvUrl("");
  };

  const unevidenced = claims.filter((c) => c.evidence.length === 0);

  const next = () => {
    if (step === 0 && !creator) {
      toast.error("Select the creator this case concerns.");
      return;
    }
    if (step === 1 && (!category || !title.trim())) {
      toast.error("Choose a category and give the case a title.");
      return;
    }
    if (step === 2) {
      if (claims.length === 0) {
        toast.error("Add at least one claim.");
        return;
      }
      if (unevidenced.length > 0) {
        toast.error("Every claim needs at least one evidence item.", {
          description: `${unevidenced.length} claim${unevidenced.length === 1 ? " is" : "s are"} missing evidence.`,
        });
        return;
      }
    }
    setStep((s) => s + 1);
  };

  const submit = () => {
    if (!creator || !category) {
      toast.error("Select a creator and category first.");
      return;
    }
    publishMutation.mutate({
      title,
      category,
      creatorId: creator.id,
      creatorName: creator.name,
      creatorHandle: creator.handle,
      creatorVerified: creator.verified,
      claims: claims.map((claim) => ({
        text: claim.text,
        evidence: claim.evidence.map((item) => ({
          type: item.type,
          title: item.title,
          url: item.url,
        })),
      })),
    });
  };

  if (submittedCode) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16">
        <Card>
          <CardHeader className="items-center text-center">
            <span className="mb-2 flex size-14 items-center justify-center rounded-full bg-mixed/20">
              <Scale className="size-7 text-mixed-foreground dark:text-mixed" aria-hidden />
            </span>
            <CardTitle className="flex flex-wrap items-center justify-center gap-2">
              Case <CaseCode code={submittedCode} size="md" /> is under review
            </CardTitle>
            <CardDescription className="leading-relaxed">
              Moderators verify every evidence item before a case is published.{" "}
              {creator?.name} has been notified and can post an Official
              Response. You&apos;ll be notified when the review completes —
              typically within 48 hours.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center gap-2">
            <Button asChild>
              <Link href={`/cases/${submittedCode}`}>View case</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cases">View all cases</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8 px-4 py-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">
          Open an Accountability Case
        </h1>
        <p className="text-sm text-muted-foreground">
          A public, evidence-based record of a creator&apos;s conduct. Cases are
          for documented patterns — racism, discrimination, misinformation,
          undisclosed sponsorships — not personal grievances.
        </p>
      </div>

      <Stepper step={step} />

      {step === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Who is this case about?</CardTitle>
            <CardDescription>
              Cases can only be opened against public creators and their public
              conduct.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search creators by name or handle…"
              aria-label="Search creators"
            />
            <div className="max-h-80 space-y-2 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCreator(c)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors",
                    creator?.id === c.id
                      ? "border-primary bg-accent/50"
                      : "hover:bg-muted/50"
                  )}
                >
                  <PersonAvatar id={c.id} name={c.name} className="size-9" />
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      {c.name}
                      {c.verified && <VerifiedBadge className="size-3.5" />}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      @{c.handle} · {formatNumber(c.followers)} followers
                    </span>
                  </span>
                  {creator?.id === c.id && (
                    <Check className="size-4 shrink-0 text-primary" aria-hidden />
                  )}
                </button>
              ))}
              {creators.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  No approved creators yet. Cases can only be opened against
                  creators after an admin approves their application.
                </p>
              ) : (
                filtered.length === 0 && (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    No creators match &ldquo;{query}&rdquo;.
                  </p>
                )
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>What kind of case is this?</CardTitle>
            <CardDescription>
              Each category maps to the policy or standard the conduct violates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {Object.entries(categoryGroups).map(([group, cats]) => (
              <div key={group} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {group}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {cats.map((cat) => {
                    const meta = caseCategoryMeta[cat];
                    const active = category === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCategory(cat)}
                        className={cn(
                          "rounded-lg border p-3 text-left transition-colors",
                          active
                            ? "border-primary bg-accent/50"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <p className="text-sm font-medium">{meta.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {meta.policy}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="case-title">Case title</Label>
              <Input
                id="case-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Neutral, factual summary — e.g. 'Pattern of discriminatory statements in livestreams, 2025–2026'"
              />
              <p className="text-xs text-muted-foreground">
                Use neutral wording. Accusatory titles are edited or rejected in
                review.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Claims</CardTitle>
              <CardDescription>
                State each claim precisely. Every claim must carry at least one
                evidence item, or the case cannot be submitted.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Textarea
                  value={claimText}
                  onChange={(e) => setClaimText(e.target.value)}
                  placeholder="e.g. In the March 12 livestream (14:32), the creator stated that…"
                  className="min-h-16 flex-1"
                  aria-label="New claim"
                />
              </div>
              <Button onClick={addClaim} size="sm" variant="outline">
                <Plus className="size-4" /> Add claim
              </Button>
            </CardContent>
          </Card>

          {claims.map((claim, i) => (
            <Card
              key={claim.id}
              className={cn(
                claim.evidence.length === 0 && "border-mixed/60"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <CardTitle className="text-sm leading-relaxed">
                    Claim {i + 1}: {claim.text}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label={`Remove claim ${i + 1}`}
                    onClick={() =>
                      setClaims((prev) => prev.filter((c) => c.id !== claim.id))
                    }
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
                {claim.evidence.length === 0 ? (
                  <Badge
                    variant="outline"
                    className="w-fit bg-mixed/20 text-mixed-foreground border-mixed/40 dark:text-mixed"
                  >
                    <ShieldAlert className="size-3" /> Evidence required
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="w-fit bg-agree/15 text-agree border-agree/30"
                  >
                    <Check className="size-3" /> {claim.evidence.length} evidence
                    item{claim.evidence.length === 1 ? "" : "s"}
                  </Badge>
                )}
              </CardHeader>
              <CardContent className="space-y-3">
                {claim.evidence.map((ev, j) => (
                  <div
                    key={`${claim.id}-ev-${j}`}
                    className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm"
                  >
                    {ev.type === "link" ? (
                      <Link2 className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    ) : (
                      <FileText className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />
                    )}
                    <span className="truncate">{ev.title}</span>
                    <Badge variant="secondary" className="ml-auto shrink-0 text-[10px] capitalize">
                      {ev.type}
                    </Badge>
                  </div>
                ))}
                {activeClaim === claim.id ? (
                  <div className="space-y-2 rounded-lg border p-3">
                    <div className="grid gap-2 sm:grid-cols-[1fr_1fr_130px]">
                      <Input
                        value={evTitle}
                        onChange={(e) => setEvTitle(e.target.value)}
                        placeholder="Evidence title"
                        aria-label="Evidence title"
                      />
                      <Input
                        value={evUrl}
                        onChange={(e) => setEvUrl(e.target.value)}
                        placeholder="URL / archive link"
                        aria-label="Evidence URL"
                      />
                      <Select
                        value={evType}
                        onValueChange={(v) => setEvType(v as EvidenceType)}
                      >
                        <SelectTrigger aria-label="Evidence type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="link">Link</SelectItem>
                          <SelectItem value="screenshot">Screenshot</SelectItem>
                          <SelectItem value="document">Document</SelectItem>
                          <SelectItem value="timestamp">Timestamp</SelectItem>
                          <SelectItem value="research">Research</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addEvidence(claim.id)}
                    >
                      <Plus className="size-3.5" /> Attach evidence
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => setActiveClaim(claim.id)}
                  >
                    <Plus className="size-3.5" /> Add evidence to this claim
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step === 3 && creator && category && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <CardTitle className="text-base">
                Case code assigned on submit
              </CardTitle>
              <Badge variant="outline" className={caseStatusMeta["under-review"].badgeClass}>
                {caseStatusMeta["under-review"].label}
              </Badge>
            </div>
            <CardDescription className="text-base font-medium text-foreground">
              {title}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <PersonAvatar id={creator.id} name={creator.name} className="size-9" />
              <div>
                <p className="flex items-center gap-1.5 text-sm font-medium">
                  {creator.name}
                  {creator.verified && <VerifiedBadge className="size-3.5" />}
                </p>
                <p className="text-xs text-muted-foreground">
                  {caseCategoryMeta[category].label} ·{" "}
                  {caseCategoryMeta[category].policy}
                </p>
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">
                {claims.length} claim{claims.length === 1 ? "" : "s"},{" "}
                {claims.reduce((n, c) => n + c.evidence.length, 0)} evidence items
              </p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {claims.map((c) => (
                  <li key={c.id}>{c.text}</li>
                ))}
              </ul>
            </div>
            <Separator />
            <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground">
              <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <div className="space-y-1">
                <p>
                  Cases publish only after moderators verify the evidence.{" "}
                  {creator.name} will be notified and can post an Official
                  Response that appears prominently on the case.
                </p>
                <p>
                  Unsubstantiated or bad-faith cases are dismissed, and filing
                  them violates the{" "}
                  <Link
                    href="/policies/community-guidelines"
                    className="text-primary underline underline-offset-4"
                  >
                    Community Guidelines
                  </Link>
                  .
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="size-4" /> Back
        </Button>
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Continue <ArrowRight className="size-4" />
          </Button>
        ) : (
          <Button
            onClick={submit}
            disabled={publishMutation.isPending}
          >
            <Scale className="size-4" />
            {publishMutation.isPending ? "Submitting…" : "Submit for review"}
          </Button>
        )}
      </div>
    </div>
  );
}
