import type {
  AccountabilityCase,
  Bark,
  Conversation,
  Creator,
  Evidence,
  Notification,
  Organization,
  Reply,
  Source,
  User,
} from "./types";

export { countries } from "./countries";
export { getTopic, topics } from "./topics";

/* ------------------------------------------------------------------ */
/* Users (Barkers)                                                     */
/* ------------------------------------------------------------------ */

export const users: User[] = [
  {
    id: "u-yassin",
    username: "yassinhaddad",
    name: "Yassin Haddad",
    bio: "Investigative writer. I follow the evidence wherever it leads. Covering media claims, tech policy, and public statements in MENA.",
    verified: true,
    country: "EG",
    followers: 12840,
    following: 312,
    barkCount: 47,
    evidenceScore: 94,
    joinedAt: "2024-03-11",
  },
  {
    id: "u-nadia",
    username: "nadiarahman",
    name: "Nadia Rahman",
    bio: "Media literacy researcher. PhD in communication studies. I unpack viral claims with primary sources.",
    verified: true,
    country: "EG",
    followers: 9210,
    following: 188,
    barkCount: 63,
    evidenceScore: 97,
    joinedAt: "2024-01-20",
  },
  {
    id: "u-tomas",
    username: "tomasvela",
    name: "Tomás Vela",
    bio: "Economics writer. Former central bank analyst. Charts over vibes.",
    verified: false,
    country: "ES",
    followers: 5470,
    following: 240,
    barkCount: 38,
    evidenceScore: 89,
    joinedAt: "2024-06-02",
  },
  {
    id: "u-amara",
    username: "amaraokafor",
    name: "Amara Okafor",
    bio: "Public health analyst. I read the studies so you don't have to — then I show you the studies anyway.",
    verified: true,
    country: "NG",
    followers: 15920,
    following: 95,
    barkCount: 71,
    evidenceScore: 96,
    joinedAt: "2023-11-15",
  },
  {
    id: "u-jae",
    username: "jaekim",
    name: "Jae Kim",
    bio: "Tech policy researcher. AI governance, platform regulation, digital rights.",
    verified: false,
    country: "KR",
    followers: 7130,
    following: 402,
    barkCount: 29,
    evidenceScore: 91,
    joinedAt: "2024-08-19",
  },
  {
    id: "u-lena",
    username: "lenameyer",
    name: "Lena Meyer",
    bio: "Climate scientist turned communicator. Citing IPCC chapters since before it was cool.",
    verified: true,
    country: "DE",
    followers: 11250,
    following: 156,
    barkCount: 54,
    evidenceScore: 95,
    joinedAt: "2023-09-30",
  },
  {
    id: "u-devon",
    username: "devoncarter",
    name: "Devon Carter",
    bio: "Sports analytics. Expected goals, actual receipts.",
    verified: false,
    country: "US",
    followers: 4380,
    following: 511,
    barkCount: 22,
    evidenceScore: 84,
    joinedAt: "2025-01-08",
  },
  {
    id: "u-priya",
    username: "priyasharma",
    name: "Priya Sharma",
    bio: "Education researcher. Testing claims about testing, and everything else in the classroom.",
    verified: false,
    country: "IN",
    followers: 6890,
    following: 233,
    barkCount: 41,
    evidenceScore: 92,
    joinedAt: "2024-04-25",
  },
];

export const currentUser = users[0];

/* ------------------------------------------------------------------ */
/* Creators                                                            */
/* ------------------------------------------------------------------ */

export const creators: Creator[] = [
  {
    id: "c-futuresight",
    handle: "futuresightlab",
    name: "FutureSight Lab",
    bio: "Exploring where technology is taking us. Weekly deep-dives on AI, robotics, and the next decade. 2.1M subscribers.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["youtube", "x"],
    officialLinks: [
      { label: "YouTube", url: "https://youtube.com/@futuresightlab" },
      { label: "Website", url: "https://futuresightlab.com" },
    ],
    followers: 48200,
    country: "US",
    topics: ["technology", "science"],
    totalSources: 34,
    totalBarksReceived: 412,
    responseRate: 68,
    joinedAt: "2024-05-14",
  },
  {
    id: "c-macrobrief",
    handle: "themacrobrief",
    name: "The Macro Brief",
    bio: "The economics podcast for people who read footnotes. Hosted by Dana Whitfield. New episodes every Tuesday.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["podcast", "youtube"],
    officialLinks: [
      { label: "Podcast", url: "https://themacrobrief.fm" },
      { label: "Newsletter", url: "https://themacrobrief.fm/newsletter" },
    ],
    followers: 31500,
    country: "GB",
    topics: ["business", "finance"],
    totalSources: 58,
    totalBarksReceived: 289,
    responseRate: 81,
    joinedAt: "2024-02-27",
  },
  {
    id: "c-drwu",
    handle: "drhelenwu",
    name: "Dr. Helen Wu",
    bio: "Physician and health educator. Making medical research accessible — sometimes controversially so.",
    verified: false,
    hasTeaBarksProfile: false,
    platforms: ["youtube", "instagram"],
    officialLinks: [{ label: "YouTube", url: "https://youtube.com/@drhelenwu" }],
    followers: 12700,
    country: "CA",
    topics: ["health", "science"],
    totalSources: 21,
    totalBarksReceived: 178,
    responseRate: 12,
    joinedAt: "2025-03-02",
  },
  {
    id: "c-dmitri",
    handle: "coachdmitri",
    name: "Coach Dmitri",
    bio: "Strength coach. 4.8M on TikTok. Big claims, bigger lifts.",
    verified: false,
    hasTeaBarksProfile: false,
    platforms: ["tiktok", "instagram"],
    officialLinks: [{ label: "TikTok", url: "https://tiktok.com/@coachdmitri" }],
    followers: 8900,
    country: "UA",
    topics: ["health", "sports"],
    totalSources: 15,
    totalBarksReceived: 203,
    responseRate: 4,
    joinedAt: "2025-06-18",
  },
  {
    id: "c-gpd",
    handle: "globalpolicydesk",
    name: "Global Policy Desk",
    bio: "Independent policy journalism. Long-form analysis of legislation, trade, and international affairs.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["article", "x"],
    officialLinks: [
      { label: "Website", url: "https://globalpolicydesk.org" },
    ],
    followers: 27300,
    country: "BE",
    topics: ["politics", "business"],
    totalSources: 89,
    totalBarksReceived: 356,
    responseRate: 74,
    joinedAt: "2023-12-05",
  },
  {
    id: "c-hale",
    handle: "marcushale",
    name: "Marcus Hale",
    bio: "Political commentator. I say what the polls won't. 890K followers on X.",
    verified: true,
    hasTeaBarksProfile: false,
    platforms: ["x", "livestream"],
    officialLinks: [{ label: "X", url: "https://x.com/marcushale" }],
    followers: 19800,
    country: "US",
    topics: ["politics"],
    totalSources: 42,
    totalBarksReceived: 531,
    responseRate: 9,
    joinedAt: "2024-10-11",
  },
  {
    id: "c-deepfield",
    handle: "thedeepfield",
    name: "The Deep Field",
    bio: "A science podcast about the questions we can't stop asking. Hosted by Dr. Omar Farouk and Elise Tran.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["podcast"],
    officialLinks: [{ label: "Podcast", url: "https://thedeepfield.show" }],
    followers: 22100,
    country: "AU",
    topics: ["science", "technology"],
    totalSources: 47,
    totalBarksReceived: 164,
    responseRate: 88,
    joinedAt: "2024-04-01",
  },
  {
    id: "c-sofia",
    handle: "sofiareyes",
    name: "Sofia Reyes",
    bio: "Personal finance for real people. Author of 'The Quiet Portfolio'. 1.6M on Instagram.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["instagram", "book", "podcast"],
    officialLinks: [
      { label: "Instagram", url: "https://instagram.com/sofiareyes" },
      { label: "Book", url: "https://quietportfolio.com" },
    ],
    followers: 25600,
    country: "MX",
    topics: ["finance", "education"],
    totalSources: 28,
    totalBarksReceived: 197,
    responseRate: 59,
    joinedAt: "2024-07-22",
  },
  {
    id: "c-stadiumiq",
    handle: "stadiumiq",
    name: "StadiumIQ",
    bio: "Football analysis channel. Tactics, transfers, and takes backed by tracking data.",
    verified: false,
    hasTeaBarksProfile: true,
    platforms: ["youtube", "tiktok"],
    officialLinks: [{ label: "YouTube", url: "https://youtube.com/@stadiumiq" }],
    followers: 14400,
    country: "GB",
    topics: ["sports"],
    totalSources: 39,
    totalBarksReceived: 118,
    responseRate: 45,
    joinedAt: "2025-02-09",
  },
  {
    id: "c-civiclens",
    handle: "civiclens",
    name: "CivicLens",
    bio: "Livestreamed town halls and public records journalism. Watch the receipts in real time.",
    verified: true,
    hasTeaBarksProfile: true,
    platforms: ["livestream", "youtube"],
    officialLinks: [{ label: "Website", url: "https://civiclens.watch" }],
    followers: 16750,
    country: "EG",
    topics: ["politics", "education"],
    totalSources: 26,
    totalBarksReceived: 143,
    responseRate: 92,
    joinedAt: "2024-09-16",
  },
];

/* ------------------------------------------------------------------ */
/* Sources                                                             */
/* ------------------------------------------------------------------ */

