# Clerk billing setup for TeaBarks

Configure this in the **Clerk Dashboard**, not in git. The app never reads plan names. It only checks **feature slugs** and **permission slugs**. Those strings must match the code exactly.

Use the **development** instance that matches `.env.local` first. Repeat the same plans on production later (and connect Stripe there).

**Dashboard:** [Billing → Settings](https://dashboard.clerk.com/last-active?path=billing/settings) · [Billing → Plans](https://dashboard.clerk.com/last-active?path=billing/plans) · [Organization roles](https://dashboard.clerk.com/last-active?path=organizations-settings/roles) · [JWT templates](https://dashboard.clerk.com/last-active?path=jwt-templates)

---

## Mental model

| You create in Clerk | Slug examples | What the app does with it |
|---|---|---|
| **User plan** | `writer`, `pro` | Shown on `/pricing` (default `<PricingTable />`). |
| **Organization plan** | `team`, `newsroom` | Shown on `/pricing` (`<PricingTable for="organization" />`) and in org billing on `/org`. |
| **Billing feature** | `create_bark`, `writer_dashboard` | `has({ feature: "…" })` in the UI. Same slugs must appear on the Convex JWT (`fea` / `features`). |
| **Org permission** | `org:cases:open` | `has({ permission: "…" })`. Assigned to **roles**, not to plans. |

Who is gated:

- **Signed out:** prompted to sign in for paid actions.
- **Personal Free** (`free_user`, no active org): **read-only** for paid actions. Cannot create barks, open the writer dashboard, or enter contests. Can still open cases (cases are role-based, not a billing slug).
- **Personal Writer / Pro:** allowed for `create_bark` and `writer_dashboard`.
- **Org member** on Free: blocked unless they are `org:admin`.
- **Org member** on a paid plan that includes the feature: allowed.
- **Org admin** (`org:admin`): always allowed through feature and permission gates.

---

## What the code actually gates

These are the only billing features and custom permissions in the repo. Do not invent extra slugs unless you change the code.

### Billing features (`FeatureGate` / `has({ feature })` / Convex `requireBillingFeature`)

| Slug (exact) | Dashboard name | Unlocks |
|---|---|---|
| `create_bark` | Create Bark | `/create` (publish a bark). Nav, home, profile, and creator CTAs. Convex `barks.create`. |
| `writer_dashboard` | Writer dashboard | `/stories/dashboard`, `/stories/write/[slug]`, new-story dialog, contest entry. Convex `stories.create` and `contests.enter`. |

### Custom org permissions (`PermissionGate` / `has({ permission })`)

Create these under **Configure → Organization → Roles**. They are **not** plan slugs. Personal accounts skip these checks (`!orgId` still passes).

| Slug (exact) | Unlocks |
|---|---|
| `org:barks:publish` | Reserved for org roles. Create Bark is gated by the `create_bark` **feature** (or `org:admin`), not this permission. |
| `org:cases:open` | `/cases/new` (open a case). “Open case” buttons on `/cases`, creator profiles, and the user profile. Personal accounts can still open cases. |
| `org:reports:manage` | Review action on `/admin` reports. |

### Clerk system permissions (do not recreate)

These ship with Clerk. Admins already have them. Used only to **hide** org-admin UI, not to sell a plan:

| Slug | Where |
|---|---|
| `org:sys_profile:manage` | Organization profile editor on `/org` |
| `org:sys_billing:manage` | Billing / pricing link on `/org` and org settings |
| `org:sys_memberships:manage` | Team copy on `/settings/organization` |
| `org:sys_domains:manage` | Verified domains card on `/settings/organization` |

### Always available (no plan, no permission)

Do **not** add billing features for these. They are ungated:

Home, Explore, Search, Topics, Countries, Barks feed, Cases list (read), Stories read, Creators, Apply as creator, Writer **apply**, Profile, Settings, Messages, Notifications, `/org` dashboard stats.

---

## 1. Enable billing

1. Open [Billing → Settings](https://dashboard.clerk.com/last-active?path=billing/settings) on the **development** instance.
2. Enable billing. Clerk creates `free_user` and `free_org`. Keep them as free tiers.
3. Dev can use Clerk’s test payment gateway (no Stripe). Production later needs Stripe connected.
4. If people should subscribe personally **and** via an org: [Organizations](https://dashboard.clerk.com/last-active?path=organizations-settings) → **Membership optional**.

---

## 2. Create the two billing features

Features live **on a plan**, not on a global Features page: **Plans → open a paid plan → Features**.

Create each slug once, then attach it to every paid plan below.

| Feature slug | Name | Description (paste in Clerk) |
|---|---|---|
| `create_bark` | Create Bark | Publish barks from `/create`. Required unless the caller is `org:admin`. |
| `writer_dashboard` | Writer dashboard | Writer studio at `/stories/dashboard` and entering writing contests. |

Slugs: lowercase, **underscores**. `writer-dashboard` will not match the code.

When billing is on, Clerk can also refuse a **permission** if the org plan does not include a related feature. Attach **both** features to every paid org plan that should publish or write.

---

## 3. User plans (B2C) — tab: **User Plans**

These are the first table on `/pricing`. Amounts are **cents**.

### Free — slug `free_user` (Clerk default)

- Price: $0
- Billing features to attach: **none**
- Product:
  - Read the whole public site
  - Apply as a creator or writer
  - Open cases (personal account)
  - **Cannot** create barks, use the writer dashboard, or enter contests

### Writer — slug `writer`

- Price: $9 / month (`900`)
- Interval: month
- Billing features to attach: `create_bark`, `writer_dashboard`
- Product:
  - Create and publish barks (`/create`)
  - Writer dashboard: drafts, chapters, covers, story settings
  - Enter writing contests
  - Everything on Free

### Pro — slug `pro`

- Price: $19 / month (`1900`)
- Interval: month
- Billing features to attach: `create_bark`, `writer_dashboard` (same two slugs — the app does not check `pro` vs `writer`)
- Product: same entitlements as Writer. Use Pro for a higher price / positioning only, until you add more `has({ feature })` checks.

Optional: duplicate Writer/Pro as yearly (`is_recurring` yearly).

---

## 4. Organization plans (B2B) — tab: **Organization Plans**

Wrong tab is why an org pricing table looks empty. Plan type cannot be changed after create. Seat cap is set at create time.

`/pricing` renders a second `<PricingTable for="organization" />` for Team / Newsroom / Enterprise.

### Free — slug `free_org` (Clerk default)

- Price: $0
- Seats: 5 (or Clerk default)
- Billing features: **none**
- Product:
  - Org workspace (`/org`): live stats, activity, team list
  - Read public content
  - **Admins** can still create barks, write, open cases (role bypass)
  - **Members** cannot create barks, use the writer dashboard, enter contests, or open cases

### Team — slug `team`

- Price: $29 / month (`2900`)
- Seats: 10
- Billing features: `create_bark`, `writer_dashboard`
- Product for members (plus role permissions below):
  - Create and publish barks
  - Writer dashboard and contest entry
  - Open accountability cases if their role has `org:cases:open`
  - Org workspace, members, billing UI per Clerk system roles

### Newsroom — slug `newsroom`

- Price: $79 / month (`7900`)
- Seats: 25
- Billing features: `create_bark`, `writer_dashboard`
- Product: same capabilities as Team; more seats.

### Enterprise — slug `enterprise`

- Price: custom or $199 / month (`19900`)
- Seats: unlimited
- Billing features: `create_bark`, `writer_dashboard`
- Product: Same capabilities as Newsroom and no seat cap.

There is no separate billing slug for cases, reports, or SSO. Cases and report review are **role permissions**. SSO is Clerk org domains, not a TeaBarks plan feature.

---

## 5. Roles and permissions

**Configure → Organization → Roles.** Suggested custom roles:

| Role key | Display name | Permissions to grant |
|---|---|---|
| `org:admin` | Admin | Built-in. Bypasses feature and permission gates. Full org profile, billing, members, domains. |
| `org:editor` | Editor | `org:barks:publish`, `org:cases:open`, `org:reports:manage` |
| `org:member` | Member | none of the custom permissions |

On a **paid** org plan, a member still needs `create_bark` / `writer_dashboard` on the plan to use those surfaces (unless they are admin).

On a **Free** org plan, only admins get through, even if a custom role has permissions (Clerk billing can gate permissions when the plan has no features).

---

## 6. Convex JWT template (`convex`)

UI gates read Clerk `has()` from the **session** token. Convex mutations use a **separate** JWT from the template named **`convex`**. `barks.create`, `stories.create`, and `contests.enter` call `requireBillingFeature`:

- Allow if `org_role` is `org:admin` (or `admin`) **and** `org_id` is present.
- Else require the feature slug on the token (`fea`, `features`, or `feature`). Clerk encodes features like `u:create_bark,o:writer_dashboard`.

Without those claims, **every non-admin caller is denied**, including paid Writer/Pro users.

**Configure → JWT templates → `convex`.** Keep `aud: convex`. Add claims the mutations can read, for example:

```json
{
  "aud": "convex",
  "org_id": "{{org.id}}",
  "org_role": "{{org.role}}",
  "fea": "{{user.public_metadata.fea}}"
}
```

Clerk session tokens already include a default `fea` claim, but **custom JWT templates do not copy `sid` / `pla` / `fea` automatically**. If Clerk will not let you set `fea` on the template, put the same feature list on another claim named `features` (string or array of slugs). After changing the template, sign out and back in so Convex gets a new token.

Also confirm `org_id` / `org_role` are on this template; otherwise org-admin bypass will not work in Convex.

---

## 7. Click path (create one paid plan)

Example: **Team** (organization).

1. Billing → Plans → **Organization Plans** → Create plan.
2. Name `Team`, slug `team`, amount `2900`, currency USD, monthly, seats `10`.
3. Open the plan → Features → add `create_bark` and `writer_dashboard` (create the features if they do not exist yet).
4. Repeat for Newsroom / Enterprise / Writer / Pro, attaching the **same two** features every time.

---

## 8. Checklist

- [ ] Billing enabled on the development instance
- [ ] User plans: `free_user` + `writer` + `pro`, both paid plans have `create_bark` and `writer_dashboard`
- [ ] Org plans: `free_org` + `team` (+ newsroom/enterprise as needed), paid plans have the same two features
- [ ] Custom permissions `org:barks:publish`, `org:cases:open`, `org:reports:manage` exist and are on Editor (or equivalent)
- [ ] JWT template `convex` includes `org_id`, `org_role`, and billing features (`fea` or `features`)
- [ ] `/pricing` shows personal Writer/Pro **and** organization Team/Newsroom/Enterprise
- [ ] Personal Free user is sent to `/pricing` (or sees “paid plan”) on Create / writer dashboard / contest enter
- [ ] Personal Writer/Pro can open `/create` and `/stories/dashboard` and enter a contest
- [ ] Org member on **Team** can open `/create` and `/stories/dashboard` and enter a contest
- [ ] Org member on **Free** (not admin) is sent to `/pricing` or sees “paid plan”
- [ ] Personal account can still open `/cases/new`; org member needs `org:cases:open` on a paid plan
- [ ] Repeat on the production Clerk instance and connect Stripe before taking money

---

## Common mistakes

- Putting `team` under **User** plans — org checkout will not see it.
- Feature slug `writer-dashboard` — code expects `writer_dashboard`.
- Empty `/pricing` — billing off, or no plans in the matching tab (User vs Organization).
- Convex JWT template `convex` missing `fea` / `features` — paid users pass the UI and fail on publish/create/enter.
- Adding features for Explore, Messages, Topics, or writer apply — those are not gated.
- Assuming Writer and Pro unlock different app features — they currently attach the same two slugs.
- Treating personal Free as able to publish — it is read-only for `create_bark` and `writer_dashboard`.
- Subscribing to Writer/Pro while an organization is selected, then expecting `has({ feature })` alone to pass — Clerk checks the **active org** plan. The app also reads session `pla` / `fea` (including `u:` user plans) and paid plan slugs so a personal subscription still unlocks create/write.
- Attaching no features to a paid plan — `has({ feature: "create_bark" })` stays false; paid plan slugs (`writer`, `pro`, `team`, …) still unlock in this app.
