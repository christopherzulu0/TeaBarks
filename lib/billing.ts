export const FEATURES = {
  createBark: "create_bark",
  writerDashboard: "writer_dashboard",
} as const;

export type BillingFeature = (typeof FEATURES)[keyof typeof FEATURES];

/** Paid Clerk plan slugs that unlock both billing features in this app. */
export const PAID_USER_PLANS = ["writer", "pro"] as const;
export const PAID_ORG_PLANS = ["team", "newsroom", "enterprise"] as const;

type FeatureCheck = ((params: object) => boolean) | undefined | null;

type SessionClaims = {
  fea?: unknown;
  pla?: unknown;
  features?: unknown;
  [key: string]: unknown;
} | null;

function callHas(has: FeatureCheck, params: object): boolean {
  if (typeof has !== "function") return false;
  try {
    return Boolean(has(params));
  } catch {
    return false;
  }
}

function scopedSlugs(raw: unknown): { user: Set<string>; org: Set<string>; all: Set<string> } {
  const user = new Set<string>();
  const org = new Set<string>();
  const all = new Set<string>();

  const add = (scope: "u" | "o" | "any", slug: string) => {
    const value = slug.trim();
    if (!value) return;
    all.add(value);
    if (scope === "u") user.add(value);
    else if (scope === "o") org.add(value);
    else {
      user.add(value);
      org.add(value);
    }
  };

  const walk = (value: unknown, inherited: "u" | "o" | "any" = "any") => {
    if (typeof value === "string") {
      for (const part of value.split(/[,;]+/)) {
        const trimmed = part.trim();
        if (!trimmed) continue;
        if (trimmed.startsWith("u:")) add("u", trimmed.slice(2));
        else if (trimmed.startsWith("o:")) add("o", trimmed.slice(2));
        else add(inherited, trimmed);
      }
      return;
    }
    if (Array.isArray(value)) {
      for (const item of value) walk(item, inherited);
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, nested] of Object.entries(value)) {
        if (nested === true) add("any", key);
        else walk(nested, inherited);
      }
    }
  };

  walk(raw);
  return { user, org, all };
}

const FREE_PLAN_SLUGS = new Set([
  "free",
  "free_user",
  "free_org",
  "free-user",
  "free-org",
]);

function isPaidPlanSlug(slug: string): boolean {
  const normalized = slug.replace(/^org:/, "").trim().toLowerCase();
  return normalized.length > 0 && !FREE_PLAN_SLUGS.has(normalized);
}

function paidPlanGrantsFeatures(plans: Set<string>): boolean {
  for (const plan of plans) {
    if (isPaidPlanSlug(plan)) return true;
  }
  return false;
}

function entitlementsFromClaims(claims: SessionClaims | undefined) {
  if (!claims) {
    return { features: new Set<string>(), paid: false };
  }
  const features = new Set<string>([
    ...scopedSlugs(claims.fea).all,
    ...scopedSlugs(claims.features).all,
  ]);
  const plans = new Set<string>([
    ...scopedSlugs(claims.pla).all,
    ...scopedSlugs(claims.plan).all,
    ...scopedSlugs(claims.plans).all,
  ]);
  return { features, paid: paidPlanGrantsFeatures(plans) };
}

export function canUseFeature(
  has: FeatureCheck,
  opts: {
    orgId: string | null | undefined;
    feature: string;
    sessionClaims?: SessionClaims;
  }
): boolean {
  if (callHas(has, { feature: opts.feature })) return true;
  if (callHas(has, { feature: `u:${opts.feature}` })) return true;
  if (callHas(has, { feature: `o:${opts.feature}` })) return true;
  if (opts.orgId && callHas(has, { role: "org:admin" })) return true;

  for (const plan of PAID_USER_PLANS) {
    if (callHas(has, { plan })) return true;
    if (callHas(has, { plan: `u:${plan}` })) return true;
  }
  for (const plan of PAID_ORG_PLANS) {
    if (callHas(has, { plan })) return true;
    if (callHas(has, { plan: `org:${plan}` })) return true;
    if (callHas(has, { plan: `o:${plan}` })) return true;
  }

  const fromClaims = entitlementsFromClaims(opts.sessionClaims);
  if (fromClaims.features.has(opts.feature)) return true;
  if (fromClaims.paid) return true;

  return false;
}

/** Keep signed-out users on the original route (sign-in). Paid users stay; others go to pricing. */
export function featureHref(
  has: FeatureCheck,
  opts: {
    isLoaded?: boolean;
    isSignedIn: boolean | undefined;
    orgId: string | null | undefined;
    feature: string;
    href: string;
    fallback?: string;
    sessionClaims?: SessionClaims;
  }
): string {
  if (!opts.isLoaded || !opts.isSignedIn) return opts.href;
  return canUseFeature(has, opts) ? opts.href : (opts.fallback ?? "/pricing");
}

export function billingFeatureLabel(feature: string) {
  return feature.replaceAll("_", " ");
}
