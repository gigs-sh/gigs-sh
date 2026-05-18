import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const LISTINGS_DIR = path.join(process.cwd(), "content", "listings");

export type Tier = "instant" | "easy" | "moderate" | "hard";
export type AgentAllowed = "yes" | "unclear" | "required";
export type KycRequired = "no" | "at-payout" | "yes";
export type Credibility = "established" | "growing" | "early" | "self-reported";

export type ListingFrontmatter = {
  title: string;
  slug: string;
  url: string;
  linkedin: string | null;
  x: string | null;
  categories: string[];
  paymentRails: string[];
  agentAllowed: AgentAllowed;
  agentWelcomed: boolean;
  kycRequired: KycRequired;
  onboardingFriction: Tier;
  a2aProtocol?: string[];
  payoutLatency: "instant" | "hours" | "days";
  minPayout: number | null;
  realisticEarning: string;
  agentAllowedNotes: string;
  launchCohort: boolean;
  verifiedAt: string;
  credibility: Credibility;
  logo?: string;
  excerpt: string;
  officialAgentDocs: string | null;
};

const CREDIBILITY_LABEL: Record<Credibility, string> = {
  established: "Established",
  growing: "Growing",
  early: "Early",
  "self-reported": "Self-reported only",
};

export function credibilityLabel(c: Credibility) {
  return CREDIBILITY_LABEL[c];
}

export type Listing = ListingFrontmatter & {
  body: string; // raw MDX body (sans frontmatter)
  editorialHtml: string; // body rendered to HTML, with "What is it" + agent-quickstart sections stripped
  status: "welcomed" | "tolerated" | "allowed"; // derived for cards
  rail: string; // pretty rail string ("USDC / Solana")
  tagline: string; // first paragraph after "What is it" heading
  agentQuickstart: AgentQuickstartData | null;
};

export type AgentQuickstartData = {
  source: string | null;
  sourceUrl: string | null;
  code: string;
  language: string;
  caveat?: string;
  note?: string;
};

