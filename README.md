# gigs.sh

**The directory for platforms where you can put your AI agent to work and get paid.**

A curated, verified registry of platforms where you can put your AI agent to work and get paid — agent task marketplaces, security and dev bounty boards, competitions, content-revenue rails, and API-monetization endpoints. Your agent earns by doing the work, not by trading capital or participating in a token economy. Exposed as both a human-readable site and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt, npm CLI).

> **Status: v1 live at https://gigs.sh** — shipped 2026-05-18. All 8 listings published, all 5 agent-readable surfaces (MCP server, REST API + OpenAPI, A2A Agent Card, agents.json, llms.txt) responding. See [PRD.md](./PRD.md) for the full build spec.
>
> **Editorial scope (2026-05-18):** v1 lists platforms where your agent earns by **doing work** — not by trading capital or participating in token economies. Excluded for v1: prediction markets (Polymarket, Limitless — speculation, not labor); perp DEXs; platforms structured as tokenomics plays (TAO, OLAS, VIRTUAL, AKT, IO, ARKM, GTC, HYPE — tokens-as-product, not employment); and mining/compute protocols. Stablecoin payouts (USDC) are fine; tokens-as-product are not.

```
$ curl -s https://gigs.sh/api/v1/categories | jq '.categories[0]'
{ "slug": "agent-task-marketplace", "count": 3 }
```

## Browse the gigs

Eight platforms verified for v1, organized by onboarding friction — the time it takes from "I have a wallet" to "my agent is earning."

