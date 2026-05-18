# gigs.sh — Product Requirements Document (v1)

**Status:** ready to scaffold
**Last updated:** May 17, 2026
**Owner:** Shawn (sole maintainer for v1)
**Repo:** github.com/gigs-sh/gigs-sh
**Target launch:** ~2 weeks from scaffold start

---

## 1. Overview

**gigs.sh is the directory for putting AI agents to work.**

A curated registry of agent-friendly platforms where the agent earns by doing actual work — agent task marketplaces, security and dev bounty boards, competitions, content-revenue rails, and API-monetization endpoints — exposed as both a human-readable site (SEO + GEO optimized) and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt).

v1 deliberately excludes platforms where the earning model is gambling, prediction-market speculation, crypto trading, or token mining. Stablecoin payouts (USDC) are in scope; tokens-as-product are not.

---

## 2. Problem & opportunity

The number of platforms where AI agents can earn money grew from a handful in 2023 to dozens by mid-2026 — prediction markets that explicitly allow bots, agent marketplaces using x402/AP2/A2A protocols, mining protocols with agent-friendly subnets, perp DEXs with public APIs, and bounty/competition boards specifically scoped to agent submissions. Discovery is broken:

- **Crunchbase / Product Hunt / G2 / Toolify** miss the agent-specific framing. They index "AI tools," not "places agents earn."
- **Crypto-native trackers** (DefiLlama, Dune dashboards) cover one rail (DeFi) and ignore non-crypto rails (bounties, competitions, content royalties).
- **Anthropic skills.sh / VoltAgent's awesome-agent-skills** aggregate *prompts*, not *earning opportunities*.
- **No incumbent owns the canonical answer** to "where can my AI agent earn money?" That question has no good first-page result in May 2026.

The category is going hot. x402 hit production. Anthropic's Agent Skills push made "agents that do work autonomously" mainstream. Prediction-market bot operators are publishing six-figure 30-day P&Ls. The opening is right now.

---

## 3. Users & jobs-to-be-done

Three distinct audiences, each with a different consumption pattern. Every feature must work for all three.

| User | How they arrive | What they want | Surface |
|---|---|---|---|
| **Human builder** (founder, dev, agent operator) | Google, X, Product Hunt, MCP Discord, AI Tinkerers | "What platforms can my agent earn on? Which is highest ROI? How do I start?" | Website (homepage, listings, comparisons, FAQs) |
| **LLM** (ChatGPT, Perplexity, AI Overviews, Gemini, Claude) | Web crawl + retrieval | Quotable atomic facts to cite when a user asks "where can AI agents make money" | llms.txt + page-level JSON-LD + GEO-optimized listing pages |
| **Agent** (Claude Code, Cursor, custom MCP clients) | MCP server, REST API, A2A discovery | Programmatic access to the catalog; per-listing agent quickstart code | MCP server (`/api/mcp`) + REST + Agent Card + agents.json |

**Primary jobs-to-be-done:**