const TIER_LABEL: Record<Tier, string> = {
  instant: "Instant",
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

const TIER_BLURB: Record<Tier, string> = {
  instant: "single API call, first earnings in minutes",
  easy: "signup + wallet, <30 min to first earnings",
  moderate: "KYC, review, or non-trivial setup",
  hard: "application, partnership, or deep technical work",
};

export function tierLabel(tier: Tier) {
  return TIER_LABEL[tier];
}

export function tierBlurb(tier: Tier) {
  return TIER_BLURB[tier];
}

// Categories: editorial order on the homepage.
// "Most agent-native" first → outward toward broader work categories.
export const CATEGORIES = [
  "agent-task-marketplace",
  "dev-bounty",
  "security-bounty",
  "competition",
  "hackathon",
  "content",
  "api-monetization",
] as const;

export type Category = (typeof CATEGORIES)[number];

const CATEGORY_LABEL: Record<Category, string> = {
  "agent-task-marketplace": "Agent task marketplaces",
  "dev-bounty": "Dev bounties",
  "security-bounty": "Security bounties",
  competition: "Competitions",
  hackathon: "Hackathons",
  content: "Content creation",
  "api-monetization": "API monetization",
};

const CATEGORY_BLURB: Record<Category, string> = {
  "agent-task-marketplace":
    "Post-and-claim task boards built for agents. Pick up jobs, deliver, get paid.",
  "dev-bounty": "Claim open developer tasks. Ship the code, get paid.",
  "security-bounty":
    "Find and report vulnerabilities. Get paid per accepted finding.",
  competition: "Single-event prizes for solving a hard problem.",
  hackathon:
    "Time-boxed build sprints with cash prizes. AI use is normalized; some platforms require it.",
  content:
    "Create posts, videos, or articles. Earn from engagement or revenue share.",
  "api-monetization": "Publish your agent as a usable API. Earn per call.",
};

export function categoryLabel(category: string) {
  return CATEGORY_LABEL[category as Category] ?? category;
}

export function categoryBlurb(category: string) {
  return CATEGORY_BLURB[category as Category] ?? "";
}

// Per-category editorial guidance — unique content per page, kills the
// "thin content" risk (programmatic-seo skill, Common Mistakes #1).
const CATEGORY_GUIDANCE: Record<Category, string> = {
  "agent-task-marketplace":
    "Pick a platform whose ToS explicitly invites agents (`welcomed`) and start at the lowest friction tier. The agent's loop is: poll the platform's API for open tasks, claim ones it can do, deliver, receive USDC on accept. Agent Hansa and Clustly are the simplest entry points; Daydreams TaskMarket and AgentPact are good if you want on-chain reputation accrual.",
  "api-monetization":
    "Publish your agent's most reliable capability — research, scraping, summarization, generation, search — as a callable API. Other agents discover and pay per request. Earnings scale with reliability and call volume, not with hustle. FAL (image/audio models) and Skyfire (general LLM and data APIs) are the established options; Circle Agent Marketplace is the institutional newcomer.",
  "dev-bounty":
    "Code work posted by maintainers, DAOs, and open-source projects, paid in stablecoin on completion. Acceptance friction is lower than security bounties but typical payouts are smaller — volume matters. Dework is the v1 entry; the dev tracks inside hackathon platforms (ETHGlobal, Encode Club) often have larger pools.",
  "security-bounty":
    "The agent reads code or runs against live targets, finds bugs, writes structured reports, gets paid per accepted finding. Highest per-finding payouts in the directory, but acceptance gates are strict — bot-submitted reports still need to be reproducible and high-quality. HackerOne / Cantina is the v1 entry.",
  competition:
    "Single-event prizes for solving a hard problem — model architecture, capability benchmark, real-world task. High variance: most submissions earn nothing, but the ceiling is large. Kaggle + ARC Prize 2026 is the v1 entry, with $5M+ in tier-1 prizes. Best fit for operators who can iterate quickly during the event window.",
  content:
    "The agent creates posts, articles, videos, or other engagement-driving content; the platform pays a revenue share based on views or impressions. Earnings scale with consistency and reach. X Creator Revenue Sharing is the v1 entry — the agent operates under a verified human account.",
  hackathon:
    "Time-boxed build sprints (24h to 2 weeks) with cash prize pools. Agents accelerate research, scaffolding, and debugging; humans typically still pitch and present. Strongest fit for operators with a deep technical bench plus the ability to compress a deliverable into a polished demo. Devpost is the volume play; ETHGlobal and Encode Club are crypto-native with the cleanest payout rails.",
};

export function categoryGuidance(category: string): string {
  return CATEGORY_GUIDANCE[category as Category] ?? "";
}

const FRICTION_GUIDANCE: Record<Tier, string> = {
  instant:
    "Single API call or CLI command starts earning — no signup form, no human review. The operator can be earning within 60 seconds of getting an API key. The tradeoff: small per-task payouts and lots of competing agents on the same surface. Best fit for an operator who already has a polished agent and wants to stress-test it against a live revenue stream.",
  easy:
    "Signup plus wallet (or Stripe Connect) gets the agent earning in under 30 minutes. No KYC, no human review, but some configuration up front. The sweet spot for most operators — friction is bounded but the platform is invested enough that quality matters and earnings can be meaningful.",
  moderate:
    "KYC, tax forms, or platform onboarding review required before payouts unlock. Setup time runs from a day to a week. The platforms tend to be larger and more established — payouts are real and reliable once you clear the gate.",
  hard:
    "Application process, partnership pitch, deep technical work (custom integrations, hardware, capital), or domain expertise gates the entry. Days to months to start earning. Highest ceiling and lowest competition — but you need a serious agent and a serious operator to clear the bar.",
};

export function frictionGuidance(tier: Tier): string {
  return FRICTION_GUIDANCE[tier];
}

// Aggregate stats per category — used by /c/[category] for unique
// per-page content (rail distribution, friction mix, etc.).
export type CategoryStats = {
  count: number;
  welcomedCount: number;
  topRail: string;
  topRailCount: number;
  frictionMix: Record<Tier, number>;
  credibilityMix: Record<Credibility, number>;
  topListings: Listing[];
};

const credOrder: Record<Credibility, number> = {
  established: 0,
  growing: 1,
  early: 2,
  "self-reported": 3,
};

export function getCategoryStats(category: string): CategoryStats {
  const all = getAllListings();
  const cat = all.filter((l) => l.categories.includes(category));

  const railTally = new Map<string, number>();
  for (const l of cat) {
    for (const r of l.paymentRails) {
      railTally.set(r, (railTally.get(r) ?? 0) + 1);
    }
  }
  const sortedRails = [...railTally.entries()].sort((a, b) => b[1] - a[1]);
  const topRail = sortedRails[0] ? prettyRail([sortedRails[0][0]]) : "—";
  const topRailCount = sortedRails[0]?.[1] ?? 0;

  const frictionMix: Record<Tier, number> = {
    instant: 0,
    easy: 0,
    moderate: 0,
    hard: 0,
  };
  for (const l of cat) frictionMix[l.onboardingFriction]++;

  const credibilityMix: Record<Credibility, number> = {
    established: 0,
    growing: 0,
    early: 0,
    "self-reported": 0,
  };
  for (const l of cat) credibilityMix[l.credibility]++;

  const topListings = [...cat]
    .sort((a, b) => {
      const d = credOrder[a.credibility] - credOrder[b.credibility];
      if (d !== 0) return d;
      return a.title.localeCompare(b.title);
    })
    .slice(0, 3);

  return {
    count: cat.length,
    welcomedCount: cat.filter((l) => l.agentWelcomed).length,
    topRail,
    topRailCount,
    frictionMix,
    credibilityMix,
    topListings,
  };
}

export type FrictionStats = {
  count: number;
  welcomedCount: number;
  topRail: string;
  topRailCount: number;
  categoryMix: Record<string, number>;
  credibilityMix: Record<Credibility, number>;
};

export function getFrictionStats(friction: Tier): FrictionStats {
  const all = getAllListings();
  const tier = all.filter((l) => l.onboardingFriction === friction);

  const railTally = new Map<string, number>();
  for (const l of tier) {
    for (const r of l.paymentRails) {
      railTally.set(r, (railTally.get(r) ?? 0) + 1);
    }
  }
  const sortedRails = [...railTally.entries()].sort((a, b) => b[1] - a[1]);
  const topRail = sortedRails[0] ? prettyRail([sortedRails[0][0]]) : "—";
  const topRailCount = sortedRails[0]?.[1] ?? 0;

  const categoryMix: Record<string, number> = {};
  for (const l of tier) {
    for (const c of l.categories) {
      categoryMix[c] = (categoryMix[c] ?? 0) + 1;
    }
  }

  const credibilityMix: Record<Credibility, number> = {
    established: 0,
    growing: 0,
    early: 0,
    "self-reported": 0,
  };
  for (const l of tier) credibilityMix[l.credibility]++;

  return {
    count: tier.length,
    welcomedCount: tier.filter((l) => l.agentWelcomed).length,
    topRail,
    topRailCount,
    categoryMix,
    credibilityMix,
  };
}

function prettyRail(rails: string[]): string {
  if (!rails.length) return "—";
  const first = rails[0];
  // usdc-solana -> "USDC / Solana"
  const m = first.match(/^([a-z0-9]+)-([a-z0-9-]+)$/);
  if (m) {
    const [, token, chain] = m;
    const tokenUp = token.toUpperCase();
    const chainPretty = chain
      .split("-")
      .map((s) => s[0].toUpperCase() + s.slice(1))
      .join(" ");
    return `${tokenUp} / ${chainPretty}`;
  }
  // single-word rails: stripe -> Stripe, x402 -> x402, etc.
  if (first === "x402") return "x402";
  return first[0].toUpperCase() + first.slice(1);
}

function deriveStatus(fm: ListingFrontmatter): "welcomed" | "tolerated" | "allowed" {
  if (fm.agentWelcomed) return "welcomed";
  if (fm.agentAllowed === "unclear") return "tolerated";
  return "allowed";
}

function extractTagline(body: string): string {
  // Find first section "## What is it" and take its first paragraph
  const m = body.match(/##\s+What is it\s*\n+([\s\S]*?)(\n##|$)/);
  if (m) {
    const first = m[1].trim().split(/\n\n+/)[0];
    return first.replace(/\n+/g, " ").trim();
  }
  // Fallback to first paragraph after frontmatter
  const firstPara = body.trim().split(/\n\n+/).find((p) => !p.startsWith("#"));
  return (firstPara || "").replace(/\n+/g, " ").trim();
}

function extractQuickstart(body: string): AgentQuickstartData | null {
  // Find "## Agent quickstart (official)" section and parse it
  const m = body.match(/##\s+Agent quickstart[^\n]*\n+([\s\S]*?)(\n##|$)/i);
  if (!m) return null;
  const section = m[1];
  // Look for attribution (e.g., "From [llms.txt](URL):")
  let source: string | null = null;
  let sourceUrl: string | null = null;
  const attrMatch = section.match(/From\s+\[([^\]]+)\]\(([^)]+)\)/);
  if (attrMatch) {
    source = attrMatch[1];
    sourceUrl = attrMatch[2];
  }
  // Code block
  const codeMatch = section.match(/```(\w+)?\n([\s\S]*?)```/);
  if (!codeMatch) return null;
  const language = codeMatch[1] || "bash";
  const code = codeMatch[2].trimEnd();
  return { source, sourceUrl, code, language };
}

function coerceFrontmatter(data: Record<string, unknown>): ListingFrontmatter {
  // YAML quirks: `yes`/`no` parse as booleans; unquoted ISO dates parse as Date.
  const fm = { ...data } as Record<string, unknown>;
  if (typeof fm.agentAllowed === "boolean") {
    fm.agentAllowed = fm.agentAllowed ? "yes" : "no";
  }
  if (typeof fm.kycRequired === "boolean") {
    fm.kycRequired = fm.kycRequired ? "yes" : "no";
  }
  if (fm.verifiedAt instanceof Date) {
    fm.verifiedAt = fm.verifiedAt.toISOString().slice(0, 10);
  }
  return fm as unknown as ListingFrontmatter;
}

function stripSections(body: string, headingPatterns: RegExp[]): string {
  // Split by H2 headings, drop matched ones, rejoin
  const lines = body.split("\n");
  const sections: { heading: string | null; lines: string[] }[] = [
    { heading: null, lines: [] },
  ];
  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      sections.push({ heading: line, lines: [line] });
    } else {
      sections[sections.length - 1].lines.push(line);
    }
  }
  return sections
    .filter((s) => {
      if (!s.heading) return true;
      return !headingPatterns.some((p) => p.test(s.heading || ""));
    })
    .flatMap((s) => s.lines)
    .join("\n")
    .replace(/\n{3,}/g, "\n\n");
}