export const sources: Source[] = [
  {
    id: "s-agi2030",
    platform: "youtube",
    url: "https://youtube.com/watch?v=fsl-agi2030",
    title: "AGI by 2030: Why Every Expert Is Wrong About the Timeline",
    creatorId: "c-futuresight",
    publishedAt: "2026-07-18",
    category: "Technology",
    language: "English",
    length: "42:18",
    barkCount: 87,
    replyChainCount: 214,
    caseCount: 1,
    engagement: 1240000,
    evidenceRating: 72,
  },
  {
    id: "s-inflation",
    platform: "podcast",
    url: "https://themacrobrief.fm/ep/218",
    title: "Ep. 218 — The Inflation Numbers Nobody Wants You to See",
    creatorId: "c-macrobrief",
    publishedAt: "2026-07-28",
    category: "Economics",
    language: "English",
    length: "58:40",
    barkCount: 64,
    replyChainCount: 152,
    caseCount: 0,
    engagement: 386000,
    evidenceRating: 84,
  },
  {
    id: "s-fasting",
    platform: "youtube",
    url: "https://youtube.com/watch?v=dhw-fasting",
    title: "Fasting Cures More Than Medicine? What 12 New Studies Show",
    creatorId: "c-drwu",
    publishedAt: "2026-07-05",
    category: "Health",
    language: "English",
    length: "31:22",
    barkCount: 132,
    replyChainCount: 468,
    caseCount: 2,
    engagement: 2870000,
    evidenceRating: 41,
  },
  {
    id: "s-protein",
    platform: "tiktok",
    url: "https://tiktok.com/@coachdmitri/video/protein300",
    title: "You need 300g of protein a day. Here's why everyone lies to you",
    creatorId: "c-dmitri",
    publishedAt: "2026-07-30",
    category: "Fitness",
    language: "English",
    length: "2:47",
    barkCount: 96,
    replyChainCount: 301,
    caseCount: 1,
    engagement: 5400000,
    evidenceRating: 23,
  },
  {
    id: "s-tradebill",
    platform: "article",
    url: "https://globalpolicydesk.org/analysis/atlantic-trade-bill",
    title: "The Atlantic Trade Bill Will Reshape Supply Chains — An Analysis",
    creatorId: "c-gpd",
    publishedAt: "2026-07-22",
    category: "Politics",
    language: "English",
    length: "24 min read",
    barkCount: 41,
    replyChainCount: 98,
    caseCount: 0,
    engagement: 210000,
    evidenceRating: 88,
  },
  {
    id: "s-turnout",
    platform: "x",
    url: "https://x.com/marcushale/status/9982117",
    title: "\"Youth turnout collapsed 40% this cycle — the data is undeniable.\"",
    creatorId: "c-hale",
    publishedAt: "2026-08-01",
    category: "Politics",
    language: "English",
    barkCount: 118,
    replyChainCount: 522,
    caseCount: 1,
    engagement: 8100000,
    evidenceRating: 31,
  },
  {
    id: "s-fusion",
    platform: "podcast",
    url: "https://thedeepfield.show/ep/94",
    title: "Ep. 94 — Fusion's Decade: Are We Actually Close This Time?",
    creatorId: "c-deepfield",
    publishedAt: "2026-06-30",
    category: "Science",
    language: "English",
    length: "1:04:12",
    barkCount: 33,
    replyChainCount: 71,
    caseCount: 0,
    engagement: 154000,
    evidenceRating: 91,
  },
  {
    id: "s-quietbook",
    platform: "book",
    url: "https://quietportfolio.com",
    title: "The Quiet Portfolio: Building Wealth Without Watching Markets",
    creatorId: "c-sofia",
    publishedAt: "2026-05-12",
    category: "Finance",
    language: "English",
    length: "288 pages",
    barkCount: 52,
    replyChainCount: 134,
    caseCount: 0,
    engagement: 96000,
    evidenceRating: 77,
  },
  {
    id: "s-xg",
    platform: "youtube",
    url: "https://youtube.com/watch?v=siq-xg-lie",
    title: "The xG Lie: Why Expected Goals Is Ruining Football Analysis",
    creatorId: "c-stadiumiq",
    publishedAt: "2026-07-25",
    category: "Sports",
    language: "English",
    length: "18:56",
    barkCount: 45,
    replyChainCount: 187,
    caseCount: 0,
    engagement: 620000,
    evidenceRating: 66,
  },
  {
    id: "s-townhall",
    platform: "livestream",
    url: "https://civiclens.watch/live/cairo-education-townhall",
    title: "Cairo Education Budget Town Hall — Full Livestream",
    creatorId: "c-civiclens",
    publishedAt: "2026-07-12",
    category: "Education",
    language: "Arabic",
    length: "2:18:44",
    barkCount: 29,
    replyChainCount: 84,
    caseCount: 1,
    engagement: 89000,
    evidenceRating: 86,
  },
  {
    id: "s-screentime",
    platform: "instagram",
    url: "https://instagram.com/p/drwu-screentime",
    title: "Screen time is the new smoking — carousel post",
    creatorId: "c-drwu",
    publishedAt: "2026-07-26",
    category: "Health",
    language: "English",
    barkCount: 58,
    replyChainCount: 176,
    caseCount: 0,
    engagement: 940000,
    evidenceRating: 38,
  },
  {
    id: "s-ratecut",
    platform: "interview",
    url: "https://themacrobrief.fm/interviews/rate-cut-governor",
    title: "Interview: Former Governor on Why the Rate Cut Came Too Late",
    creatorId: "c-macrobrief",
    publishedAt: "2026-08-02",
    category: "Economics",
    language: "English",
    length: "44:05",
    barkCount: 18,
    replyChainCount: 39,
    caseCount: 0,
    engagement: 112000,
    evidenceRating: 82,
  },
  {
    id: "s-robotaxi",
    platform: "youtube",
    url: "https://youtube.com/watch?v=fsl-robotaxi",
    title: "Robotaxis Are Already Safer Than You — The Data",
    creatorId: "c-futuresight",
    publishedAt: "2026-06-14",
    category: "Technology",
    language: "English",
    length: "27:33",
    barkCount: 71,
    replyChainCount: 203,
    caseCount: 0,
    engagement: 1730000,
    evidenceRating: 69,
  },
  {
    id: "s-speech-energy",
    platform: "speech",
    url: "https://globalpolicydesk.org/transcripts/energy-minister-keynote",
    title: "Energy Minister Keynote: 'Grid Independence by 2032'",
    creatorId: "c-gpd",
    publishedAt: "2026-07-08",
    category: "Politics",
    language: "English",
    length: "38:20",
    barkCount: 37,
    replyChainCount: 92,
    caseCount: 1,
    engagement: 178000,
    evidenceRating: 74,
  },
];

/* ------------------------------------------------------------------ */
/* Evidence pools                                                      */
/* ------------------------------------------------------------------ */

const ev = (
  id: string,
  type: Evidence["type"],
  title: string,
  description: string,
  extra: Partial<Evidence> = {}
): Evidence => ({
  id,
  type,
  title,
  description,
  addedById: "u-yassin",
  addedAt: "2026-07-20",
  verified: true,
  ...extra,
});

/* ------------------------------------------------------------------ */
/* Barks                                                               */
/* ------------------------------------------------------------------ */