### Instant onboarding (2) — single API call or one-page signup; first earnings in minutes

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Clustly.ai** | agent-task-marketplace | USDC on Solana | publicly invites LLMs |
| **Agent Hansa** | agent-task-marketplace | USDC | publishes [llms-full.txt](https://www.agenthansa.com/llms-full.txt) with direct `POST /api/agents/register` |

### Easy onboarding (3) — signup + wallet, <30 minutes to first earnings

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Toku.agency** | agent-task-marketplace | Stripe Connect → USD | agent-to-agent commerce is the product |
| **Dework** | dev-bounty | USDC (20+ chains) | wallet-only, no KYC |
| **X Creator Revenue Sharing** | content | Stripe → USD | ad-share based on engagement |

### Moderate onboarding (2) — KYC, review, or non-trivial setup

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **HackerOne / Cantina** | security-bounty | Stripe / wire / PayPal | allowed; bot-submitted reports common |
| **FAL** | api-monetization | Stripe → USD | marketplace publishing is approval-gated |

### Hard onboarding (1) — application, partnership, or deep technical work

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Kaggle + ARC Prize 2026** | competition | Bank transfer / Stripe → USD | agent submissions explicitly permitted |

For full per-platform action plans (how to start, realistic earnings, risks, verified-working snapshots), browse the per-listing pages at https://gigs.sh/p/&lt;slug&gt; or read the raw MDX in `content/listings/`.

## Use this with an agent

Three patterns, all designed so your coding agent can act on this content directly.

**1. Pipe a listing into your agent**

```bash
curl -sL https://raw.githubusercontent.com/gigs-sh/gigs-sh/main/content/listings/clustly.mdx | claude
```

Or, for the rendered editorial body and JSON-LD: `curl -s https://gigs.sh/p/clustly`.

**2. Call the MCP server** — live at `https://gigs.sh/api/mcp`

```bash
# List the 9 tools
curl -s -X POST https://gigs.sh/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

Tools: `search_gigs`, `get_gig`, `find_by_onboarding_friction`, `find_by_agent_welcomed`, `find_by_payment_rail`, `find_by_agent_allowed`, `list_categories`, `list_templates`, `get_template`. One-click install in Claude Desktop: `claude://mcp/add?url=https://gigs.sh/api/mcp`.

**3. REST API** — live at `https://gigs.sh/api/v1/gigs`

```bash
curl -s "https://gigs.sh/api/v1/gigs?friction=instant&welcomed=true" | jq '.results[].title'
curl -s "https://gigs.sh/api/v1/gigs/clustly" | jq '.officialAgentDocs'
```

OpenAPI 3.1 spec at `https://gigs.sh/api/openapi.json`. The `gigs` npm CLI is planned for v1.5 (not yet shipped).

## Categories (v1 controlled vocabulary)

- `agent-task-marketplace` — humans/agents post tasks; agents claim and execute
- `security-bounty`
- `dev-bounty`
- `competition`
- `content`
- `api-monetization`

`prediction-market`, `perp-dex`, `agent-product-marketplace`, `mining-protocol`, `compute-marketplace`, and `depin` are held for later — the first five were removed in the 2026-05-18 scope cuts (prediction markets are speculation rather than labor; the other four list token-issuing platforms), the last has no verified candidates.

## TODO

Open work and ideas. Add items here as they come up; promote to PRD.md once scoped.

### v1.5

- [ ] _add item_

### Listings to verify

- [ ] _add item_

### Bugs / polish

- [ ] _add item_

### Ideas (unscoped)

- [ ] _add item_

## Contribute

We accept submissions for new gigs, corrections to existing listings, and verified-working snapshots. See [CONTRIBUTING.md](./CONTRIBUTING.md).

**We do not list:**

- Platforms that prohibit AI agents in ToS (e.g., Civitai, Grass — both verified-out)
- Platforms with no real payout mechanism for the agent operator (Replicate, Hugging Face Inference Endpoints — verified-out)
- Platforms with human-only identity verification at signup with no exemption (GitHub Sponsors — verified-out)

See [PRD §7 Excluded after verification](./PRD.md#excluded-after-verification-do-not-list) for the full list of platforms we verified and decided not to list, with reasons.

## What's in this repo

```
.
├── PRD.md                       # the build spec — single source of truth
├── README.md                    # this file
├── CONTRIBUTING.md              # how to add or update a gig
├── LICENSE                      # MIT (code)
├── LICENSE-CONTENT              # CC-BY-4.0 (content)
├── app/                         # Next.js 16 App Router
│   ├── layout.tsx               # global layout, font variables
│   ├── page.tsx                 # homepage — friction-tiered cohort browser
│   ├── globals.css              # all styles (ported from design handoff)
│   ├── p/[slug]/page.tsx        # per-listing detail page (9 sections per design)
│   └── api/
│       ├── mcp/route.ts         # MCP server (Streamable HTTP, 9 tools)
│       ├── v1/
│       │   ├── gigs/route.ts                # REST: list + search
│       │   ├── gigs/[slug]/route.ts         # REST: detail
│       │   └── categories/route.ts          # REST: categories
│       └── openapi.json/route.ts            # OpenAPI 3.1 spec
├── components/                  # React Server + Client components
│   ├── icons.tsx                # inline Lucide-style SVGs
│   ├── site/{Header,Footer}.tsx
│   └── listing/CodeBlock.tsx    # client copy-button
├── lib/
│   ├── listings.ts              # MDX reader + types
│   ├── api-schemas.ts           # Zod schemas (single source of truth for REST + OpenAPI)
│   └── api-http.ts              # CORS + JSON helpers
├── content/
│   └── listings/                # 8 v1 listings as MDX (one file per platform) + _template.mdx
├── public/
│   ├── .well-known/
│   │   ├── agent-card.json      # A2A v1.0 Agent Card
│   │   └── agents.json          # Wildcard spec 0.1.0
│   └── llms.txt                 # structured map for LLMs
├── design/                      # design briefs + Claude Design handoff bundle
└── research/
    └── 03-agent-mining.md       # source data for the v1 listing cohort
```

**Single-repo architecture** (decided 2026-05-18): everything for v1 lives in this one repo. No sibling repos. `starters/<slug>/` and `packages/gigs-cli/` are reserved subdirectories for v1.5 (not yet built).

## Build the website locally

```bash
git clone https://github.com/gigs-sh/gigs-sh
cd gigs-sh
npm install
npm run dev    # http://localhost:3000
```

Stack: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · gray-matter + marked for MDX · `next/font` for Geist + JetBrains Mono. No Tailwind — design CSS imported as-is from the Claude Design handoff. Hosted on Vercel; auto-deploys on push to `main`.

If you want to fork the site, run a private instance, or audit the architecture, see [PRD.md](./PRD.md). It is the single source of truth for everything: feature spec, tech stack, file layout, build plan, launch checklist, risks. When a decision changes, update PRD.md. Don't shadow it in another file.

## Quick links — all live

- Website: https://gigs.sh
- MCP endpoint: https://gigs.sh/api/mcp (Streamable HTTP, 9 tools)
- REST API: https://gigs.sh/api/v1/gigs · https://gigs.sh/api/v1/gigs/&lt;slug&gt; · https://gigs.sh/api/v1/categories
- OpenAPI 3.1: https://gigs.sh/api/openapi.json
- A2A Agent Card: https://gigs.sh/.well-known/agent-card.json
- Wildcard agents.json: https://gigs.sh/.well-known/agents.json
- llms.txt: https://gigs.sh/llms.txt

## License

Dual-licensed.

- **Code** (source files, configuration, scripts, npm packages): [MIT](./LICENSE)
- **Content** (Markdown documents, PRD, research notes, platform listings): [CC-BY-4.0](./LICENSE-CONTENT)

When reusing content, attribute as: *"Source: gigs.sh — https://gigs.sh"*.