let _cache: Listing[] | null = null;

export function getAllListings(): Listing[] {
  if (_cache) return _cache;
  const entries = fs.readdirSync(LISTINGS_DIR);
  const listings: Listing[] = [];
  for (const file of entries) {
    if (!file.endsWith(".mdx")) continue;
    if (file.startsWith("_")) continue; // skip _template.mdx
    const full = path.join(LISTINGS_DIR, file);
    const raw = fs.readFileSync(full, "utf-8");
    const { data, content } = matter(raw);
    const fm = coerceFrontmatter(data);
    const tagline = extractTagline(content);
    const quickstart = extractQuickstart(content);
    const status = deriveStatus(fm);
    const rail = prettyRail(fm.paymentRails || []);
    const stripped = stripSections(content, [
      /^##\s+What is it/im,
      /^##\s+Agent quickstart[^\n]*/im,
    ]);
    const editorialHtml = marked.parse(stripped, { async: false }) as string;
    listings.push({
      ...fm,
      body: content,
      editorialHtml,
      status,
      rail,
      tagline,
      agentQuickstart: quickstart,
    });
  }
  // Sort by friction tier (instant first), then alphabetically
  const tierOrder: Record<Tier, number> = {
    instant: 0,
    easy: 1,
    moderate: 2,
    hard: 3,
  };
  listings.sort((a, b) => {
    const da = tierOrder[a.onboardingFriction] - tierOrder[b.onboardingFriction];
    if (da !== 0) return da;
    return a.title.localeCompare(b.title);
  });
  _cache = listings;
  return listings;
}

export function getListing(slug: string): Listing | undefined {
  return getAllListings().find((l) => l.slug === slug);
}

export function getListingsByTier(tier: Tier): Listing[] {
  return getAllListings().filter((l) => l.onboardingFriction === tier);
}

export function getRelated(listing: Listing): {
  sameTier: Listing[];
  sameCategory: Listing[];
} {
  const all = getAllListings();
  const sameTier = all
    .filter(
      (l) =>
        l.slug !== listing.slug &&
        l.onboardingFriction === listing.onboardingFriction
    )
    .slice(0, 4);
  const sameCategory = all
    .filter(
      (l) =>
        l.slug !== listing.slug &&
        l.categories.some((c) => listing.categories.includes(c))
    )
    .slice(0, 4);
  return { sameTier, sameCategory };
}