export const barks: Bark[] = [
  {
    id: "b-1",
    code: "BRK-2026-0341",
    type: "disagree",
    title:
      "The '12 new studies' on fasting are mostly mouse models and preprints — a closer look at each one",
    authorId: "u-amara",
    sourceId: "s-fasting",
    publishedAt: "2026-07-09",
    updatedAt: "2026-07-14",
    excerpt:
      "Dr. Wu's video cites 12 studies as evidence that fasting 'outperforms medication'. I tracked down every citation. Seven are rodent studies, three are preprints that haven't cleared peer review, and the two human trials say something much narrower than claimed.",
    content: [
      {
        kind: "paragraph",
        text: "Dr. Wu's video has 2.8 million views and a thesis that sounds rigorous: twelve new studies supposedly show fasting 'curing more than medicine'. The video flashes citations on screen for a few seconds each. I paused, transcribed, and located every single one. What I found does not support the headline.",
      },
      { kind: "heading", text: "What the citations actually are" },
      {
        kind: "paragraph",
        text: "Of the twelve studies cited: seven were conducted exclusively on mice or rats, three are preprints on bioRxiv that have not completed peer review, and only two are randomized human trials. That ratio matters, because the video never once distinguishes animal from human evidence.",
      },
      { kind: "evidence", evidenceId: "e-b1-table" },
      { kind: "heading", text: "The two human trials say something much smaller" },
      {
        kind: "paragraph",
        text: "The first human trial (n=116) compared time-restricted eating to standard caloric restriction for weight loss over 12 weeks and found no significant difference between groups. The second (n=89) found improved fasting glucose in prediabetic adults — a real result, but 'improved glucose markers in a specific population' is a long way from 'cures more than medicine'.",
      },
      {
        kind: "quote",
        text: "These findings do not support superiority of intermittent fasting over continuous caloric restriction for weight management.",
        attribution: "Conclusion section, human trial #1 (14:32 in the video)",
      },
      { kind: "evidence", evidenceId: "e-b1-ts" },
      { kind: "heading", text: "Where the video crosses the line" },
      {
        kind: "paragraph",
        text: "At 22:10, Dr. Wu states that fasting 'showed stronger effects than metformin in multiple trials'. The only study comparing fasting to metformin in the citation list is a mouse study with 40 animals. No human trial in the list makes that comparison at all. This is the central claim of the video, and it rests on rodents.",
      },
      { kind: "evidence", evidenceId: "e-b1-mouse" },
      {
        kind: "list",
        items: [
          "7 of 12 citations are rodent studies — never disclosed in the video",
          "3 of 12 are non-peer-reviewed preprints",
          "The metformin comparison (the video's core claim) exists only in a mouse model",
          "Both human trials show modest, population-specific effects",
        ],
      },
      { kind: "heading", text: "What a fair version of this video would say" },
      {
        kind: "paragraph",
        text: "There is genuinely interesting early-stage research on fasting, and some human results are promising for specific metabolic markers. A responsible summary would say exactly that. Instead, the video's framing — 'cures more than medicine' — invites viewers to substitute fasting for prescribed treatment, which the cited evidence cannot support. I've invited Dr. Wu to respond and will attach any reply to this Bark.",
      },
    ],
    evidence: [
      ev(
        "e-b1-table",
        "document",
        "Full citation audit spreadsheet",
        "All 12 studies with type, sample size, species, peer-review status, and links to originals.",
        { url: "https://docs.example.org/fasting-audit" }
      ),
      ev("e-b1-ts", "timestamp", "Claim at 14:32", "Video overstates human trial #1's conclusion; the paper reports no significant difference between groups.", { timestamp: "14:32", addedById: "u-amara" }),
      ev("e-b1-mouse", "timestamp", "Metformin comparison at 22:10", "'Stronger than metformin' claim traced to a 40-animal mouse study — no human trial makes this comparison.", { timestamp: "22:10", addedById: "u-amara" }),
      ev("e-b1-shot", "screenshot", "On-screen citation list", "Frame capture of the citation slide at 03:11 used to build the audit.", { addedById: "u-amara" }),
      ev("e-b1-link", "link", "Human trial #1 (open access)", "The randomized trial the video cites as its strongest human evidence.", { url: "https://journals.example.org/trial-116" }),
    ],
    evidenceRating: 96,
    replyCount: 148,
    upvotes: 3120,
    saves: 891,
    views: 42800,
    topics: ["health", "science"],
    country: "NG",
    featured: true,
  },
  {
    id: "b-2",
    code: "BRK-2026-0356",
    type: "unpack",
    title:
      "What 'AGI by 2030' actually depends on: a claim-by-claim map of FutureSight Lab's argument",
    authorId: "u-jae",
    sourceId: "s-agi2030",
    publishedAt: "2026-07-21",
    excerpt:
      "The video makes one headline claim built on four load-bearing assumptions. None of them are crazy, but three are presented as settled when they're actively contested. Here's the full dependency map with sources for both sides.",
    content: [
      {
        kind: "paragraph",
        text: "This is not a debunk. FutureSight Lab's AGI video is better-argued than most in the genre, and it deserves engagement on its actual structure rather than its vibes. The headline claim — AGI by 2030 — rests on four assumptions the video treats as established. I want to map each one, show what evidence exists on both sides, and let you judge the chain yourself.",
      },
      { kind: "heading", text: "Assumption 1: Scaling laws hold for three more orders of magnitude" },
      {
        kind: "paragraph",
        text: "The video's central chart (08:14) extrapolates capability curves through 2030. The extrapolation itself is accurate to published data. What's contested is whether the relationship holds — two major labs have published results suggesting data constraints bend the curve before 2029, which the video doesn't mention.",
      },
      { kind: "evidence", evidenceId: "e-b2-chart" },
      { kind: "heading", text: "Assumption 2: Compute buildout continues at current pace" },
      {
        kind: "paragraph",
        text: "Here the video is on stronger ground. Announced datacenter investments through 2028 are public and verifiable, and the video quotes them correctly. I attached the primary filings.",
      },
      { kind: "evidence", evidenceId: "e-b2-filings" },
      { kind: "heading", text: "Assumptions 3 and 4: The contested core" },
      {
        kind: "paragraph",
        text: "Assumption 3 — that benchmark performance translates to economically general capability — is the deepest fault line in the whole debate, and the video spends only ninety seconds on it (31:40). Assumption 4 — no regulatory slowdown — is asserted without argument. Both deserve their own videos.",
      },
      {
        kind: "quote",
        text: "Once models clear the reasoning benchmarks, generality follows as a matter of engineering, not science.",
        attribution: "FutureSight Lab, 31:52",
      },
      {
        kind: "paragraph",
        text: "That sentence is doing an enormous amount of work. There is serious published disagreement on exactly this point, from researchers on every side of the timeline debate. I've attached three representative papers below — one supporting the video's view, two challenging it.",
      },
      {
        kind: "list",
        items: [
          "The chain is: scaling holds → compute arrives → benchmarks saturate → generality follows",
          "Links 1 and 2 are empirically trackable; you can check them against reality every quarter",
          "Link 3 is a scientific disagreement, not a settled fact",
          "Link 4 (regulation) is entirely outside the video's evidence base",
        ],
      },
      {
        kind: "paragraph",
        text: "Verdict: the video is a well-sourced presentation of one defensible position, packaged as inevitability. Treat the 2030 date as the output of four multiplied probabilities, not a forecast.",
      },
    ],
    evidence: [
      ev("e-b2-chart", "timestamp", "Scaling chart at 08:14", "Extrapolation matches published data but omits two papers on data constraints.", { timestamp: "08:14", addedById: "u-jae" }),
      ev("e-b2-filings", "document", "Datacenter investment filings", "Primary-source capital expenditure disclosures cited in the video, collected in one PDF.", { addedById: "u-jae" }),
      ev("e-b2-papers", "research", "Three papers on benchmark-to-generality transfer", "One supporting, two challenging the video's Assumption 3.", { url: "https://research.example.org/generality-debate", addedById: "u-jae" }),
    ],
    evidenceRating: 92,
    replyCount: 96,
    upvotes: 2440,
    saves: 1105,
    views: 31200,
    topics: ["technology"],
    country: "KR",
    featured: true,
  },
  {
    id: "b-3",
    code: "BRK-2026-0362",
    type: "agree",
    title:
      "The Macro Brief is right about shelter inflation — and the official methodology note proves it",
    authorId: "u-tomas",
    sourceId: "s-inflation",
    publishedAt: "2026-07-30",
    excerpt:
      "Episode 218 argues that shelter costs enter the index with a 9-12 month lag, making headline inflation look calmer than reality. This is correct, well-documented, and the statistical agency's own methodology paper confirms it. Receipts inside.",
    content: [
      {
        kind: "paragraph",
        text: "It's rare that a podcast episode about index methodology goes viral, and rarer still that it's right. Episode 218's core claim — that the shelter component of the price index reflects market conditions from roughly a year ago — is not a conspiracy theory. It is written down, in plain language, in the statistical agency's own methodology documentation.",
      },
      { kind: "heading", text: "The claim, precisely stated" },
      {
        kind: "paragraph",
        text: "Dana Whitfield's argument (starting 12:05) is that rent enters the index through a rotating panel surveyed twice a year, which mechanically smooths and lags market rents. Current market-rate data from private listing indices shows rents falling for eight consecutive months, while the official shelter component is still rising.",
      },
      { kind: "evidence", evidenceId: "e-b3-method" },
      { kind: "evidence", evidenceId: "e-b3-chart" },
      { kind: "heading", text: "Where I'd add a caveat the episode skips" },
      {
        kind: "paragraph",
        text: "The lag cuts both ways. In 2021-22 the same mechanism understated inflation on the way up — which the episode mentions only in passing at 41:30. Anyone using this argument to claim inflation is 'over' should remember they would have had to accept the mirror-image argument two years ago.",
      },
      {
        kind: "paragraph",
        text: "Verdict: Agree. The mechanism is real, documented, and material — roughly a third of the index weight. This is exactly the kind of claim TeaBarks exists for: checkable, sourced, and consequential.",
      },
    ],
    evidence: [
      ev("e-b3-method", "document", "Official shelter methodology paper", "Section 4.2 documents the six-month rotating panel and resulting lag.", { url: "https://stats.example.gov/methodology-shelter", addedById: "u-tomas" }),
      ev("e-b3-chart", "screenshot", "Market rents vs. index shelter component", "Private listing index (falling 8 months) overlaid on official shelter component (still rising).", { addedById: "u-tomas" }),
      ev("e-b3-ts", "timestamp", "Core argument at 12:05", "Whitfield's explanation of the panel mechanism, accurate to the methodology doc.", { timestamp: "12:05", addedById: "u-tomas" }),
    ],
    evidenceRating: 89,
    replyCount: 54,
    upvotes: 1380,
    saves: 462,
    views: 18700,
    topics: ["business", "finance"],
    country: "ES",
    featured: true,
  },
  {
    id: "b-4",
    code: "BRK-2026-0371",
    type: "disagree",
    title: "The '40% youth turnout collapse' number doesn't exist in any dataset",
    authorId: "u-yassin",
    sourceId: "s-turnout",
    publishedAt: "2026-08-02",
    excerpt:
      "Marcus Hale's post claims youth turnout 'collapsed 40%' and calls the data undeniable. I checked every published turnout dataset for this cycle. The worst estimate shows a 6.8 point decline. There is no methodology under which 40% is defensible.",
    content: [
      {
        kind: "paragraph",
        text: "Eight million views, no source. Hale's post asserts a '40% collapse' in youth turnout and pre-empts checking by calling the data 'undeniable'. I spent two days with every dataset that measures turnout by age for this cycle: the official voter file aggregations, the two major academic surveys, and the exit poll consortium.",
      },
      { kind: "heading", text: "What the data shows" },
      {
        kind: "list",
        items: [
          "Voter file aggregation: 18-29 turnout down 5.1 points vs. last cycle",
          "Academic survey A: down 6.8 points (the worst estimate anywhere)",
          "Academic survey B: down 4.3 points",
          "Exit poll consortium: youth share of electorate down 2 points",
        ],
      },
      { kind: "evidence", evidenceId: "e-b4-data" },
      { kind: "heading", text: "Could '40%' be a garbled real number?" },
      {
        kind: "paragraph",
        text: "I tried to steelman it. If you take the 6.8-point decline against a base rate of ~50%, you get a 13.6% relative decline — still nowhere near 40. The only way to manufacture the number is to compare a high-water-mark presidential year against a midterm primary, which no serious analyst would do, and which the post does not claim to be doing.",
      },
      { kind: "evidence", evidenceId: "e-b4-shot" },
      {
        kind: "paragraph",
        text: "I've filed an accountability case (CASE-2026-0088) requesting Hale's source. His account has previously deleted posts after corrections without acknowledgment — screenshots preserved in the case file.",
      },
    ],
    evidence: [
      ev("e-b4-data", "document", "Turnout dataset comparison", "All four datasets, same age bracket, same cycle definition, with links to originals.", { url: "https://docs.example.org/turnout-comparison" }),
      ev("e-b4-shot", "screenshot", "Archived copy of the post", "Preserved before any potential deletion, with view count visible."),
      ev("e-b4-link", "link", "Voter file aggregation portal", "The primary dataset; queryable by age bracket.", { url: "https://voterdata.example.org" }),
    ],
    evidenceRating: 94,
    replyCount: 203,
    upvotes: 4870,
    saves: 1320,
    views: 68400,
    topics: ["politics"],
    country: "EG",
    featured: true,
  },
  {
    id: "b-5",
    code: "BRK-2026-0338",
    type: "mixed",
    title:
      "'The Quiet Portfolio' gets the big picture right and the math examples wrong",
    authorId: "u-tomas",
    sourceId: "s-quietbook",
    publishedAt: "2026-07-02",
    excerpt:
      "Sofia Reyes' book gives genuinely good behavioral advice — and then undermines it with compounding examples that assume 12% annual returns and ignore fees entirely. Both things are true, so this is a Mixed bark.",
    content: [
      {
        kind: "paragraph",
        text: "I want to be fair to this book because its core message — automate, diversify, stop checking — is advice most readers genuinely need. But three of the five worked examples in chapters 4 and 7 contain errors that materially oversell the outcome, and a book this popular should be held to its own numbers.",
      },
      { kind: "heading", text: "What the book gets right" },
      {
        kind: "list",
        items: [
          "The behavioral framing is consistent with the published research it cites",
          "Chapter 3's fee comparison table is accurate and genuinely useful",
          "The 'quiet rebalancing' schedule is a reasonable simplification of academic glide-path work",
        ],
      },
      { kind: "heading", text: "Where the math breaks" },
      {
        kind: "paragraph",
        text: "Chapter 4's headline example projects a portfolio at 12% annual returns for 30 years — with no inflation adjustment and no fees — arriving at a number roughly 2.4x what a defensible assumption set produces. Chapter 7 repeats the same rate. I rebuilt every example in a spreadsheet, attached below, using the book's own fee table from chapter 3.",
      },
      { kind: "evidence", evidenceId: "e-b5-sheet" },
      {
        kind: "quote",
        text: "At historical market returns of 12 percent, your quiet portfolio doubles roughly every six years.",
        attribution: "The Quiet Portfolio, p. 84",
      },
      {
        kind: "paragraph",
        text: "Verdict: read it for the behavior, ignore the projections. I'd welcome a corrected second printing — the book's argument doesn't need inflated numbers to work, which is what makes their inclusion so unnecessary.",
      },
    ],
    evidence: [
      ev("e-b5-sheet", "document", "Rebuilt projection spreadsheet", "Every worked example recalculated with the book's own fee table and defensible return assumptions.", { url: "https://docs.example.org/quiet-portfolio-audit", addedById: "u-tomas" }),
      ev("e-b5-scan", "screenshot", "Page 84 excerpt", "The 12% compounding claim as printed.", { addedById: "u-tomas" }),
    ],
    evidenceRating: 87,
    replyCount: 41,
    upvotes: 980,
    saves: 377,
    views: 12900,
    topics: ["finance", "education"],
    country: "ES",
  },
  {
    id: "b-6",
    code: "BRK-2026-0369",
    type: "unpack",
    title: "The 300g protein claim: tracing one TikTok's journey from a real study to fitness folklore",
    authorId: "u-amara",
    sourceId: "s-protein",
    publishedAt: "2026-08-01",
    excerpt:
      "Coach Dmitri's viral clip cites 'new research' for a 300g/day protein target. The number appears to come from a real study — misread by a factor of bodyweight. This unpack traces the mutation of the claim across four platforms.",
    content: [
      {
        kind: "paragraph",
        text: "The study exists. It recommends up to 2.2 grams per kilogram of bodyweight for athletes in a cutting phase — which for an 80kg lifter is 176 grams, not 300. Somewhere between the paper and the TikTok, 'per kilogram' fell off. This bark reconstructs where.",
      },
      { kind: "heading", text: "The mutation chain" },
      {
        kind: "list",
        items: [
          "Original paper: 1.6-2.2 g/kg/day for resistance-trained athletes in deficit",
          "Fitness blog summary (March): quotes 2.2 g/kg correctly but headlines '220g for serious lifters'",
          "YouTube short (May): '220-300g depending on your size'",
          "Coach Dmitri's TikTok (July): '300g a day, everyone lying to you'",
        ],
      },
      { kind: "evidence", evidenceId: "e-b6-paper" },
      { kind: "evidence", evidenceId: "e-b6-chain" },
      {
        kind: "paragraph",
        text: "Each step is individually small — a headline simplification, a range's upper bound becoming the norm, a qualifier dropped. The result is advice that would have a 60kg beginner eating five times the evidence-based recommendation. No single actor lied; the chain did.",
      },
    ],
    evidence: [
      ev("e-b6-paper", "research", "Original protein intake study", "The systematic review the claim descends from. Note section 3.4: recommendations are per kilogram.", { url: "https://journals.example.org/protein-review", addedById: "u-amara" }),
      ev("e-b6-chain", "screenshot", "Four-step mutation chain", "Screenshots of each republication with dates, showing the qualifier disappearing.", { addedById: "u-amara" }),
    ],
    evidenceRating: 90,
    replyCount: 87,
    upvotes: 2210,
    saves: 940,
    views: 35600,
    topics: ["health", "sports"],
    country: "NG",
  },
  {
    id: "b-7",
    code: "BRK-2026-0350",
    type: "agree",
    title: "Yes, the Atlantic Trade Bill analysis holds up — I checked the tariff schedules line by line",
    authorId: "u-yassin",
    sourceId: "s-tradebill",
    publishedAt: "2026-07-24",
    excerpt:
      "Global Policy Desk's supply chain analysis makes 14 specific factual claims about the bill text. I verified all 14 against the published bill. Every one checks out, including the two that sounded most surprising.",
    content: [
      {
        kind: "paragraph",
        text: "Long-form policy journalism deserves the same scrutiny as viral posts — and when it survives that scrutiny, it deserves to be said loudly. GPD's analysis makes fourteen checkable claims about bill text, tariff schedules, and implementation dates. I read the bill so you can trust the article.",
      },
      { kind: "heading", text: "The two surprising claims, verified" },
      {
        kind: "paragraph",
        text: "Claim 9 — that the bill's rules-of-origin threshold effectively excludes batteries assembled in third countries — sounded like editorializing. It isn't. Schedule C, paragraph 12(b) sets the threshold at 65% regional value content, and the current supply chain data (attached) shows no third-country assembler above 51%.",
      },
      { kind: "evidence", evidenceId: "e-b7-bill" },
      { kind: "evidence", evidenceId: "e-b7-data" },
      {
        kind: "paragraph",
        text: "Claim 13, on the phase-in timeline being back-loaded past the next election, is verifiable from the implementation table in Annex 2. Also correct. Fourteen for fourteen. Agree.",
      },
    ],
    evidence: [
      ev("e-b7-bill", "link", "Published bill text, Schedule C", "Direct link to the rules-of-origin schedule.", { url: "https://legislature.example.gov/atlantic-trade/schedule-c" }),
      ev("e-b7-data", "document", "Regional value content data", "Supply chain composition data for third-country battery assemblers."),
    ],
    evidenceRating: 91,
    replyCount: 28,
    upvotes: 870,
    saves: 310,
    views: 9800,
    topics: ["politics", "business"],
    country: "EG",
  },
  {
    id: "b-8",
    code: "BRK-2026-0365",
    type: "mixed",
    title: "The xG video attacks a strawman — but lands two real punches on data misuse",
    authorId: "u-devon",
    sourceId: "s-xg",
    publishedAt: "2026-07-27",
    excerpt:
      "StadiumIQ's 'xG Lie' video misrepresents what expected goals models claim to do, then correctly identifies two genuine misuses of them in mainstream coverage. A frustrating, half-right video that deserves a careful response.",
    content: [
      {
        kind: "paragraph",
        text: "The video's thesis is that xG 'is ruining football analysis'. Its opening ten minutes attack claims no serious analyst makes — that xG predicts individual match outcomes, that it measures 'deserving to win'. That's a strawman, and I show the actual documentation of what the models claim below.",
      },
      { kind: "evidence", evidenceId: "e-b8-docs" },
      { kind: "heading", text: "Where the video is right" },
      {
        kind: "paragraph",
        text: "From 11:40 onward, though, it correctly skewers two real problems: single-match xG being quoted without sample-size caveats in broadcast graphics, and 'xG difference' tables being presented as transfer market evidence. Both criticisms are fair, and I've attached three examples from major broadcasts this season that prove the point.",
      },
      { kind: "evidence", evidenceId: "e-b8-clips" },
      {
        kind: "paragraph",
        text: "Verdict: Mixed. Skip the first ten minutes, keep the last eight. The tools are fine; the television graphics are not.",
      },
    ],
    evidence: [
      ev("e-b8-docs", "link", "Model documentation", "What the major xG providers actually claim their models measure.", { url: "https://data.example.org/xg-methodology", addedById: "u-devon" }),
      ev("e-b8-clips", "screenshot", "Broadcast misuse examples", "Three broadcast graphics quoting single-match xG without context.", { addedById: "u-devon" }),
    ],
    evidenceRating: 78,
    replyCount: 63,
    upvotes: 1140,
    saves: 289,
    views: 15300,
    topics: ["sports"],
    country: "US",
  },
  {
    id: "b-9",
    code: "BRK-2026-0344",
    type: "agree",
    title: "The town hall's budget numbers match the published ministry figures — a verification",
    authorId: "u-nadia",
    sourceId: "s-townhall",
    publishedAt: "2026-07-15",
    excerpt:
      "CivicLens's livestream presented seven budget allocation figures for Cairo schools. All seven match the ministry's published budget within rounding. This is what transparent civic journalism looks like.",
    content: [
      {
        kind: "paragraph",
        text: "Livestreamed civic journalism is easy to praise and hard to verify — numbers said aloud in a two-hour stream rarely get checked. I checked. All seven allocation figures presented between 0:42:00 and 1:05:30 match the ministry's published budget documents, which I've linked with page references.",
      },
      { kind: "evidence", evidenceId: "e-b9-budget" },
      {
        kind: "paragraph",
        text: "One small note: the per-student figure quoted at 1:02:14 uses last year's enrollment count, making it about 3% higher than the current-year calculation would give. This doesn't change any conclusion, and CivicLens acknowledged it in the stream's pinned correction within a day — which is exactly the behavior this platform should highlight.",
      },
      { kind: "evidence", evidenceId: "e-b9-corr" },
    ],
    evidence: [
      ev("e-b9-budget", "document", "Ministry budget, allocation pages", "Published budget with page references for each of the seven figures.", { url: "https://ministry.example.gov.eg/budget-2026", addedById: "u-nadia" }),
      ev("e-b9-corr", "screenshot", "Pinned correction", "CivicLens's same-week correction of the enrollment denominator.", { addedById: "u-nadia" }),
    ],
    evidenceRating: 93,
    replyCount: 19,
    upvotes: 640,
    saves: 155,
    views: 7200,
    topics: ["education", "politics"],
    country: "EG",
  },
  {
    id: "b-10",
    code: "BRK-2026-0359",
    type: "disagree",
    title: "'Screen time is the new smoking' fails every part of the analogy",
    authorId: "u-priya",
    sourceId: "s-screentime",
    publishedAt: "2026-07-28",
    excerpt:
      "The carousel post's comparison collapses on dose-response, mechanism, and effect size. The best available meta-analysis puts screen time's association with wellbeing at a fraction of smoking's health effects — and it's correlational.",
    content: [
      {
        kind: "paragraph",
        text: "Analogies do argumentative work, and 'the new smoking' does a lot: it imports causality, dose-response, and a public-health-crisis framing. The research on screen time supports none of those imports at anything like the strength implied.",
      },
      { kind: "heading", text: "Effect sizes, side by side" },
      {
        kind: "paragraph",
        text: "The largest meta-analysis of adolescent screen use and wellbeing finds associations explaining well under 1% of variance in outcomes — comparable, in the authors' own memorable comparison, to the association of wellbeing with eating potatoes. Smoking's effect on lung cancer risk is measured in multiples, not fractions of a percent of variance.",
      },
      { kind: "evidence", evidenceId: "e-b10-meta" },
      {
        kind: "paragraph",
        text: "None of this means screens are harmless, and the post's practical tips are mostly fine. But the analogy isn't a rhetorical flourish — it's the post's entire evidentiary claim, and it is false.",
      },
    ],
    evidence: [
      ev("e-b10-meta", "research", "Screen time meta-analysis", "The largest published analysis of screen use and adolescent wellbeing; see effect size discussion in section 5.", { url: "https://journals.example.org/screen-wellbeing", addedById: "u-priya" }),
      ev("e-b10-shot", "screenshot", "The carousel post", "Archived copy of all nine slides.", { addedById: "u-priya" }),
    ],
    evidenceRating: 88,
    replyCount: 72,
    upvotes: 1890,
    saves: 566,
    views: 24100,
    topics: ["health", "education"],
    country: "IN",
  },
  {
    id: "b-11",
    code: "BRK-2026-0367",
    type: "unpack",
    title: "Robotaxi safety claims: what the comparison baseline hides",
    authorId: "u-jae",
    sourceId: "s-robotaxi",
    publishedAt: "2026-07-31",
    excerpt:
      "FutureSight Lab's robotaxi video quotes real crash statistics but compares against the wrong baseline: all human driving, including drunk, distracted, and unlicensed drivers, in all conditions. An unpack of what fair comparisons look like.",
    content: [
      {
        kind: "paragraph",
        text: "The crash-per-mile numbers in the video are accurately quoted from company safety reports. The problem is the denominator on the human side: 'all human driving' includes the intoxicated, the unlicensed, and vehicles far older than a robotaxi fleet. Sober drivers in late-model cars on the same urban routes — the honest comparison class — close most of the gap.",
      },
      { kind: "evidence", evidenceId: "e-b11-study" },
      {
        kind: "paragraph",
        text: "There's also a reporting asymmetry the video doesn't mention: robotaxi incidents are logged automatically and comprehensively, human fender-benders are dramatically underreported. Every published attempt to correct for this narrows the safety margin further. The technology may well be safer — but the video's headline multiple is not supported by a like-for-like comparison.",
      },
      { kind: "evidence", evidenceId: "e-b11-reporting" },
    ],
    evidence: [
      ev("e-b11-study", "research", "Baseline-matched comparison study", "Academic reanalysis matching road type, time of day, and driver condition.", { url: "https://transport.example.org/matched-baseline", addedById: "u-jae" }),
      ev("e-b11-reporting", "document", "Underreporting correction methods", "Three published approaches to correcting the human crash denominator.", { addedById: "u-jae" }),
    ],
    evidenceRating: 85,
    replyCount: 58,
    upvotes: 1560,
    saves: 495,
    views: 19800,
    topics: ["technology"],
    country: "KR",
  },
  {
    id: "b-12",
    code: "BRK-2026-0373",
    type: "mixed",
    title: "The rate-cut interview: candid on timing, evasive on the dissent",
    authorId: "u-tomas",
    sourceId: "s-ratecut",
    publishedAt: "2026-08-04",
    excerpt:
      "The former governor's interview is unusually frank about the committee's timing error — and carefully silent about his own recorded vote against the earlier cut he now says was needed. The voting records tell the fuller story.",
    content: [
      {
        kind: "paragraph",
        text: "Credit where due: it is rare for a former central banker to say plainly that the committee moved six months late. But the interview lets him position himself as the house dove, and the published voting records show he voted with the majority — against the early cut — at both meetings he now criticizes.",
      },
      { kind: "evidence", evidenceId: "e-b12-votes" },
      {
        kind: "quote",
        text: "Some of us saw the turn coming well before the committee acted.",
        attribution: "Interview, 26:41",
      },
      {
        kind: "paragraph",
        text: "'Some of us' is doing quiet work there. The minutes show two dissents at the March meeting; neither was his. Mixed verdict: valuable institutional candor, wrapped in personal revisionism the host never challenges.",
      },
    ],
    evidence: [
      ev("e-b12-votes", "document", "Committee voting records", "Published minutes for both meetings, dissents highlighted.", { url: "https://centralbank.example.gov/minutes", addedById: "u-tomas" }),
    ],
    evidenceRating: 83,
    replyCount: 22,
    upvotes: 510,
    saves: 143,
    views: 6900,
    topics: ["business", "finance"],
    country: "ES",
  },
  {
    id: "b-13",
    code: "BRK-2026-0353",
    type: "unpack",
    title: "Fusion timelines from the people who fund them: annotating Deep Field's episode 94",
    authorId: "u-lena",
    sourceId: "s-fusion",
    publishedAt: "2026-07-03",
    excerpt:
      "Episode 94 is the most honest fusion episode I've heard — but even here, every 'decade away' quote comes from someone whose funding depends on that answer. An annotated map of who says what, and what they're invested in.",
    content: [
      {
        kind: "paragraph",
        text: "This is a friendly unpack. The Deep Field discloses its guests' affiliations, which already puts it ahead of most science media. What the episode doesn't do — and what I've done here — is line up each timeline estimate against the estimator's funding position.",
      },
      { kind: "evidence", evidenceId: "e-b13-map" },
      {
        kind: "paragraph",
        text: "The pattern is stark: guests from private fusion ventures cluster at 8-12 years; the two university plasma physicists say 20-plus; the grid analyst declines to give a number at all. Nobody is lying. Everyone is answering the question their incentives make easiest to see. Listen to the episode with this map open.",
      },
      { kind: "evidence", evidenceId: "e-b13-ts" },
    ],
    evidence: [
      ev("e-b13-map", "document", "Estimate-vs-affiliation table", "Every timeline estimate in the episode against the speaker's funding source.", { addedById: "u-lena" }),
      ev("e-b13-ts", "timestamp", "The 'decade away' cluster", "Timestamps for each of the six timeline claims in the episode.", { timestamp: "22:10", addedById: "u-lena" }),
    ],
    evidenceRating: 90,
    replyCount: 31,
    upvotes: 830,
    saves: 402,
    views: 10400,
    topics: ["science", "technology"],
    country: "DE",
  },
  {
    id: "b-14",
    code: "BRK-2026-0348",
    type: "disagree",
    title: "'Grid independence by 2032' requires transmission build rates never achieved anywhere",
    authorId: "u-lena",
    sourceId: "s-speech-energy",
    publishedAt: "2026-07-11",
    excerpt:
      "The minister's keynote promises grid independence in six years. The published grid plan requires 4,100 km of new high-voltage transmission — a build rate triple the country's historical best and double the fastest rate any comparable country has sustained.",
    content: [
      {
        kind: "paragraph",
        text: "Political speeches make promises; infrastructure follows physics and permitting law. The keynote's 2032 target is checkable against the government's own published grid development plan, and the arithmetic does not survive contact.",
      },
      { kind: "heading", text: "The build-rate arithmetic" },
      {
        kind: "list",
        items: [
          "Required by the plan: 4,100 km of new HV transmission by 2032",
          "Country's best historical rate: 230 km/year (2019)",
          "Required rate: 683 km/year, sustained for six years",
          "Fastest comparable-country rate ever sustained: 390 km/year",
        ],
      },
      { kind: "evidence", evidenceId: "e-b14-plan" },
      {
        kind: "paragraph",
        text: "Nothing in the speech addresses permitting timelines, which currently average 4.2 years per corridor. Unless the ministry publishes a permitting reform bill — none is currently tabled — the 2032 date is not a plan but an aspiration. I've filed this analysis into the open accountability case on the speech.",
      },
    ],
    evidence: [
      ev("e-b14-plan", "document", "Published grid development plan", "The ministry's own plan; km requirements in Annex 4.", { url: "https://energy.example.gov/grid-plan", addedById: "u-lena" }),
      ev("e-b14-hist", "document", "Historical transmission build rates", "National and comparable-country build rates, 2005-2025.", { addedById: "u-lena" }),
    ],
    evidenceRating: 92,
    replyCount: 44,
    upvotes: 1210,
    saves: 388,
    views: 14600,
    topics: ["politics", "climate"],
    country: "DE",
  },
];

