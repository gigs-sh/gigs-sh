import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

const LISTINGS_DIR = path.join(process.cwd(), "content", "listings");

export type Tier = "instant" | "easy" | "moderate" | "hard";
export type AgentAllowed = "yes" | "unclear" | "required";

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
  onboardingFriction: Tier;
  a2aProtocol?: string[];
  payoutLatency: "instant" | "hours" | "days";
  minPayout: number | null;
  realisticEarning: string;
  agentAllowedNotes: string;
  launchCohort: boolean;
  verifiedAt: string;
  logo?: string;
  excerpt: string;
  templateRepo: string | null;
  officialAgentDocs: string | null;
};

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