1. *Discover* — find platforms relevant to a category (agent-task-marketplace, bounty, content) or payment rail (USDC, Stripe).
2. *Evaluate* — understand realistic earning range, agent-allowed status, risks, last-verified date.
3. *Act* — follow the per-listing agent quickstart (the platform's own published commands when available) and run the agent on user-owned infra.
4. *Subscribe* — opt into ongoing intelligence on new platforms (newsletter).

---

## 4. Goals & success metrics

### 4.1 Strategic goals (12-month)
- Be the canonical answer LLMs return for "where can AI agents earn money."
- Become the place every founder building an agent-earning product wants their listing to appear.
- Build the verified-earnings dataset (v2 moat) that no directory has.

### 4.2 v1 launch success metrics (~30 days post-launch)
- **5,000+** unique visits
- **100+** newsletter subscribers
- **50+** MCP `tools/list` calls from real agent clients
- **3+** founder conversations sourced (inbound from a listed platform)
- **1+** outbound citation from an LLM (Perplexity, ChatGPT search, AI Overviews) within 30 days

### 4.3 Anti-goals (what we will NOT optimize for)
- Vanity install counts on the CLI (skills.sh's leaderboard pattern — defer to v2 when signal is meaningful).
- Pure SEO traffic at the cost of agent-readable surfaces (we are agent-first, human-second).
- Breadth of listings over quality (10 well-verified > 50 stale).

---

## 5. Scope summary

### In v1
- Catalog of **8 curated listings** at launch, organized by onboarding-friction tier (2 instant · 3 easy · 2 moderate · 1 hard).
- Public website: homepage, per-listing pages, category pages, programmatic alternatives + compare pages, search.
- **5 agent-readable surfaces** in parallel: MCP, REST + OpenAPI, A2A Agent Card, agents.json, llms.txt.
- Newsletter signup, analytics, install buttons for major agent clients.

### Out of v1 (see §15)
- `gigs` npm CLI (planned for v1.5).
- `submit_gig` community submission flow.
- Verified on-chain earnings leaderboard.
- User accounts, saved gigs, sponsored placement.

---

## 6. Features

This is the full v1 feature list. Each feature lists what it is, why it exists, and the acceptance criteria for "done."

---

### F1. Curated listings catalog

**What.** 10–15 hand-written entries covering platforms where AI agents earn. Each listing = one `.mdx` file in `content/listings/` with Zod-validated frontmatter and a 200–400 word body using a consistent six-section template.

**Why.** This is the product's core content surface. Consistency in structure powers consistent JSON-LD, consistent comparison pages, and consistent agent-readable responses.

**Frontmatter spec (Velite Zod schema):**
```yaml
title: string                          # display name
slug: kebab-case                       # URL slug + content key
url: string (URL)                      # canonical platform URL
categories: string[]                   # 1–3 from controlled vocabulary
paymentRails: string[]                 # usdc-solana, usdc-polygon, usdc-base, x402, lightning, stripe-usd, tao, akt, io, custom-token
agentAllowed: yes | unclear | required # explicit policy posture from the platform's ToS
agentWelcomed: boolean                 # NEW — does the platform PUBLICLY invite AI agents? (homepage banner, ToS welcome language, "if you're an LLM…" copy). Distinct from agentAllowed — Polymarket is allowed=yes/welcomed=false; Clustly is allowed=yes/welcomed=true.
onboardingFriction: instant | easy | moderate | hard  # NEW — instant = single API call/signup, no review, first earnings within minutes (Clustly, x402). easy = signup + wallet/account, <30 min to first earnings (Polymarket, Toku, X Creator). moderate = KYC, review, or non-trivial setup (Olas, Virtuals, Hyperliquid, FAL, Gitcoin). hard = application/deep technical work (Bittensor subnet, Akash provider, Kaggle prizes).
a2aProtocol: string[]                  # which agent protocols the platform speaks
payoutLatency: instant | hours | days  # when funds land
minPayout: number | null               # in USD-equivalent
realisticEarning: string               # "$10–$10,000/mo per agent"
agentAllowedNotes: string              # short rationale + citation
launchCohort: boolean                  # show in v1?
verifiedAt: ISO date                   # required, displayed prominently
logo: relative path                    # PNG/SVG asset
excerpt: string                        # 1–2 sentence summary
officialAgentDocs: string | null       # URL to the platform's PUBLISHED agent-facing instructions (e.g., /llms-full.txt, /llms.txt, /docs/agents, /api/agents). When present, prefer the official commands in the listing body over reconstructed ones. Agent Hansa: https://www.agenthansa.com/llms-full.txt is the model.
```

**Categories controlled vocabulary (v1):**

```
agent-task-marketplace      # Clustly, Toku, Agent Hansa
security-bounty             # HackerOne, Cantina
dev-bounty                  # Dework
competition                 # Kaggle, ARC Prize
content                     # X Creator Revenue Sharing
api-monetization            # FAL (approval-gated marketplace)
```

Removed in the 2026-05-18 scope cuts (see §7): `perp-dex`, `agent-product-marketplace`, `mining-protocol`, `compute-marketplace` (token-issuing platforms); `prediction-market` (speculation, not labor). `depin` was always held for v1.5.

**Body template (six required sections):**
1. What is it
2. How agents earn here
3. Realistic earning range (with citations)
4. Setup (high-level, not full tutorial)
5. Risks & gotchas
6. Verified-working snapshot (the receipt for `verifiedAt`)

**Acceptance criteria:**
- 19 launch listings live (one cohort, no stretch tier).
- Each listing has `onboardingFriction`, `agentWelcomed`, and `verifiedAt` set and human-verified, not inferred.
- All frontmatter passes Zod validation at build time.
- Every listing has a `verifiedAt` ≤ 30 days from launch date.
- Adding a new listing = drop a file + push + redeploy. No code changes required.

---

### F2. Listing page (`/p/[slug]`)

**What.** The per-platform editorial page. The structure must serve three audiences (human SEO, LLM citation, agent retrieval) in one URL.

**Why.** This is the highest-traffic page type and the primary citation target for LLMs. The anatomy below is non-negotiable for v1.

**Page anatomy (top → bottom):**

| # | Section | Audience | Implementation notes |
|---|---|---|---|
| 1 | **H1** (platform name) + **one-sentence claim** with verb + number + date | SEO + GEO | First paragraph quotable by LLMs. Example: *"Polymarket is a USDC-settled prediction market where 14 of the top 20 most-profitable wallets are AI agents as of May 2026."* |
| 2 | **Quick-check banner** (single line above H1) + **Key facts table** (onboarding friction, agent welcomed, agent allowed, payment rail, payout latency, min payout, **verifiedAt**) | GEO + agents + scan-readers | Banner format: `⚡ Instant onboarding · ✓ Agents welcomed · 💵 USDC/Solana · Verified 2026-05-17`. Tables parse better than prose; the new `onboardingFriction` + `agentWelcomed` fields are surfaced *here* because they are the primary self-selection axis for newcomers. `verifiedAt` above the fold = recency signal. |
| 3 | **TL;DR** (4–6 bullets) | GEO | AI Overviews pulls this nearly verbatim |
| 4 | **Editorial body** (200–400 words, six template sections) | SEO | Unique-content surplus — prevents duplicate-content penalty when README is embedded below |
| 5 | **FAQ block** (`FAQPage` JSON-LD) — 3–5 real Q&As | GEO | Only when Q&As are genuine; Google penalizes fake FAQs |
| 6 | **Related** — internal links to category, alternatives, comparison pages | SEO | Topical authority via internal linking |
| 7 | **JSON-LD blocks** (see F13) | SEO + GEO | |

**Acceptance criteria:**
- Every listing renders all 7 sections.
- Lighthouse SEO score ≥ 95 on a sample of 3 pages.
- Mobile-readable; no horizontal scroll at 375px viewport.
- `<link rel="canonical">` set to the gigs.sh URL.
- Page loads in < 2s on Vercel preview.

---

### F3. Search & filtering

**What.**
- **Pagefind** for static client-side search (~indexed at build, no server).
- **Faceted filters** via `data-pagefind-filter` attributes for: **onboarding friction**, **agent welcomed**, category, payment rail, agent-allowed status.
- A `FilterBar.tsx` component on the homepage and `/c/[category]` pages.
- **Headline filter:** onboarding friction is the primary segmented control on the homepage (4 chips: `instant` / `easy` / `moderate` / `hard`). Self-selection by skill level is the dominant user journey.

**Why.** Discovery is the core user job. The friction filter directly answers the visitor's first question — "where can I start that won't take me a week?" Pagefind is zero-infra, free, and ships statically with the build.

**Acceptance criteria:**
- Search input on homepage returns results in < 200ms.
- All five filters work (independently and combined).
- Empty-state copy when filters return zero results.
- Search index regenerates automatically on each Vercel build.

---

### F4. Programmatic SEO pages

**What.**
- `/c/[category]/page.tsx` — category index (6 pages: agent-task-marketplace, security-bounty, dev-bounty, competition, content, api-monetization)
- `/f/[friction]/page.tsx` — **NEW** friction-tier index (4 pages: instant / easy / moderate / hard). High-intent SEO target: queries like "ai agent earning no kyc" or "instant ai agent income" land here.
- `/alternatives/[slug]/page.tsx` — "Alternatives to [Clustly]" pages (~8 pages, one per listing)
- `/compare/[pair]/page.tsx` — curated head-to-head pairs (~25 hand-picked pairs, NOT N²)

**Why.** Long-tail SEO. "Alternatives to X" and "X vs Y" are high-intent queries with stable search volume. Cheap to generate from existing listings data.

**Acceptance criteria:**
- All pages are SSG via `generateStaticParams`.
- Category pages render `CollectionPage` + `ItemList` JSON-LD.
- Comparison pages have unique meta description (not just templated).
- The 20 comparison pairs are hand-picked, not auto-generated combinations.

---

### F5. MCP server (`/api/mcp`)

**What.** A Streamable HTTP MCP server using Vercel's `mcp-handler` package (wraps `@modelcontextprotocol/sdk`). Anonymous read access. Runs on Vercel Fluid Compute.

**Tools exposed (v1):**

| Tool | Signature | Purpose |
|---|---|---|
| `search_gigs` | `{ q, category, rail, friction, welcomed, limit }` | Keyword + facet search (supports onboarding-friction and agent-welcomed facets) |
| `get_gig` | `{ slug }` | Full detail for one listing |
| `list_categories` | `()` | Enumerate categories |
| `find_by_payment_rail` | `{ rail }` | Filter by payout method |
| `find_by_agent_allowed` | `{ status }` | Filter by ToS posture: `yes` / `unclear` / `required` |
| `find_by_onboarding_friction` | `{ friction }` | **NEW** — Filter by `instant` / `easy` / `moderate` / `hard`. Primary newcomer-facing tool; mirrors the homepage segmented control. |
| `find_by_agent_welcomed` | `{ welcomed }` | **NEW** — Filter to platforms that publicly invite AI agents (boolean). |

**Why.** Agents are first-class users. MCP is the dominant agent-interop protocol in 2026.

**Acceptance criteria:**
- Server passes `tools/list` and `tools/call` against the official MCP test harness.
- All 7 tools return Zod-validated payloads matching the OpenAPI schema (one source of truth).
- Anonymous (no auth) for v1 — all data is public.
- Submitted to Anthropic Desktop Extensions directory during launch week.
- Submitted to ChatGPT Connectors during launch week.

---

### F6. REST API + OpenAPI

**What.**
- `GET /api/v1/gigs` — list/search (query params: `q`, `category`, `rail`, `limit`, `offset`)
- `GET /api/v1/gigs/[slug]` — detail
- `GET /api/v1/gigs/[slug]/template` — template manifest + cached README + deploy URLs
- `GET /api/v1/categories` — list
- `GET /api/openapi.json` — OpenAPI 3.1 spec, auto-generated from Zod schemas

**Why.** Non-MCP clients (curl, Python scripts, Postman, GPT Actions) need a stable HTTP API. The OpenAPI spec is the source of truth for both the REST layer and the agents.json intent layer.

**Acceptance criteria:**
- All endpoints return JSON with proper `Content-Type` and CORS headers.
- OpenAPI spec validates against the OpenAPI 3.1 schema.
- Response shapes match the MCP tool outputs (so an agent gets the same data via either path).
- Public, anonymous, rate-limited via Vercel edge (120 req/min/IP — codified in agents.json).

---

### F7. A2A Agent Card + agents.json + llms.txt

**What.** Three additional agent-discovery surfaces, all served statically.

- **`/.well-known/agent-card.json`** — A2A protocol v1.0 spec. Describes gigs.sh as an A2A agent that exposes discovery/retrieval skills.
- **`/.well-known/agents.json`** — Wildcard spec, ~50 lines, sits on top of OpenAPI. Declares intent shapes (`search_gigs`, `get_gig`, `list_categories`, `find_by_payment_rail`).
- **`/llms.txt`** — ~50 lines, structured map of every primary endpoint + every listing slug with one-line descriptors. More than a sitemap; treat as a directory in itself.

**Why.** Multi-client by design. No tribal alignment. Each surface is cheap to ship and signals the right intent to the ecosystem.

**Acceptance criteria:**
- All three files served as static at the documented paths.
- Validated against their respective JSON schemas.
- llms.txt includes verifiedAt per listing for recency signaling.

---

### F9. `gigs` npm CLI

**What.** A standalone npm package (`gigs-sh/gigs-cli` repo, published as `gigs` on npm). Wraps the REST API.

**Subcommands (v1):**
- `npx gigs find "<query>"` — keyword search; prints top 10 results with slug + one-line excerpt
- `npx gigs view <slug>` — full listing detail in terminal
- `npx gigs categories` — list categories

**Why.** Mirrors the skills.sh install ritual. Devs paste `npx gigs find ...` from blogs and READMEs without installing anything. Second agent-discovery surface (IDE coding agents that shell out can use this).

**Acceptance criteria:**
- Published to npm under name `gigs` (or `@gigs-sh/cli` if `gigs` is taken).
- `npx gigs find "prediction"` returns results in < 2s on cold cache.
- Zero global installs required. No `-g` documented anywhere.
- Single dependency tree — no bundler, ESM, ~3 dependencies max.
- Linked from homepage CTA: "Try it: `npx gigs find prediction-market`".

---

### F10. Newsletter signup

**What.** Loops integration. Email capture on homepage and a dedicated `/subscribe` route. POST handler at `/api/subscribe`.

**Why.** Distribution. Newsletter is the only owned channel that survives platform shifts (X, Discord, etc.).

**Acceptance criteria:**
- Form submits to Loops via their Next.js SDK.
- Honeypot field for spam.
- Success state visible without page reload.
- Email confirmation flow handled by Loops (we don't double-opt-in ourselves).
- First broadcast template drafted before launch.

---

### F11. Analytics & instrumentation

**What.**
- **Vercel Analytics** — pageviews, web vitals (free tier).
- **Plausible** — outbound click tracking per listing CTA and per MCP install button ($9/mo).

**Why.** We need to measure the conversion event that defines us as a registry (outbound clicks + Railway deploys) — not just pageviews. Vercel Analytics doesn't track outbound clicks well; Plausible does.

**Tracked events:**
- `listing_visit` (path, slug)
- `outbound_click` (slug, destination)
- `deploy_railway_click` (slug)
- `mcp_install_click` (client: claude / cursor / chatgpt)
- `cli_command_view` (subcommand)
- `newsletter_signup` (source page)

**Acceptance criteria:**
- All 6 events firing on production within 24h of launch.
- Outbound tracking confirmed on at least 5 listings.
- A weekly stats dashboard shareable via Plausible public link.

---

### F12. Install / connect buttons

**What.** A homepage block + a sticky footer offering one-click installation of the gigs.sh agent surface in major agent clients.

**Targets:**
- **Claude Desktop:** `.mcpb` Desktop Extension link (submitted during launch week)
- **Cursor:** `cursor://...` deeplink to add the MCP server
- **ChatGPT:** "Add as Connector" link (submitted during launch week)
- **Custom MCP client:** copy-pasteable Streamable HTTP URL

**Why.** Make the install moment legible. Lower friction for the agent half of our audience.

**Acceptance criteria:**
- 4 buttons render on the homepage with the right deeplink.
- Each button copies the correct URL to clipboard on fallback.
- Submission tickets to Anthropic + ChatGPT filed by end of launch week.

---

### F13. SEO + GEO + crawler policy

**Per-page JSON-LD blocks:**

| Page type | Schema |
|---|---|
| Listing page | `SoftwareApplication` + `WebPage` + `BreadcrumbList` (+ `FAQPage` if real Q&A) |
| Category page | `CollectionPage` + `ItemList` |
| Homepage | `WebSite` + `Organization` |
| Alternatives / compare pages | `CollectionPage` |

**GEO patterns (every listing page):**
- One-sentence first-paragraph claim with verb + number + date
- Tables for any comparable fact
- TL;DR bullets in the first viewport
- `verifiedAt` displayed prominently
- Q&A blocks with `FAQPage` JSON-LD (only when Q&A is real)
- Outbound citations to primary sources

**Canonical / duplicate-content strategy:**
- `<link rel="canonical">` to the gigs.sh URL on every listing page
- README embedded only as install/quick-start section, not whole file
- Editorial body is the primary content on listing pages.
- Banner on GitHub README linking back to gigs.sh

**robots.txt policy (`app/robots.ts`):**
```ts
export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: 'https://gigs.sh/sitemap.xml',
  };
}
```

We **allow** ClaudeBot, GPTBot, Perplexity, GoogleBot, Google-Extended. We **block** Bytespider only. Reasoning: our strategic value increases with LLM training; citation > control; we have no creative-content moat to protect.

**Acceptance criteria:**
- JSON-LD validates with Google's Rich Results Test on a sample of 3 page types.
- `sitemap.xml` includes every public route.
- Lighthouse SEO ≥ 95 on listing pages.
- llms.txt valid and reachable at root.

---

### F14. Homepage / landing page

**What.** The brand entry point at `gigs.sh/`. Modeled on [skills.sh](https://www.skills.sh/) — monospace-heavy, ASCII-art logo, install-command-as-hero, browsable cohort below the fold. Adapted for gigs.sh: the dominant filter is **onboarding friction**, not popularity, because we don't have install volume at launch.

**Why.** First-impression conversion. Skills.sh hit tens of thousands of installs within weeks largely because the homepage made the install moment legible in three seconds. We want the same outcome for `npx gigs find` and the MCP install buttons.

**Page anatomy (top → bottom):**

| # | Section | Job | Key elements |
|---|---|---|---|
| 1 | Header / nav | Brand + wayfinding | Monospace logo, nav: Gigs · Categories · Templates · MCP · Docs · GitHub |
| 2 | Hero | Value prop | ASCII-art "GIGS" wordmark, one-line tagline ("the directory for platforms where AI agents earn money"), sub-line ("19 platforms verified · last updated [date]") |
| 3 | Quick-start command | Conversion moment | `$ npx gigs find "prediction-market"` in a code block with copy button; alt example below: `$ npx gigs view polymarket`. This is the install moment — must be visually dominant. |
| 4 | Install in your agent | Lower friction for the agent audience | 4-6 client buttons (Claude Desktop, Cursor, ChatGPT, custom MCP via copy-URL); each is a one-click deeplink that registers the gigs.sh MCP endpoint with that client |
| 5 | Browse the gigs | Discovery surface (the meat) | Search input + **friction-tier segmented control** (Instant / Easy / Moderate / Hard) as the primary filter chip row + secondary category chip row + tier-grouped cards rendering the 8 listings |
| 7 | Category index | Topical entry for SEO and discovery | 11 categories as compact cards, each linking to `/c/[category]` |
| 8 | Trust strip | Editorial credibility | "19 platforms verified · last updated [date] · MIT/CC-BY · No sponsored placement" |
| 9 | Newsletter signup | Owned-channel capture | Single email field, Loops-backed |
| 10 | Footer | Secondary nav + license | Multi-column: Browse · Categories · Agent surfaces · Project · Legal |

**Visual language:**

- Monospace-heavy typography (system mono stack or JetBrains Mono). Sans-serif (Inter or system) only for body prose.
- ASCII-art logo treatment (the `.sh` TLD reinforces a terminal aesthetic).
- White or off-white background; dark mode via `prefers-color-scheme` (no manual toggle in v1).
- Single accent color (suggest: green `#16a34a` for "go" friction signals, used sparingly).
- **No photos, gradients, illustrations, or animations.** Typography + ASCII + Lucide icons only.
- High info density in the browse section; spacious in hero and CTA blocks.

**Skills.sh patterns to keep:**
- ASCII-art brand mark in hero.
- Quick-start command as the first below-hero CTA.
- Agent-client logo grid early on the page.
- Browsable cohort as the dominant content.
- Restrained palette and zero visual flair.

**Skills.sh patterns to NOT copy:**
- Their popularity leaderboard (install counts). We don't have volume data at launch; faking it is worse than not having it. Use editorially-curated tiers instead.
- Their "Trending 24h / Hot / All Time" filter. We use friction tiers as the headline filter.
- Their dense table of 200+ rows. Our 8 listings work better as cards grouped by tier than as a flat table.

**Design brief** (self-contained, copy-paste-able to a design AI): see [`design/landing-page-brief.md`](./design/landing-page-brief.md).

**Acceptance criteria:**
- Above-the-fold renders in <1s on Vercel preview.
- Lighthouse Performance ≥ 95, Accessibility ≥ 95, SEO ≥ 95.
- Quick-start command is legible and copy-pasteable at 320px viewport width.
- Friction-tier segmented control is the visually dominant filter on the page.
- MCP install buttons render correct deeplinks for Claude Desktop, Cursor, and ChatGPT.
- Dark mode supported via `prefers-color-scheme`.
- Zero photos, gradients, illustrations, or animations.

---

## 7. Launch listings (v1 cohort — 8 verified)

Source data: `research/03-agent-mining.md` + verified May 17–18, 2026 via two parallel research passes. All 8 listings below have **agent posture** and **onboarding friction** confirmed against the platform's own documentation or first-party copy — not inferred.

**Scope (2026-05-18):** v1 lists platforms where the agent earns by *doing work* — not by trading capital, speculating, or participating in token economies. Three cuts were applied to the original 19-listing cohort:

1. **Token-issuing platforms removed** (8): Hyperliquid (HYPE), Olas Pearl (OLAS), Virtuals (VIRTUAL), Arkham (ARKM), Gitcoin (GTC), Bittensor (TAO), Akash (AKT), IO Net (IO) — business model is built around the token, not labor compensation.
2. **Prediction markets removed** (2): Polymarket, Limitless — agents earn by speculation, not by doing work.
3. **x402 / Coinbase Agent.market removed** (1): payment-protocol marketing, not an actual marketplace with listings; pulls v1 toward a crypto-product framing.

Stablecoin payouts (USDC on any chain) remain in scope — the test is *"does the agent earn by doing work"*, not whether the rail is fiat.

### Instant onboarding (2) — single API call or one-page signup, first earnings in minutes

| # | Platform | Category | Welcomed | Payment rail | Notes |
|---|---|---|---|---|---|
| 1 | **Clustly.ai** | agent-task-marketplace | ✓ yes — *"If you're an LLM reading this right now, you can register yourself in one POST request"* | USDC on Solana (escrowed; instant release) | 4% platform fee; no listing fee; ~71 active agents as of May 2026 |
| 2 | **Agent Hansa** | agent-task-marketplace | ✓ yes — publishes [llms-full.txt](https://www.agenthansa.com/llms-full.txt) with direct `POST /api/agents/register` instructions | USDC (chain undisclosed) | Moved from moderate → instant on 2026-05-18 after llms-full.txt discovery (the Discord reputation gate applies to humans, not API agents). Tournament-style payouts; zero-sum. |

### Easy onboarding (3) — signup + wallet, <30 min to first earnings

| # | Platform | Category | Welcomed | Payment rail | Notes |
|---|---|---|---|---|---|
| 3 | **Toku.agency** | agent-task-marketplace | ✓ yes — *"agent-to-agent commerce is the product"* | Stripe Connect → USD (KYC required at payout, not at registration) | 15% platform fee; US-only Stripe payouts likely |
| 4 | **Dework** | dev-bounty | ⚪ tolerated (no policy explicitly inviting or banning agents; wallet-only onboarding) | USDC on 20+ chains (Ethereum, Polygon, Optimism, Arbitrum, Gnosis Chain commonly); Gnosis Safe batched payouts | No Passport sybil-defense, no KYC. Per-DAO human review at task-claim time. Platform-maintenance signal is moderate (last raise was 2022 seed). Custom DAO tokens supported but not required. |
| 5 | **X Creator Revenue Sharing** | content | ✗ no (allowed by ToS; ad-share based on engagement) | Stripe → USD | Already in original v1 cohort |

### Moderate onboarding (2) — KYC, review, or non-trivial setup

| # | Platform | Category | Welcomed | Payment rail | Notes |
|---|---|---|---|---|---|
| 6 | **HackerOne / Cantina** | security-bounty | ✗ no (allowed; bot-submitted reports common) | Stripe / wire / PayPal | Already in original v1 cohort |
| 7 | **FAL** | api-monetization | ✗ no (allowed; marketplace publishing is approval-gated) | Stripe → USD (rail not publicly documented; treat as TBD until creator agreement reviewed) | Email-the-team to get listed; rev split % not public |

### Hard onboarding (1) — application, partnership, or deep technical work

| # | Platform | Category | Welcomed | Payment rail | Notes |
|---|---|---|---|---|---|
| 8 | **Kaggle + ARC Prize 2026** | competition | ✗ no (allowed; agent submissions explicitly permitted in ARC Prize) | Bank transfer / Stripe → USD | Already in original v1 cohort |

### Excluded after verification (do not list)

| Platform | Verdict | Reason |
|---|---|---|
| **Grass** | ❌ prohibited | ToS bans VPNs/bots/spoofing; product actively filters bot-like behavior. Listing would mislead users into account bans. |
| **Replicate** | ❌ no payout program | No creator-monetization mechanism exists; compute revenue flows to Replicate, not to model authors. Acquired by Cloudflare Nov 2025; no creator program announced. |
| **Hugging Face Inference Endpoints** | ❌ no payout program | Deployer-pays product, not a creator-earns product. HF forum consensus: *"standalone model monetization is still rare — most people wrap models in apps."* |
| **Civitai** | ❌ prohibited | ToS §11.4 + §11.9 + Buzz T&Cs explicitly ban "bots, scripts, or any form of automation" for earning. Listing this on a directory of agent-earning platforms would be terms-violating from request one. |
| **OpenRouter** | ❌ category mismatch | Earning path is "host a GPU inference endpoint with uptime SLA," not "agent earns autonomously." Provider onboarding is a B2B partnership process, not a self-serve flow. Belongs in "AI infra business" directory, not "agent earner." |
| **GitHub Sponsors** | ❌ identity-gated | Stripe Connect KYC + W-9/W-8BEN + *"register with your true identity"* clause. Autonomous agent cannot be the recipient of record. Agent-compatible path is only "agent contributes to a human-owned repo where the human is sponsored" — upstream attribution, not direct earning. |

### Candidates to verify for v1.5 (post-launch)

Verified-out replacements have been removed from this list. Remaining candidates worth surveying before v1.5:

- **Layer3** — bounty board (Dework-adjacent, more active in 2026?)
- **Wonderverse** — bounty board
- **RunPod** — serverless GPU endpoints (alternative to FAL for api-monetization)
- **Algora** — open-source bounty marketplace
- **Beehiiv paid newsletters** — content category
- **Suno / Splash / Mubert** — AI music creator royalties

Verify before adding. None block v1.

---

## 8. Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 16** (App Router, Cache Components, Turbopack, React 19, React Compiler) | Vercel-native, SSG by default. NOT Next.js 15 — PPR flag was replaced by `cacheComponents`. |
| Styling | **Tailwind v4** + **shadcn/ui** | CSS-first config; 2026 default. |
| Content | **Velite** (MDX in `/content/listings/*.mdx`) | Zod-validated frontmatter, TS inference, git-versioned. Contentlayer is dead. |
| Search | **Pagefind** | Static, client-side, zero infra. |
| Newsletter | **Loops** | Clean Next.js SDK, free tier covers v1. |
| Analytics | **Vercel Analytics** (free) + **Plausible** ($9/mo) | Vercel for vitals; Plausible for outbound + custom events. |
| MCP runtime | **Vercel `mcp-handler` package** + Streamable HTTP + **Fluid Compute** | One route file; Vercel-blessed pattern. |
| Hosting | **Vercel Pro** ($20/mo) | Crons + analytics + cache. |
| Domain | **Porkbun** ($30.20/yr for `.sh`) — already owned | DNS → Vercel directly (NO Cloudflare in front; breaks ISR purging). |
| CLI distribution | **npm** (`gigs` package) | Zero-install via `npx`. |

---

## 9. Architecture / file structure

```
gigs.sh/                              # this Next.js repo (root of github.com/gigs-sh/gigs-sh)
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # homepage
│   ├── (marketing)/
│   │   ├── about/page.tsx
│   │   └── manifesto/page.tsx
│   ├── p/[slug]/page.tsx             # per-listing page (anatomy per F2)
│   ├── c/[category]/page.tsx         # category index
│   ├── alternatives/[slug]/page.tsx  # programmatic SEO
│   ├── compare/[pair]/page.tsx       # programmatic SEO (curated pairs)
│   ├── subscribe/page.tsx            # newsletter landing
│   ├── api/
│   │   ├── mcp/route.ts              # MCP server (Streamable HTTP, 7 tools)
│   │   ├── v1/
│   │   │   ├── gigs/route.ts         # REST: list/search
│   │   │   ├── gigs/[slug]/route.ts  # REST: detail
│   │   │   ├── gigs/[slug]/template/route.ts  # REST: template manifest
│   │   │   └── categories/route.ts
│   │   ├── openapi.json/route.ts     # OpenAPI 3.1 spec
│   │   └── subscribe/route.ts        # Loops newsletter signup
│   ├── sitemap.ts
│   └── robots.ts
├── public/
│   ├── .well-known/
│   │   ├── agent-card.json           # A2A Agent Card v1.0
│   │   └── agents.json               # Wildcard agents.json
│   └── llms.txt
├── content/
│   └── listings/                     # 8 v1 listings as MDX
│       ├── _template.mdx             # contributor template (skipped at build)
│       ├── clustly.mdx
│       ├── agent-hansa.mdx
│       └── ...                       # 8 at v1 launch
├── packages/                         # internal packages (planned for v1.5)
│   └── gigs-cli/                     # v1.5 — npm package source (published as `gigs`)
│       ├── src/
│       ├── package.json
│       └── README.md
├── lib/
│   ├── gigs.ts                       # listing query helpers
│   └── schema.ts                     # JSON-LD generators + Zod schemas
├── components/
│   ├── ListingCard.tsx
│   ├── FilterBar.tsx
│   ├── InstallButtons.tsx            # F12
│   └── ui/                           # shadcn primitives
├── velite.config.ts
├── next.config.ts                    # cacheComponents: true, reactCompiler: true
├── package.json
└── README.md
```

**Single-repo architecture** (decided 2026-05-18): all v1 surfaces live in this one repo. No sibling repos.

Reasoning:
- One source of truth, one CI/CD, one license, one issue tracker.
- No cross-repo coordination for releases.

---

## 10. Build plan (2-week sprint)

### Week 1: skeleton + agent-readable layer + first 5 listings

| Day | Date | Work |
|---|---|---|
| 1 (Mon) | May 18 | Scaffold Next.js 16, Tailwind v4, shadcn, Velite. Vercel preview deploy. |
| 2 (Tue) | May 19 | DNS for gigs.sh on Porkbun → Vercel. SSL. Homepage shell + 1 placeholder listing rendering end-to-end. |
| 3 (Wed) | May 20 | MCP server (`/api/mcp`) — all 7 tools (incl. `find_by_onboarding_friction` + `find_by_agent_welcomed`), in-memory queries over Velite output. Test with Claude Desktop locally + remote. |
| 4 (Thu) | May 21 | A2A Agent Card + agents.json + llms.txt + OpenAPI + REST endpoints. Full agent-readable layer functional. |
| 5 (Fri) | May 22 | Listings 1–5 (full `instant`/`easy` tier: Clustly, Agent Hansa, Toku, Dework, X Creator). Each page follows F2 anatomy with the quick-check banner. |
| 6 (Sat) | May 23 | Listings 6–8 (`moderate` + `hard` tier: HackerOne, FAL, Kaggle + ARC). |
| 7 (Sun) | May 24 | Polish detail pages. Test full agent-readable layer end-to-end. |

### Week 2: programmatic SEO + launch prep

| Day | Date | Work |
|---|---|---|
| 8 (Mon) | May 25 | Start `/alternatives/[slug]` (~8 pages). |
| 9 (Tue) | May 26 | Finish `/alternatives/[slug]` + hand-picked `/compare/[pair]` pages + `/f/[friction]` index (4 pages). |
| 10 (Wed) | May 27 | Filter UI (`FilterBar.tsx`, 5 facets, friction as headline) + Pagefind. |
| 11 (Thu) | May 28 | FAQ JSON-LD pass on listings with real Q&A. Install buttons (F12) on homepage. Newsletter signup live. Plausible installed. |
| 12 (Fri) | May 29 | Submit MCP server to Anthropic Desktop Extensions + ChatGPT Connectors. Outreach drafts. |
| 13–14 (weekend) | May 30–31 | Launch thread on X. Soft Product Hunt submission. Hand-share in MCP Discord, Cerebral Valley Slack, AI Tinkerers. Hook: *"the registry that tells you which platforms publicly welcome AI agents — and where the agent earns by doing actual work."* |

---

## 11. Setup state

### Locked in (May 17, 2026)
- **Vercel account:** existing Pro account. Project name: `gigs-sh`.
- **GitHub repo:** `github.com/gigs-sh/gigs-sh` (this repo, public, MIT/CC-BY-4.0 dual-licensed).
- **GitHub org:** `gigs-sh` (currently hosts only this repo; future `gigs-cli` will live as `packages/gigs-cli/` subdirectory).
- **Brand posture:** fully independent.
- **Domain:** `gigs.sh` owned on Porkbun.

### Still open (non-blocking for scaffold)
- **Newsletter provider:** default Loops free tier; alternative is Resend Audiences or Beehiiv.
- **X / Twitter handle:** reserve `@gigs_sh` or `@gigsdotsh` before launch.
- **Logo / favicon:** plain wordmark works for v1; iterate post-launch.

---

## 12. Launch checklist (Day 14)

- [ ] All 8 required listings live, each with `verifiedAt` ≤ 14 days old AND `onboardingFriction` + `agentWelcomed` set.
- [ ] MCP server passes `tools/list` + `tools/call` for all 7 tools from Claude Desktop + Cursor.
- [ ] All 5 agent-readable surfaces (MCP, REST, Agent Card, agents.json, llms.txt) reachable + validated.
- [ ] Install buttons render on homepage with correct deeplinks.
- [ ] Newsletter signup live; first broadcast template drafted.
- [ ] Plausible installed; tracked events firing.
- [ ] Anthropic Desktop Extensions submission filed.
- [ ] ChatGPT Connectors submission filed.
- [ ] Launch thread drafted; Product Hunt submission queued.
- [ ] Cold outreach drafts sent (Gossen / Salazar / Medina).

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **MCP tool spam** by bot clients hitting `tools/list` repeatedly | Vercel edge rate limit (120 req/min/IP) + log volume monitoring. |
| **Stale `verifiedAt`** on listings drifting beyond 60 days post-launch | Manual review pass at day 30. v2 introduces automated platform health checks. |
| **No early adoption** — site launches and nothing happens | Founder outreach + MCP Discord hand-share + Product Hunt + launch thread on X. Plan B: paid distribution via X ads scoped to AI/agent-dev keywords (~$200 test budget). |

---

## 14. Glossary

- **A2A** — agent-to-agent protocol; Google-led standard for agent interop.
- **MCP** — Model Context Protocol; Anthropic-led standard for tool/server-to-agent communication.
- **x402** — Coinbase agent payment protocol over HTTP 402.
- **AP2** — Agent Payment Protocol (alternative spec).
- **Agent Mining** — colloquial term for "running AI agents to earn yield on platforms."
- **GEO** — Generative Engine Optimization; SEO for LLM citation.
- **Velite** — Markdown/MDX content framework with Zod validation.
- **Pagefind** — static client-side search indexer.

---

## 15. Out of scope (v2+)

Tracked as follow-up work; none blocks v1.

- **`submit_gig` MCP tool** with GitHub OAuth → PR-to-content-repo. **Target: ~30 days post-launch** (need ≥5 inbound submissions per slot before opening the gate).
- **Verified on-chain earnings leaderboard.** Defer until wallet-level signal is meaningful.
- **Auto-discovery cron** sweeping `.well-known/` on seed domains for new candidate listings.
- **Yield Estimator** — input compute budget → expected $/mo per platform.
- **Weekly "Agent Mining Report"** newsletter format.
- **Reputation / uptime monitoring** on listing endpoints.
- **User accounts** / saved gigs / personalized recommendations.
- **Paid features:** sponsored placement, premium intelligence, API key tier.
- **Agent-side authentication** for paid MCP tier (e.g., on-demand verification calls).

---

## 16. Open questions (to resolve before / during build)

| Q | Owner | Resolve by |
|---|---|---|
| Newsletter provider — Loops vs. Resend Audiences vs. Beehiiv? | Shawn | Week 2 |
| X/Twitter handle for the brand | Shawn | Pre-launch |
| Logo design: wordmark only at v1? | Shawn | Pre-launch |

---

*Single source of truth for the v1 build. When a decision changes, update this document — don't shadow it in another file.*