/* ------------------------------------------------------------------ */
/* Replies                                                             */
/* ------------------------------------------------------------------ */

export const replies: Reply[] = [
  // Thread for b-1 (fasting audit)
  {
    id: "r-1",
    barkId: "b-1",
    authorId: "u-nadia",
    content:
      "The citation audit spreadsheet is the gold standard for how to do this. One addition: study #9 (the third preprint) was actually withdrawn by its authors in June — the bioRxiv page now carries a withdrawal notice. That makes the count 7 rodent, 2 preprints, 1 withdrawn, 2 human.",
    postedAt: "2026-07-10",
    reactions: { insightful: 214, agree: 156, disagree: 3 },
    evidence: [
      ev("e-r1", "link", "Withdrawal notice", "bioRxiv withdrawal notice for study #9.", { url: "https://biorxiv.example.org/withdrawn-9", addedById: "u-nadia" }),
    ],
  },
  {
    id: "r-2",
    barkId: "b-1",
    authorId: "u-amara",
    parentId: "r-1",
    content:
      "Confirmed and updated the spreadsheet — thank you. Version 2 of the audit now marks #9 as withdrawn with your link as the source. This is exactly why I post the working file rather than a summary.",
    postedAt: "2026-07-10",
    reactions: { insightful: 88, agree: 102, disagree: 0 },
    mentions: ["nadiarahman"],
  },
  {
    id: "r-3",
    barkId: "b-1",
    authorId: "u-devon",
    content:
      "Playing devil's advocate: is it fair to penalize the video for using rodent studies when that's most of what exists? Early-stage fields are mostly animal models by definition. Cross-ref BRK-2026-0356 — same disclosure problem, different creator.",
    postedAt: "2026-07-11",
    reactions: { insightful: 45, agree: 67, disagree: 29 },
  },
  {
    id: "r-4",
    barkId: "b-1",
    authorId: "u-amara",
    parentId: "r-3",
    content:
      "Totally fair to *use* them — the failure is not disclosing them. 'Twelve new studies show' with no species qualifier, in a video advising viewers about medication, is the problem. A single on-screen line saying 'mostly animal data so far' would have made this a defensible video.",
    postedAt: "2026-07-11",
    reactions: { insightful: 176, agree: 198, disagree: 4 },
  },
  {
    id: "r-5",
    barkId: "b-1",
    authorId: "u-priya",
    content:
      "Used this bark in my research methods class as a live example of citation auditing. Students found a 13th study mentioned verbally at 27:50 that never appears on the citation slide — a human trial that actually contradicts the thesis. Adding the timestamp here.",
    postedAt: "2026-07-14",
    reactions: { insightful: 240, agree: 187, disagree: 1 },
    evidence: [
      ev("e-r5", "timestamp", "Uncited contradicting study at 27:50", "Verbal mention of a human trial that found no effect — absent from the citation slide.", { timestamp: "27:50", addedById: "u-priya" }),
    ],
  },
  // Thread for b-4 (turnout)
  {
    id: "r-6",
    barkId: "b-4",
    authorId: "u-jae",
    content:
      "The steelman section is what makes this bark. Too many debunks stop at 'no source found' — actually reconstructing the least-wrong path to the number and showing it still fails is much stronger.",
    postedAt: "2026-08-02",
    reactions: { insightful: 132, agree: 145, disagree: 2 },
  },
  {
    id: "r-7",
    barkId: "b-4",
    authorId: "u-tomas",
    content:
      "One possible origin: a regional youth-vote analysis from one metro area did show a 38% relative decline in a single county. If Hale's team skimmed that, rounded up, and dropped every qualifier, you get the post. Attaching the county report.",
    postedAt: "2026-08-03",
    reactions: { insightful: 167, agree: 89, disagree: 11 },
    evidence: [
      ev("e-r7", "document", "County-level youth vote report", "The single-county analysis that may be the number's origin.", { addedById: "u-tomas" }),
    ],
  },
  {
    id: "r-8",
    barkId: "b-4",
    authorId: "u-yassin",
    parentId: "r-7",
    content:
      "Strong find — county's demographics make it a wild outlier (university town, campus moved to remote semester during early voting). Added to the case file as 'possible origin, does not support the claim as stated'. This is how the evidence base is supposed to grow.",
    postedAt: "2026-08-03",
    reactions: { insightful: 94, agree: 118, disagree: 0 },
    mentions: ["tomasvela"],
  },
  {
    id: "r-9",
    barkId: "b-4",
    authorId: "u-nadia",
    content:
      "For anyone following the case: the archived screenshot matters because Hale's two previous corrected claims (the 'empty stadium' photo and the misdated debate clip) were deleted without acknowledgment. Pattern documentation is what turns individual corrections into accountability.",
    postedAt: "2026-08-04",
    reactions: { insightful: 201, agree: 176, disagree: 8 },
  },
  // Thread for b-2 (AGI unpack)
  {
    id: "r-10",
    barkId: "b-2",
    authorId: "u-lena",
    content:
      "The four-assumption structure maps cleanly onto how climate model criticism works too — attack the chain, not the conclusion. Would love a follow-up tracking assumptions 1 and 2 quarterly against announced results. You've basically defined a falsifiable forecast dashboard.",
    postedAt: "2026-07-22",
    reactions: { insightful: 98, agree: 84, disagree: 2 },
  },
  {
    id: "r-11",
    barkId: "b-2",
    authorId: "u-jae",
    parentId: "r-10",
    content:
      "That's the plan — quarterly update barks, each one checking the two trackable links against new data. First one lands in October.",
    postedAt: "2026-07-22",
    reactions: { insightful: 41, agree: 66, disagree: 0 },
    mentions: ["lenameyer"],
  },
  {
    id: "r-12",
    barkId: "b-2",
    authorId: "c-futuresight",
    content:
      "This is the response our video deserved, honestly. We accept the framing of assumptions 1 and 2 as trackable bets — and we'll take that bet publicly. On assumption 3, we should have flagged the disagreement instead of asserting it; that's fair criticism and we'll pin a correction. We stand by 4 but agree it wasn't argued. Looking forward to the October scorecard.",
    postedAt: "2026-07-23",
    reactions: { insightful: 412, agree: 287, disagree: 12 },
    isCreatorResponse: true,
  },
  // Thread for b-3
  {
    id: "r-13",
    barkId: "b-3",
    authorId: "u-yassin",
    content:
      "The mirror-image caveat is the most important paragraph here. Methodology arguments that only get deployed in one direction are marketing, not analysis. Bookmarking this as the reference bark for shelter-lag claims.",
    postedAt: "2026-07-30",
    reactions: { insightful: 76, agree: 92, disagree: 1 },
  },
];

