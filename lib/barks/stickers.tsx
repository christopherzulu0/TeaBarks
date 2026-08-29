import type { ComponentType, SVGProps } from "react";

export const BARK_STICKER_IDS = [
  "tea",
  "bark",
  "evidence",
  "agree",
  "disagree",
  "mixed",
  "unpack",
  "verified",
  "casefile",
  "clap",
] as const;

export type BarkStickerId = (typeof BARK_STICKER_IDS)[number];

const svgProps = {
  viewBox: "0 0 64 64",
  "aria-hidden": true as const,
};

function TeaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#c45c26" />
      <path
        d="M18 28h22a6 6 0 0 1 6 6v6a10 10 0 0 1-10 10H22A10 10 0 0 1 12 40v-6a6 6 0 0 1 6-6Z"
        fill="#f4e6d4"
      />
      <path d="M46 32h4a6 6 0 0 1 0 12h-2" fill="none" stroke="#f4e6d4" strokeWidth="3" />
      <path d="M24 16c2 4 0 7 0 7M30 14c2 5-1 9-1 9M36 16c1 4-1 7-1 7" stroke="#f4e6d4" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BarkIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#3f2a1d" />
      <ellipse cx="32" cy="36" rx="16" ry="12" fill="#d4a574" />
      <circle cx="26" cy="34" r="2" fill="#3f2a1d" />
      <circle cx="38" cy="34" r="2" fill="#3f2a1d" />
      <path d="M26 42c4 3 8 3 12 0" fill="none" stroke="#3f2a1d" strokeWidth="2" />
    </svg>
  );
}

function EvidenceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#2563eb" />
      <rect x="18" y="16" width="22" height="28" rx="2" fill="#eff6ff" />
      <path d="M24 24h10M24 30h10M24 36h7" stroke="#2563eb" strokeWidth="2" />
      <circle cx="42" cy="42" r="8" fill="#fbbf24" />
      <path d="M42 38v6l4 2" fill="none" stroke="#78350f" strokeWidth="2" />
    </svg>
  );
}

function AgreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#E44A0A" />
      <path d="M18 34l8 8 20-22" fill="none" stroke="#fff7ed" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function DisagreeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#b91c1c" />
      <path d="M22 22l20 20M42 22L22 42" fill="none" stroke="#fef2f2" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function MixedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#ca8a04" />
      <path d="M18 32h28M32 18v28" fill="none" stroke="#fefce8" strokeWidth="4" />
      <circle cx="32" cy="32" r="10" fill="none" stroke="#fefce8" strokeWidth="3" />
    </svg>
  );
}

function UnpackIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#7c3aed" />
      <rect x="18" y="22" width="28" height="22" rx="3" fill="#ede9fe" />
      <path d="M18 28h28M32 22v22" stroke="#7c3aed" strokeWidth="2" />
    </svg>
  );
}

function VerifiedIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#c2410c" />
      <path d="M32 14l5 8 9 1-7 7 2 9-9-5-9 5 2-9-7-7 9-1z" fill="#ffedd5" />
      <path d="M26 32l4 4 8-10" fill="none" stroke="#c2410c" strokeWidth="2.5" />
    </svg>
  );
}

function CasefileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#1e3a5f" />
      <path d="M16 24h12l4 4h16v22H16z" fill="#e2e8f0" />
      <path d="M22 36h20M22 42h14" stroke="#1e3a5f" strokeWidth="2" />
    </svg>
  );
}

function ClapIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...svgProps} {...props}>
      <circle cx="32" cy="32" r="30" fill="#db2777" />
      <path d="M24 38c0-8 4-16 8-16s4 4 4 8 4-2 6 2 0 14-8 16c-8 0-10-4-10-10z" fill="#fce7f3" />
      <path d="M42 22l4-6M46 28l6-2M44 34l6 2" stroke="#fce7f3" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const icons: Record<BarkStickerId, ComponentType<SVGProps<SVGSVGElement>>> = {
  tea: TeaIcon,
  bark: BarkIcon,
  evidence: EvidenceIcon,
  agree: AgreeIcon,
  disagree: DisagreeIcon,
  mixed: MixedIcon,
  unpack: UnpackIcon,
  verified: VerifiedIcon,
  casefile: CasefileIcon,
  clap: ClapIcon,
};

export const barkStickers: {
  id: BarkStickerId;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { id: "tea", label: "Tea", Icon: TeaIcon },
  { id: "bark", label: "Reaction", Icon: BarkIcon },
  { id: "evidence", label: "Evidence", Icon: EvidenceIcon },
  { id: "agree", label: "Agree", Icon: AgreeIcon },
  { id: "disagree", label: "Disagree", Icon: DisagreeIcon },
  { id: "mixed", label: "Mixed", Icon: MixedIcon },
  { id: "unpack", label: "Unpack", Icon: UnpackIcon },
  { id: "verified", label: "Verified", Icon: VerifiedIcon },
  { id: "casefile", label: "Case file", Icon: CasefileIcon },
  { id: "clap", label: "Clap", Icon: ClapIcon },
];

export function BarkSticker({
  id,
  className,
}: {
  id: BarkStickerId;
  className?: string;
}) {
  const Icon = icons[id];
  if (!Icon) return null;
  return <Icon className={className} />;
}

export function isBarkStickerId(value: string): value is BarkStickerId {
  return (BARK_STICKER_IDS as readonly string[]).includes(value);
}
