# gigs.sh — Product Requirements Document (v1)

**Status:** ready to scaffold
**Last updated:** May 17, 2026
**Owner:** Shawn (sole maintainer for v1)
**Repo:** github.com/shawnpang/gigs-sh
**Target launch:** ~2 weeks from scaffold start

---

## 1. Overview

**gigs.sh is the directory for platforms where AI agents earn money.**

A curated registry of A2A (agent-to-agent) and agent-friendly platforms — prediction markets, perp DEXs, agent marketplaces, mining protocols, bounty boards, competitions, content-revenue rails — exposed as both a human-readable site (SEO + GEO optimized) and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt, npm CLI).

What sets v1 apart from a directory: **at least one listing ships with a deployable agent template.** A user (or an agent calling our MCP server on a user's behalf) can fork the starter, supply secrets, and have a working bot running on their own infra in minutes. We are the first registry whose entries can be deployed by an agent.

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
| **Human builder** (founder, dev, agent operator) | Google, X, Product Hunt, MCP Discord, AI Tinkerers | "What platforms can my agent earn on? Which is highest ROI? How do I start?" | Website (homepage, listings, comparisons, FAQs) + GitHub starter |
| **LLM** (ChatGPT, Perplexity, AI Overviews, Gemini, Claude) | Web crawl + retrieval | Quotable atomic facts to cite when a user asks "where can AI agents make money" | llms.txt + page-level JSON-LD + GEO-optimized listing pages |
| **Agent** (Claude Code, Cursor, custom MCP clients) | MCP server, REST API, A2A discovery | Programmatic access to the catalog; one-call template manifests; deploy flows | MCP server (`/api/mcp`) + REST + Agent Card + agents.json + npm CLI |

**Primary jobs-to-be-done:**

1. *Discover* — find platforms relevant to a category (prediction-market, perp-dex, bounty) or payment rail (USDC, x402, lightning).
2. *Evaluate* — understand realistic earning range, agent-allowed status, risks, last-verified date.
3. *Act* — fork a working starter and deploy on user-owned infra (v1 = Polymarket only).
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
- **20+** Deploy-to-Railway clicks from the Polymarket starter listing page
- **3+** founder conversations sourced (inbound from a listed platform)
- **1+** outbound citation from an LLM (Perplexity, ChatGPT search, AI Overviews) within 30 days

### 4.3 Anti-goals (what we will NOT optimize for)
- Vanity install counts on the CLI (skills.sh's leaderboard pattern — defer to v2 when signal is meaningful).
- Pure SEO traffic at the cost of agent-readable surfaces (we are agent-first, human-second).
- Breadth of listings over quality (10 well-verified > 50 stale).

---

## 5. Scope summary

### In v1
- Catalog of **10–15 curated listings** (10 required, 5 stretch).
- Public website: homepage, per-listing pages, category pages, programmatic alternatives + compare pages, search.
- **5 agent-readable surfaces** in parallel: MCP, REST + OpenAPI, A2A Agent Card, agents.json, llms.txt.
- **1 deployable agent template** (`gigs-sh/polymarket-starter`) with one-click Railway deploy.
- **1 npm CLI** (`gigs`) with `find` and `view` subcommands.
- Newsletter signup, analytics, install buttons for major agent clients.

### Out of v1 (see §15)
- Additional templates beyond Polymarket.
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
paymentRails: string[]                 # usdc, x402, lightning, stripe, tao, custom-token
agentAllowed: yes | unclear | required # explicit posture from the platform
a2aProtocol: string[]                  # which agent protocols the platform speaks
payoutLatency: instant | hours | days  # when funds land
minPayout: number | null               # in USD-equivalent
realisticEarning: string               # "$10–$10,000/mo per agent"
agentAllowedNotes: string              # short rationale + citation
launchCohort: boolean                  # show in v1?
verifiedAt: ISO date                   # required, displayed prominently
logo: relative path                    # PNG/SVG asset
excerpt: string                        # 1–2 sentence summary
templateRepo: string | null            # e.g., "gigs-sh/polymarket-starter"
```

**Body template (six required sections):**
1. What is it
2. How agents earn here
3. Realistic earning range (with citations)
4. Setup (high-level, not full tutorial)
5. Risks & gotchas
6. Verified-working snapshot (the receipt for `verifiedAt`)

**Acceptance criteria:**
- 10 launch listings live; 5 stretch listings authored if time allows.
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
| 2 | **Key facts table** (payment rail, payout latency, min payout, agent-allowed status, **verifiedAt**) | GEO + agents | Tables parse better than prose; `verifiedAt` above the fold = recency signal |
| 3 | **TL;DR** (4–6 bullets) | GEO | AI Overviews pulls this nearly verbatim |
| 4 | **Editorial body** (200–400 words, six template sections) | SEO | Unique-content surplus — prevents duplicate-content penalty when README is embedded below |
| 5 | **FAQ block** (`FAQPage` JSON-LD) — 3–5 real Q&As | GEO | Only when Q&As are genuine; Google penalizes fake FAQs |
| 6 | **Template section** (only if `templateRepo` is set): rendered README install block + Deploy-to-Railway button + GitHub link + manifest properties table | Agents + humans | The action-closing surface (see F8) |
| 7 | **Related** — internal links to category, alternatives, comparison pages | SEO | Topical authority via internal linking |
| 8 | **JSON-LD blocks** (see F13) | SEO + GEO | |

**Acceptance criteria:**
- Every listing renders all 8 sections (template section conditionally).
- Lighthouse SEO score ≥ 95 on a sample of 3 pages.
- Mobile-readable; no horizontal scroll at 375px viewport.
- `<link rel="canonical">` set to the gigs.sh URL.
- Page loads in < 2s on Vercel preview.

---

### F3. Search & filtering

**What.**
- **Pagefind** for static client-side search (~indexed at build, no server).
- **Faceted filters** via `data-pagefind-filter` attributes for: category, payment rail, agent-allowed status, has-template.
- A `FilterBar.tsx` component on the homepage and `/c/[category]` pages.

**Why.** Discovery is the core user job. Pagefind is zero-infra, free, and ships statically with the build.

**Acceptance criteria:**
- Search input on homepage returns results in < 200ms.
- All four filters work (independently and combined).
- Empty-state copy when filters return zero results.
- Search index regenerates automatically on each Vercel build.

---

### F4. Programmatic SEO pages

**What.**
- `/c/[category]/page.tsx` — category index (~5 pages: prediction-market, perp-dex, agent-marketplace, bounty, mining)
- `/alternatives/[slug]/page.tsx` — "Alternatives to [Polymarket]" pages (~15 pages, one per listing)
- `/compare/[pair]/page.tsx` — curated head-to-head pairs (~20 hand-picked pairs, NOT N²)

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
| `search_gigs` | `{ q, category, rail, limit }` | Keyword + facet search |
| `get_gig` | `{ slug }` | Full detail for one listing |
| `list_categories` | `()` | Enumerate categories |
| `find_by_payment_rail` | `{ rail }` | Filter by payout method |
| `find_by_agent_allowed` | `{ status }` | Filter by `yes` / `unclear` / `required` |
| `list_templates` | `()` | Enumerate listings with deployable starters (v1 = Polymarket only) |
| `get_template` | `{ slug }` | Return parsed `template.json` + README + deploy URLs in a single call. **Moat tool — see F8.** |

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

### F8. Agent template system

**What.** A machine-readable convention for "this listing ships with a deployable agent starter."

**Three artifacts make up the system:**

1. **`gigs-sh/<slug>-starter` repos** (sibling GitHub repos under the gigs-sh org). v1 ships exactly one: `gigs-sh/polymarket-starter`.

2. **`template.json` manifest** at the root of each starter repo. Machine-readable contract:
```json
{
  "$schema": "https://gigs.sh/schemas/template-v1.json",
  "name": "polymarket-starter",
  "platform": "polymarket",
  "language": "python",
  "version": "1.0.0",
  "envVars": [
    { "name": "WALLET_PRIVATE_KEY", "required": true, "secret": true,
      "description": "Polygon wallet private key — bot trades from this address." },
    { "name": "POLYMARKET_API_KEY", "required": false, "secret": true }
  ],
  "entrypoint": "python run.py",
  "deploy": {
    "railway": "https://railway.app/new/template/<id>",
    "render": "https://render.com/deploy?repo=https://github.com/gigs-sh/polymarket-starter"
  },
  "earningRail": "usdc",
  "estimatedMonthlyEarning": "$10-$10000",
  "disclaimer": "Educational. No warranty. May lose funds.",
  "verifiedAt": "2026-05-17"
}
```

3. **`get_template({ slug })` MCP tool** that returns the manifest + cached README + deploy URLs in one call. An agent calling this can collect required secrets from the user and trigger the Railway deploy without any scraping or human intervention. **This is the v1 moat.**

**The Polymarket starter specifically:**
- Python 3.11+ script
- Connects to Polymarket's public REST API
- Trivial baseline strategy (fetches open markets, applies a simple heuristic, places a small USDC bet, exits)
- Not optimized for profit — optimized for "it runs end-to-end"
- MIT license + visible disclaimer ("educational, may lose funds")
- `requirements.txt` + `run.py` + `README.md` + `template.json` + `LICENSE`
- Banner at top of README: `📍 Full guide + related platforms: gigs.sh/p/polymarket`
- `railway.json` for one-click deploy

**Why.** Without an action surface, every listing page is a goodbye page (the Crunchbase failure mode). With even one starter, gigs.sh becomes a registry, not a directory.

**Acceptance criteria:**
- `gigs-sh/polymarket-starter` exists, is public, MIT-licensed.
- `python run.py` runs end-to-end on a fresh clone after setting two env vars.
- The Deploy-to-Railway button works end-to-end (verified with a throwaway Railway account).
- `get_template({slug: "polymarket"})` returns the manifest + README in <500ms.
- The Polymarket listing page (`/p/polymarket`) renders the Template section per F2 step 6.

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
- **Plausible** — outbound click tracking per listing CTA, per Deploy-to-Railway button, per MCP install button ($9/mo).

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
| Listing page | `SoftwareApplication` + `WebPage` + `BreadcrumbList` (+ `FAQPage` if real Q&A) (+ `SoftwareSourceCode` if `templateRepo` set) |
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
- ~70% editorial / ~30% rendered README on listing pages with `templateRepo`
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

## 7. Launch listings (v1 cohort)

Source data: `research/03-agent-mining.md`. Ten required, five stretch.

**Required (10):**
1. **Polymarket** (+ Polystrat) — prediction-market — **ships with `gigs-sh/polymarket-starter`**
2. Hyperliquid — perp-dex
3. Olas Pearl — agent-marketplace
4. Virtuals Protocol — agent-marketplace
5. Bittensor (Chutes SN64, Numinous SN6) — protocol / mining
6. Arkham Intel Exchange — bounty
7. HackerOne / Cantina — bug-bounty
8. Kaggle + ARC Prize 2026 — competition
9. Coinbase Agent.market (x402) — agent-marketplace
10. X Creator Revenue Sharing — content

**Stretch (if time allows):**
11. Suno (AI music royalties)
12. Limitless Exchange
13. Grass / Wynd
14. Theoriq
15. Toku.agency

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
| Templates host | **GitHub** (`gigs-sh/<slug>-starter` repos) | Source of truth; backlinks; fork loop. |
| Deploy target (user) | **Railway** (one-click template button) | Best secret-input UX for long-running processes. |
| CLI distribution | **npm** (`gigs` package) | Zero-install via `npx`. |

---

## 9. Architecture / file structure

```
gigs.sh/                              # this Next.js repo (root of github.com/shawnpang/gigs-sh)
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
│   ├── schemas/
│   │   └── template-v1.json          # JSON Schema for template manifests
│   └── llms.txt
├── content/
│   └── listings/
│       ├── polymarket.mdx
│       ├── hyperliquid.mdx
│       ├── olas-pearl.mdx
│       └── ...                       # 10–15 at v1
├── lib/
│   ├── gigs.ts                       # listing query helpers
│   ├── templates.ts                  # fetch + cache template.json + READMEs
│   └── schema.ts                     # JSON-LD generators + Zod schemas
├── components/
│   ├── ListingCard.tsx
│   ├── FilterBar.tsx
│   ├── InstallButtons.tsx            # F12
│   ├── TemplateSection.tsx           # F2 step 6
│   └── ui/                           # shadcn primitives
├── velite.config.ts
├── next.config.ts                    # cacheComponents: true, reactCompiler: true
├── package.json
└── README.md
```

**Sibling repos (separate, not nested):**
```
github.com/shawnpang/gigs-sh                 # this repo (the website)
github.com/gigs-sh/polymarket-starter        # v1 — agent template
github.com/gigs-sh/gigs-cli                  # v1 — npm package
github.com/gigs-sh/<slug>-starter            # v2+ — additional templates
```

---

## 10. Build plan (2-week sprint)

### Week 1: skeleton + agent-readable layer + first 5 listings + Polymarket starter

| Day | Date | Work |
|---|---|---|
| 1 (Mon) | May 18 | Scaffold Next.js 16, Tailwind v4, shadcn, Velite. Vercel preview deploy. |
| 2 (Tue) | May 19 | DNS for gigs.sh on Porkbun → Vercel. SSL. Homepage shell + 1 placeholder listing rendering end-to-end. |
| 3 (Wed) | May 20 | MCP server (`/api/mcp`) — all 7 tools, in-memory queries over Velite output. Test with Claude Desktop locally + remote. |
| 4 (Thu) | May 21 | A2A Agent Card + agents.json + llms.txt + OpenAPI + REST endpoints. Full agent-readable layer functional. |
| 5 (Fri) | May 22 | Listings 1–5 (Polymarket, Hyperliquid, Olas, Virtuals, Bittensor). Each page follows F2 anatomy. |
| 6 (Sat) | May 23 | Build `gigs-sh/polymarket-starter`. Python entrypoint + `template.json` + README + Railway config. Test on testnet. |
| 7 (Sun) | May 24 | `lib/templates.ts` GitHub fetcher + nightly cron. `TemplateSection.tsx` on `/p/polymarket`. Test full Railway deploy flow. |

### Week 2: complete content + programmatic SEO + CLI + launch prep

| Day | Date | Work |
|---|---|---|
| 8 (Mon) | May 25 | Listings 6–10 (Arkham, HackerOne, Kaggle, Agent.market, X Creator). |
| 9 (Tue) | May 26 | Programmatic `/alternatives/[slug]` (15 pages) + 20 hand-picked `/compare/[pair]` pages. |
| 10 (Wed) | May 27 | Filter UI (`FilterBar.tsx`) + Pagefind. FAQ JSON-LD pass on the 5 launch listings with real Q&A. |
| 11 (Thu) | May 28 | Ship `gigs-sh/gigs-cli` npm package. Install buttons (F12) on homepage. Newsletter signup live. Plausible installed. |
| 12 (Fri) | May 29 | Submit MCP server to Anthropic Desktop Extensions + ChatGPT Connectors. Outreach drafts (Don Gossen / Alex Salazar / Manny Medina). |
| 13–14 (weekend) | May 30–31 | Launch thread on X. Soft Product Hunt submission. Hand-share in MCP Discord, Cerebral Valley Slack, AI Tinkerers. Hook: *"the first registry whose entries can be deployed by an agent."* |

---

## 11. Setup state

### Locked in (May 17, 2026)
- **Vercel account:** existing Pro account. Project name: `gigs-sh`.
- **GitHub repo:** `github.com/shawnpang/gigs-sh` (this repo).
- **GitHub org:** `gigs-sh` for sibling repos (`polymarket-starter`, `gigs-cli`).
- **Brand posture:** fully independent.
- **Domain:** `gigs.sh` owned on Porkbun.

### Still open (non-blocking for scaffold)
- **Newsletter provider:** default Loops free tier; alternative is Resend Audiences or Beehiiv.
- **X / Twitter handle:** reserve `@gigs_sh` or `@gigsdotsh` before launch.
- **Logo / favicon:** plain wordmark works for v1; iterate post-launch.
- **Legal disclaimer language** for the Polymarket starter README (default boilerplate is OK; consider counsel review pre-launch).

---

## 12. Launch checklist (Day 14)

- [ ] All 10 required listings live, each with `verifiedAt` ≤ 14 days old.
- [ ] `/p/polymarket` template section live with working Deploy-to-Railway button (verified end-to-end).
- [ ] MCP server passes `tools/list` + `tools/call` for all 7 tools from Claude Desktop + Cursor.
- [ ] All 5 agent-readable surfaces (MCP, REST, Agent Card, agents.json, llms.txt) reachable + validated.
- [ ] `gigs` CLI published to npm; `npx gigs find prediction-market` works.
- [ ] Install buttons render on homepage with correct deeplinks.
- [ ] Newsletter signup live; first broadcast template drafted.
- [ ] Plausible installed; all 6 tracked events firing.
- [ ] Anthropic Desktop Extensions submission filed.
- [ ] ChatGPT Connectors submission filed.
- [ ] Launch thread drafted; Product Hunt submission queued.
- [ ] Cold outreach drafts sent (Gossen / Salazar / Medina).

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| **Polymarket starter legal exposure** (publishing code that places real-money trades) | Bare-bones starter + visible disclaimer + MIT license + no return claims. Counsel review pre-launch. |
| **Duplicate-content penalty** from embedding GitHub README on listing page | 70/30 editorial-to-rendered ratio + `rel=canonical` to gigs.sh + only embed install section, not full README. |
| **MCP tool spam** by bot clients hitting `tools/list` repeatedly | Vercel edge rate limit (120 req/min/IP) + log volume monitoring. |
| **Stale `verifiedAt`** on listings drifting beyond 60 days post-launch | Manual review pass at day 30. v2 introduces automated platform health checks. |
| **No early adoption** — site launches and nothing happens | Founder outreach + MCP Discord hand-share + Product Hunt + launch thread on X. Plan B: paid distribution via X ads scoped to AI/agent-dev keywords (~$200 test budget). |
| **Railway template button breaks** (Railway API changes) | Render fallback in README; Vercel cron health-check pings the Railway deploy URL nightly. |

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

- **Additional agent templates** beyond Polymarket: Hyperliquid bot, Bittensor miner, Olas agent config, X-Creator content bot, etc.
- **`submit_gig` MCP tool** with GitHub OAuth → PR-to-content-repo. **Target: ~30 days post-launch** (need ≥5 inbound submissions per slot before opening the gate).
- **Verified on-chain earnings leaderboard.** The real moat play. Defer until ≥3 templates exist and wallet-level signal is meaningful.
- **Auto-discovery cron** sweeping `.well-known/` on seed domains for new candidate listings.
- **Yield Estimator** — input compute budget → expected $/mo per platform.
- **Weekly "Agent Mining Report"** newsletter format.
- **Reputation / uptime monitoring** on listing endpoints.
- **User accounts** / saved gigs / personalized recommendations.
- **Paid features:** sponsored placement, premium intelligence, API key tier.
- **Agent-side authentication** for paid MCP tier (e.g., on-demand verification calls).
- **`gigs install <slug>` CLI subcommand** that wraps the Railway deploy flow.

---

## 16. Open questions (to resolve before / during build)

| Q | Owner | Resolve by |
|---|---|---|
| Newsletter provider — Loops vs. Resend Audiences vs. Beehiiv? | Shawn | Week 2 |
| X/Twitter handle for the brand | Shawn | Pre-launch |
| Exact wording of Polymarket starter legal disclaimer | Shawn (+ counsel) | Pre-launch |
| Logo design: wordmark only at v1? | Shawn | Pre-launch |
| Should `gigs.sh/p/[slug]/template` be a separate route or just an anchor on `/p/[slug]`? | Shawn + Claude | Day 7 (when building TemplateSection) |
| Public `template-v1.json` JSON Schema published to `/schemas/`? | Shawn | Day 7 |

---

*Single source of truth for the v1 build. When a decision changes, update this document — don't shadow it in another file.*