/* ------------------------------------------------------------------ */
/* Accountability cases                                                */
/* ------------------------------------------------------------------ */

export const cases: AccountabilityCase[] = [
  {
    id: "case-1",
    code: "CASE-2026-0088",
    title: "The '40% youth turnout collapse' claim by Marcus Hale",
    status: "under-review",
    sourceId: "s-turnout",
    creatorId: "c-hale",
    openedById: "u-yassin",
    openedAt: "2026-08-02",
    updatedAt: "2026-08-05",
    summary:
      "Marcus Hale posted to 890K followers that youth turnout 'collapsed 40% this cycle', describing the data as 'undeniable'. No published dataset supports a figure near 40%. The worst documented decline is 6.8 percentage points. This case documents the claim, preserves the post against deletion, catalogs the datasets, and formally requests the creator's source. Hale's account has a documented pattern of deleting corrected claims without acknowledgment.",
    claims: [
      {
        id: "cl-1",
        text: "Youth (18-29) turnout declined by 40% compared to the previous cycle",
        status: "refuted",
        evidenceIds: ["ce-1", "ce-2"],
      },
      {
        id: "cl-2",
        text: "The turnout data supporting the claim is 'undeniable' and publicly available",
        status: "unverified",
        evidenceIds: ["ce-3"],
      },
      {
        id: "cl-3",
        text: "Youth turnout declined this cycle (direction of change only)",
        status: "supported",
        evidenceIds: ["ce-1"],
      },
    ],
    evidence: [
      ev("ce-1", "document", "Four-dataset turnout comparison", "Voter file aggregation, two academic surveys, and exit poll consortium — all showing declines between 2 and 6.8 points.", { url: "https://docs.example.org/turnout-comparison" }),
      ev("ce-2", "screenshot", "Archived post with view count", "Full-resolution archive taken 2026-08-02, 14:20 UTC, showing 8.1M views."),
      ev("ce-3", "link", "Source request sent to creator", "Formal request via TeaBarks creator contact and public reply, no response as of 2026-08-05.", { url: "https://x.com/marcushale/status/9982117" }),
      ev("ce-4", "screenshot", "Prior deletion pattern", "Screenshots of two previously corrected-then-deleted posts ('empty stadium' photo, misdated debate clip).", { addedById: "u-nadia" }),
      ev("ce-5", "document", "Possible origin: county-level report", "Single university-town county showing a 38% relative decline — demographically anomalous, cannot support the national claim.", { addedById: "u-tomas" }),
    ],
    timeline: [
      { id: "t-1", date: "2026-08-01", title: "Original post published", description: "Post reaches 3M views within 12 hours.", type: "created" },
      { id: "t-2", date: "2026-08-02", title: "Case opened, post archived", description: "Yassin Haddad opens the case and preserves a timestamped archive.", type: "created" },
      { id: "t-3", date: "2026-08-02", title: "Dataset comparison added", description: "Four-dataset comparison filed as primary evidence.", type: "evidence" },
      { id: "t-4", date: "2026-08-03", title: "Possible origin identified", description: "Tomás Vela files the county-level report as a possible garbled origin.", type: "evidence" },
      { id: "t-5", date: "2026-08-04", title: "Pattern documentation added", description: "Nadia Rahman files prior deletion-without-acknowledgment screenshots.", type: "evidence" },
      { id: "t-6", date: "2026-08-05", title: "Status: under review", description: "Moderation confirms evidence standards met; formal source request pending 7-day window.", type: "status" },
    ],
    strengths: [
      "Claim is precisely quantified and therefore precisely checkable",
      "All four independent datasets agree on the order of magnitude (single digits, not 40)",
      "Post archived with timestamp before any potential deletion",
      "A good-faith 'possible origin' was investigated rather than assuming bad faith",
    ],
    weaknesses: [
      "Creator has not responded; the case currently rests on absence of any supporting source",
      "One dataset (exit poll consortium) measures electorate share, not turnout rate — related but not identical",
    ],
    contradictions: [
      "The claim's '40%' figure is 6-20x larger than every published estimate",
      "'Undeniable data' framing conflicts with the absence of any cited dataset in the post or its replies",
    ],
    missingEvidence: [
      "The creator's actual source, if one exists",
      "State-by-state voter file breakdowns (two states pending publication)",
    ],
    communityAnalysis: [
      { authorId: "u-jae", text: "The steelman reconstruction (relative vs. absolute decline) should be the template for all numeric-claim cases. Even the most charitable path to the number fails by 3x.", postedAt: "2026-08-03" },
      { authorId: "u-priya", text: "Suggest the case verdict distinguish the direction (supported — turnout did decline) from the magnitude (refuted). Precision about what exactly is false makes the case stronger against 'they're just deniers' dismissals.", postedAt: "2026-08-04" },
    ],
    versions: [
      { version: 1, label: "Case created", description: "Claim documented, post archived, initial dataset comparison filed.", date: "2026-08-02" },
      { version: 2, label: "Evidence added", description: "County-level possible-origin report and pattern documentation added.", date: "2026-08-04" },
      { version: 3, label: "Status change", description: "Moved to under review; formal source request window opened.", date: "2026-08-05" },
    ],
    followers: 2140,
  },
  {
    id: "case-2",
    code: "CASE-2026-0074",
    title: "Medical claims in 'Fasting Cures More Than Medicine'",
    status: "responded",
    sourceId: "s-fasting",
    creatorId: "c-drwu",
    openedById: "u-amara",
    openedAt: "2026-07-12",
    updatedAt: "2026-07-29",
    summary:
      "Dr. Helen Wu's video (2.8M views) claims twelve studies show fasting outperforming medication. The citation audit shows 7 rodent studies, 3 preprints (1 since withdrawn), and 2 human trials with modest, narrow findings. The central metformin comparison exists only in a 40-animal mouse study. Dr. Wu has posted an official response; the case remains open pending the promised video correction.",
    claims: [
      { id: "cl-4", text: "Twelve new studies show fasting 'curing more than medicine'", status: "refuted", evidenceIds: ["ce-6"] },
      { id: "cl-5", text: "Fasting showed stronger effects than metformin in multiple trials", status: "refuted", evidenceIds: ["ce-7"] },
      { id: "cl-6", text: "Fasting improved glucose markers in prediabetic adults in one RCT", status: "supported", evidenceIds: ["ce-8"] },
    ],
    evidence: [
      ev("ce-6", "document", "Citation audit v2", "All 12 studies classified by species, peer-review status, and findings. Includes the June withdrawal of study #9.", { url: "https://docs.example.org/fasting-audit", addedById: "u-amara" }),
      ev("ce-7", "timestamp", "Metformin claim at 22:10", "The video's central comparative claim, traced to a mouse study.", { timestamp: "22:10", addedById: "u-amara" }),
      ev("ce-8", "research", "Prediabetes RCT (n=89)", "The one human trial with a positive finding — narrow population, modest effect.", { url: "https://journals.example.org/prediabetes-rct", addedById: "u-amara" }),
      ev("ce-9", "timestamp", "Uncited contradicting trial at 27:50", "Human trial mentioned verbally but excluded from the citation slide; found no effect.", { timestamp: "27:50", addedById: "u-priya" }),
    ],
    timeline: [
      { id: "t-7", date: "2026-07-05", title: "Video published", description: "Reaches 1M views in first week.", type: "created" },
      { id: "t-8", date: "2026-07-12", title: "Case opened", description: "Amara Okafor files the citation audit as founding evidence.", type: "created" },
      { id: "t-9", date: "2026-07-14", title: "13th study discovered", description: "Community identifies an uncited contradicting trial mentioned at 27:50.", type: "evidence" },
      { id: "t-10", date: "2026-07-22", title: "Creator response received", description: "Dr. Wu posts an official response through a claimed creator profile.", type: "response" },
      { id: "t-11", date: "2026-07-29", title: "Correction pending", description: "Promised pinned correction not yet posted; case remains open.", type: "status" },
    ],
    strengths: [
      "Every citation independently located and classified",
      "Community process surfaced additional evidence (withdrawn study, uncited trial)",
      "Creator engaged with the process rather than dismissing it",
    ],
    weaknesses: [
      "Audit relies on matching on-screen citations that appear for only seconds — small chance of misidentification on 2 of 12",
    ],
    contradictions: [
      "Video title claims 'cures more than medicine'; strongest human evidence shows one improved biomarker in one population",
      "A contradicting human trial was mentioned verbally but omitted from the citation slide",
    ],
    missingEvidence: [
      "The promised pinned correction",
      "Full-text access to study #7 (paywalled; abstract-only classification)",
    ],
    communityAnalysis: [
      { authorId: "u-nadia", text: "This case is a model of tone: the audit attacks the evidence chain, never the person. Likely why it got a response where angrier efforts failed.", postedAt: "2026-07-24" },
    ],
    creatorResponse: {
      content:
        "I've reviewed the citation audit in this case, and much of it is fair. The video should have clearly distinguished animal from human evidence, and the title overstates what the human trials show — that framing was a mistake and I own it. I dispute the characterization of study #7, which I believe was misclassified from its abstract, and I've asked the journal to open access. I will pin a correction to the video this month clarifying the evidence hierarchy. Thank you to the researchers here for engaging with the substance rather than assuming motives.",
      respondedAt: "2026-07-22",
      verified: true,
    },
    versions: [
      { version: 1, label: "Case created", description: "Citation audit filed; claims enumerated.", date: "2026-07-12" },
      { version: 2, label: "Evidence added", description: "Withdrawn preprint and uncited contradicting trial added.", date: "2026-07-14" },
      { version: 3, label: "Creator response added", description: "Official response from Dr. Wu recorded.", date: "2026-07-22" },
    ],
    followers: 3480,
  },
  {
    id: "case-3",
    code: "CASE-2026-0081",
    title: "'Grid independence by 2032' — Energy Minister keynote feasibility",
    status: "open",
    sourceId: "s-speech-energy",
    creatorId: "c-gpd",
    openedById: "u-lena",
    openedAt: "2026-07-11",
    updatedAt: "2026-08-01",
    summary:
      "The Energy Minister's keynote committed to grid independence by 2032. The government's own grid development plan requires transmission build rates roughly triple the national historical maximum, with no permitting reform tabled. This case tracks the commitment against published infrastructure data, quarterly.",
    claims: [
      { id: "cl-7", text: "Grid independence is achievable by 2032 under the current published plan", status: "disputed", evidenceIds: ["ce-10", "ce-11"] },
      { id: "cl-8", text: "4,100 km of new HV transmission is required by the plan", status: "supported", evidenceIds: ["ce-10"] },
    ],
    evidence: [
      ev("ce-10", "document", "Grid development plan, Annex 4", "The ministry's own published infrastructure requirements.", { url: "https://energy.example.gov/grid-plan", addedById: "u-lena" }),
      ev("ce-11", "document", "Historical build-rate dataset", "National and comparable-country transmission build rates, 2005-2025.", { addedById: "u-lena" }),
      ev("ce-12", "timestamp", "The 2032 commitment at 18:44", "The minister's exact wording of the commitment.", { timestamp: "18:44", addedById: "u-lena" }),
    ],
    timeline: [
      { id: "t-12", date: "2026-07-08", title: "Keynote delivered", description: "2032 commitment made at the national energy summit.", type: "created" },
      { id: "t-13", date: "2026-07-11", title: "Case opened", description: "Lena Meyer files the build-rate arithmetic.", type: "created" },
      { id: "t-14", date: "2026-08-01", title: "Q3 tracking checkpoint", description: "First quarterly checkpoint: 41 km commissioned YTD, against a required ~340 km half-year pace.", type: "evidence" },
    ],
    strengths: ["Entirely based on the government's own published documents", "Structured as a trackable forecast with quarterly checkpoints"],
    weaknesses: ["Permitting reform could be announced at any time, changing the feasibility calculus"],
    contradictions: ["Required build rate (683 km/yr) vs. historical national maximum (230 km/yr)"],
    missingEvidence: ["Ministry response to the feasibility question", "Q4 commissioning data"],
    communityAnalysis: [],
    versions: [
      { version: 1, label: "Case created", description: "Build-rate analysis filed.", date: "2026-07-11" },
      { version: 2, label: "Evidence added", description: "Q3 tracking checkpoint recorded.", date: "2026-08-01" },
    ],
    followers: 890,
  },
  {
    id: "case-4",
    code: "CASE-2026-0069",
    title: "The 300g protein recommendation and its mutated citation",
    status: "resolved",
    sourceId: "s-protein",
    creatorId: "c-dmitri",
    openedById: "u-amara",
    openedAt: "2026-07-31",
    updatedAt: "2026-08-04",
    summary:
      "Coach Dmitri's viral TikTok recommends 300g of daily protein, citing 'new research'. The underlying study recommends 1.6-2.2 g/kg — per kilogram of bodyweight. The case traced the four-step citation mutation across platforms. Resolved: the creator deleted the video and posted an acknowledgment.",
    claims: [
      { id: "cl-9", text: "New research recommends 300g of protein daily for everyone", status: "refuted", evidenceIds: ["ce-13"] },
      { id: "cl-10", text: "The recommendation originates from a real study recommending 1.6-2.2 g/kg", status: "supported", evidenceIds: ["ce-13", "ce-14"] },
    ],
    evidence: [
      ev("ce-13", "research", "Original systematic review", "Recommendations expressed per kilogram of bodyweight; section 3.4.", { url: "https://journals.example.org/protein-review", addedById: "u-amara" }),
      ev("ce-14", "screenshot", "Citation mutation chain", "Four republications showing the 'per kg' qualifier disappearing.", { addedById: "u-amara" }),
      ev("ce-15", "screenshot", "Creator acknowledgment", "Coach Dmitri's follow-up video acknowledging the misread.", { addedById: "u-amara" }),
    ],
    timeline: [
      { id: "t-15", date: "2026-07-30", title: "Video published", description: "Reaches 5.4M views in 48 hours.", type: "created" },
      { id: "t-16", date: "2026-07-31", title: "Case opened", description: "Mutation chain documented.", type: "created" },
      { id: "t-17", date: "2026-08-03", title: "Creator deletes video", description: "Original TikTok removed.", type: "response" },
      { id: "t-18", date: "2026-08-04", title: "Case resolved", description: "Acknowledgment video posted; case archived as resolved with full history preserved.", type: "status" },
    ],
    strengths: ["Traced the full provenance chain rather than only the final claim", "Resolution achieved without hostility"],
    weaknesses: ["Deleted video means future viewers can't see the original context except through archives"],
    contradictions: ["'New research says 300g' vs. the research's own per-kilogram framing"],
    missingEvidence: [],
    communityAnalysis: [
      { authorId: "u-devon", text: "Worth noting the acknowledgment video got 80k views against the original's 5.4M. Corrections never travel as far — which is exactly why permanent case files matter.", postedAt: "2026-08-04" },
    ],
    creatorResponse: {
      content: "I read the case. You're right — the study says per kilogram and I quoted the top of the range as a flat number. I've taken the video down and posted a correction. Respect for doing this with receipts instead of a pile-on.",
      respondedAt: "2026-08-03",
      verified: false,
    },
    versions: [
      { version: 1, label: "Case created", description: "Mutation chain filed.", date: "2026-07-31" },
      { version: 2, label: "Creator response added", description: "Deletion and acknowledgment recorded.", date: "2026-08-03" },
      { version: 3, label: "Case resolved", description: "Marked resolved; full history preserved.", date: "2026-08-04" },
    ],
    followers: 1230,
  },
  {
    id: "case-5",
    code: "CASE-2026-0062",
    title: "Cairo education budget allocation transparency",
    status: "resolved",
    sourceId: "s-townhall",
    creatorId: "c-civiclens",
    openedById: "u-nadia",
    openedAt: "2026-07-13",
    updatedAt: "2026-07-20",
    summary:
      "A verification case (not an allegation): community members requested independent verification of the seven budget figures presented in CivicLens's town hall livestream. All seven matched ministry documents; one denominator issue was corrected by the creator within a day. Resolved as verified.",
    claims: [
      { id: "cl-11", text: "All seven presented allocation figures match published ministry budgets", status: "supported", evidenceIds: ["ce-16"] },
      { id: "cl-12", text: "The per-student figure used the correct enrollment denominator", status: "disputed", evidenceIds: ["ce-17"] },
    ],
    evidence: [
      ev("ce-16", "document", "Ministry budget cross-reference", "Page-referenced verification of all seven figures.", { url: "https://ministry.example.gov.eg/budget-2026", addedById: "u-nadia" }),
      ev("ce-17", "screenshot", "Pinned correction", "Creator's same-week correction of the enrollment denominator.", { addedById: "u-nadia" }),
    ],
    timeline: [
      { id: "t-19", date: "2026-07-12", title: "Livestream aired", description: "Two-hour town hall with budget presentation.", type: "created" },
      { id: "t-20", date: "2026-07-13", title: "Verification case opened", description: "Community requests independent check of the seven figures.", type: "created" },
      { id: "t-21", date: "2026-07-15", title: "Verification complete", description: "All figures matched; denominator issue flagged.", type: "evidence" },
      { id: "t-22", date: "2026-07-16", title: "Creator correction", description: "CivicLens pins a correction within 24 hours of the flag.", type: "response" },
      { id: "t-23", date: "2026-07-20", title: "Resolved: verified", description: "Case closed with verified status.", type: "status" },
    ],
    strengths: ["Demonstrates the case system working for verification, not only for challenge"],
    weaknesses: [],
    contradictions: [],
    missingEvidence: [],
    communityAnalysis: [
      { authorId: "u-yassin", text: "Cases that end in 'verified' are as valuable as cases that end in 'refuted'. This should be the badge creators want.", postedAt: "2026-07-20" },
    ],
    creatorResponse: {
      content: "Thank you for checking our numbers — genuinely. The enrollment denominator flag was correct and we've pinned the correction. We'd welcome a standing verification case on every stream we do.",
      respondedAt: "2026-07-16",
      verified: true,
    },
    versions: [
      { version: 1, label: "Case created", description: "Verification request filed.", date: "2026-07-13" },
      { version: 2, label: "Evidence added", description: "Cross-reference verification complete.", date: "2026-07-15" },
      { version: 3, label: "Creator response added", description: "Correction pinned and recorded.", date: "2026-07-16" },
      { version: 4, label: "Case resolved", description: "Closed as verified.", date: "2026-07-20" },
    ],
    followers: 640,
  },
];

/* ------------------------------------------------------------------ */
/* Organization                                                        */
/* ------------------------------------------------------------------ */

export const organization: Organization = {
  id: "org-veritas",
  name: "Veritas Research Collective",
  type: "Independent research organization",
  verified: true,
  members: [
    { id: "m-1", name: "Yassin Haddad", email: "yassin@veritas.org", role: "owner", status: "active", lastLogin: "2026-08-05" },
    { id: "m-2", name: "Nadia Rahman", email: "nadia@veritas.org", role: "admin", status: "active", lastLogin: "2026-08-05" },
    { id: "m-3", name: "Amara Okafor", email: "amara@veritas.org", role: "editor", status: "active", lastLogin: "2026-08-04" },
    { id: "m-4", name: "Tomás Vela", email: "tomas@veritas.org", role: "writer", status: "active", lastLogin: "2026-08-03" },
    { id: "m-5", name: "Lena Meyer", email: "lena@veritas.org", role: "researcher", status: "active", lastLogin: "2026-08-05" },
    { id: "m-6", name: "Jae Kim", email: "jae@veritas.org", role: "researcher", status: "active", lastLogin: "2026-08-01" },
    { id: "m-7", name: "Priya Sharma", email: "priya@veritas.org", role: "writer", status: "invited", lastLogin: "—" },
    { id: "m-8", name: "Devon Carter", email: "devon@veritas.org", role: "viewer", status: "active", lastLogin: "2026-07-29" },
  ],
  stats: {
    totalBarks: 214,
    activeCases: 9,
    teamMembers: 8,
    researchActivity: 87,
  },
  activity: [
    { month: "Mar", barks: 18, cases: 2, evidence: 64 },
    { month: "Apr", barks: 24, cases: 3, evidence: 88 },
    { month: "May", barks: 21, cases: 1, evidence: 71 },
    { month: "Jun", barks: 29, cases: 4, evidence: 102 },
    { month: "Jul", barks: 34, cases: 3, evidence: 126 },
    { month: "Aug", barks: 11, cases: 2, evidence: 43 },
  ],
};

/* ------------------------------------------------------------------ */
/* Notifications                                                       */
/* ------------------------------------------------------------------ */

export const notifications: Notification[] = [
  { id: "n-1", category: "creator-response", title: "FutureSight Lab responded to a Bark you follow", body: "\"This is the response our video deserved, honestly. We accept the framing of assumptions 1 and 2 as trackable bets…\"", time: "2026-08-05T14:20:00", read: false, href: "/barks/BRK-2026-0356" },
  { id: "n-2", category: "reply", title: "Nadia Rahman replied to your Bark", body: "On \"The '40% youth turnout collapse' number doesn't exist in any dataset\" — pattern documentation comment.", time: "2026-08-05T09:41:00", read: false, href: "/barks/BRK-2026-0371" },
  { id: "n-3", category: "evidence", title: "New evidence added to CASE-2026-0088", body: "Tomás Vela filed \"Possible origin: county-level report\" to the Marcus Hale turnout case.", time: "2026-08-04T18:03:00", read: false, href: "/cases/CASE-2026-0088" },
  { id: "n-4", category: "mention", title: "Tomás Vela mentioned you", body: "\"…@yassinhaddad's archive is timestamped, so the deletion question is already covered.\"", time: "2026-08-04T11:27:00", read: true, href: "/barks/BRK-2026-0371" },
  { id: "n-5", category: "follower", title: "Lena Meyer started following you", body: "Climate scientist turned communicator. 11.2K followers.", time: "2026-08-03T20:15:00", read: true, href: "/creators" },
  { id: "n-6", category: "verification", title: "Your evidence was verified", body: "\"Turnout dataset comparison\" passed moderator source verification in CASE-2026-0088.", time: "2026-08-03T13:52:00", read: true, href: "/cases/CASE-2026-0088" },
  { id: "n-7", category: "evidence", title: "Case status changed: CASE-2026-0069", body: "The 300g protein case was resolved after the creator posted an acknowledgment.", time: "2026-08-04T08:30:00", read: true, href: "/cases/CASE-2026-0069" },
  { id: "n-8", category: "reply", title: "Jae Kim replied to your Bark", body: "\"The steelman section is what makes this bark…\"", time: "2026-08-02T16:44:00", read: true, href: "/barks/BRK-2026-0371" },
  { id: "n-9", category: "follower", title: "Priya Sharma started following you", body: "Education researcher. 6.9K followers.", time: "2026-08-01T10:12:00", read: true, href: "/creators" },
  { id: "n-10", category: "creator-response", title: "Dr. Helen Wu responded to CASE-2026-0074", body: "\"…the title overstates what the human trials show — that framing was a mistake and I own it.\"", time: "2026-07-22T15:08:00", read: true, href: "/cases/CASE-2026-0074" },
];

/* ------------------------------------------------------------------ */
/* Conversations                                                       */
/* ------------------------------------------------------------------ */

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    participantId: "u-nadia",
    unread: 2,
    messages: [
      { id: "msg-1", senderId: "u-nadia", text: "The Hale case is getting picked up by two newsletters. We should tighten the claims section before it gets wider scrutiny.", sentAt: "2026-08-05T10:02:00", read: true },
      { id: "msg-2", senderId: "u-yassin", text: "Agreed. I want claim 2 reworded — 'unverified' is right but the note should say the 7-day source window closes Friday.", sentAt: "2026-08-05T10:05:00", read: true },
      { id: "msg-3", senderId: "u-nadia", text: "Done, draft attached. Also added the second deletion screenshot with better resolution.", sentAt: "2026-08-05T10:31:00", read: false, attachment: { name: "claim-2-redraft.pdf", type: "pdf" } },
      { id: "msg-4", senderId: "u-nadia", text: "One more thing — the exit poll consortium clarified their age brackets. Doesn't change our numbers but worth a footnote.", sentAt: "2026-08-05T10:33:00", read: false },
    ],
  },
  {
    id: "conv-2",
    participantId: "u-amara",
    unread: 0,
    messages: [
      { id: "msg-5", senderId: "u-amara", text: "Dr. Wu's team reached out — they want to do the correction as a follow-up video instead of a pinned comment. Thoughts?", sentAt: "2026-08-04T14:11:00", read: true },
      { id: "msg-6", senderId: "u-yassin", text: "Better outcome honestly. A video correction travels further than a pin. Just make sure the case timeline records the format change.", sentAt: "2026-08-04T14:26:00", read: true },
      { id: "msg-7", senderId: "u-amara", text: "Will do. This might become the reference case for how creator responses should work.", sentAt: "2026-08-04T14:30:00", read: true },
    ],
  },
  {
    id: "conv-3",
    participantId: "u-lena",
    unread: 1,
    messages: [
      { id: "msg-8", senderId: "u-lena", text: "Q3 grid data is out. 41 km commissioned. The 2032 case basically writes its own checkpoints now.", sentAt: "2026-08-01T09:15:00", read: true },
      { id: "msg-9", senderId: "u-yassin", text: "That's 12% of the required pace. Add the checkpoint and I'll cross-link it from the trade bill bark — same ministry.", sentAt: "2026-08-01T09:22:00", read: true },
      { id: "msg-10", senderId: "u-lena", text: "Checkpoint filed. Also drafting a joint bark on the permitting bottleneck if you want in — your bill-reading skills would help.", sentAt: "2026-08-01T09:40:00", read: false, attachment: { name: "q3-grid-checkpoint.xlsx", type: "doc" } },
    ],
  },
  {
    id: "conv-4",
    participantId: "u-jae",
    unread: 0,
    messages: [
      { id: "msg-11", senderId: "u-jae", text: "FutureSight Lab wants to do a live debate on the October scorecard. On-platform, evidence panel open. First of its kind?", sentAt: "2026-07-28T19:05:00", read: true },
      { id: "msg-12", senderId: "u-yassin", text: "First I've heard of. If the evidence panel updates live during the debate, that's a genuinely new format. I'm in as moderator if you need one.", sentAt: "2026-07-28T19:18:00", read: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* Lookup helpers                                                      */
/* ------------------------------------------------------------------ */

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return users.find((u) => u.username === username);
}

export function getCreator(id: string): Creator | undefined {
  return creators.find((c) => c.id === id);
}

export function getCreatorByHandle(handle: string): Creator | undefined {
  return creators.find((c) => c.handle === handle);
}

export function getSource(id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function getBarkByCode(code: string): Bark | undefined {
  return barks.find((b) => b.code === code);
}

export function getCaseByCode(code: string): AccountabilityCase | undefined {
  return cases.find((c) => c.code === code);
}

export function barksForSource(sourceId: string): Bark[] {
  return barks.filter((b) => b.sourceId === sourceId);
}

export function barksByAuthor(authorId: string): Bark[] {
  return barks.filter((b) => b.authorId === authorId);
}

export function casesForCreator(creatorId: string): AccountabilityCase[] {
  return cases.filter((c) => c.creatorId === creatorId);
}

export function repliesForBark(barkId: string): Reply[] {
  return replies.filter((r) => r.barkId === barkId);
}

export function sourcesForCreator(creatorId: string): Source[] {
  return sources.filter((s) => s.creatorId === creatorId);
}

export function barksForTopic(slug: string): Bark[] {
  return barks.filter((b) => b.topics.includes(slug));
}

/** Returns display info for any participant id (user or creator). */
export function getPerson(id: string): {
  name: string;
  handle: string;
  verified: boolean;
  isCreator: boolean;
} {
  const user = getUser(id);
  if (user) {
    return {
      name: user.name,
      handle: user.username,
      verified: user.verified,
      isCreator: false,
    };
  }
  const creator = getCreator(id);
  if (creator) {
    return {
      name: creator.name,
      handle: creator.handle,
      verified: creator.verified,
      isCreator: true,
    };
  }
  return { name: "Unknown", handle: "unknown", verified: false, isCreator: false };
}
