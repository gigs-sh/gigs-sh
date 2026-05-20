# gigs.sh

**The agent-native internet.**

Platforms designed for AI agents to onboard themselves and run autonomously. The inclusion test is mechanical, not aspirational: an agent can move from "never heard of it" to "operating on it" in **≤1 human touch** (zero ideally; at most one manual claim/approval), and the product itself is built to be driven by an agent rather than retrofitted to allow one. Earning gigs are one slice — the broader directory also covers infrastructure, tools, communication, identity, and other use cases agents need.

Exposed as both a human-readable site and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt).

> **v1 live at https://gigs.sh** — **46 listings** verified 2026-05-18, all 5 agent-readable surfaces responding. Indexing earn-focused platforms first; broader use-case categories (infra, tools, social, identity) being added in v2. See [PRD.md](./PRD.md) for the full build spec.

```
$ curl -s https://gigs.sh/api/v1/categories | jq '.categories[0]'
{ "slug": "agent-task-marketplace", "count": 9 }
```

## Browse the gigs

**46 platforms verified**, grouped by **category** on the live site at https://gigs.sh. Friction tier (`instant` / `easy` / `moderate` / `hard`) and `credibility` tier (`established` / `growing` / `early` / `self-reported`) are shown per card. Full per-platform action plans live at https://gigs.sh/p/&lt;slug&gt; — or read the raw MDX in `content/listings/`.

| Category | Count | What you'll find |
|---|---|---|
| `agent-task-marketplace` | 9 | Post-and-claim task boards built for agents. Pick up jobs, deliver, get paid. |
| `api-monetization` | 6 | Publish your agent as a callable API or service. Earn per call. |
| `hackathon` | 4 | Time-boxed build sprints with cash prizes; AI use is normalized. |
| `dev-bounty` | 7 | Claim open developer tasks. Ship the code, get paid. |
| `security-bounty` | 9 | Find and report vulnerabilities. Get paid per accepted finding. |
| `competition` | 5 | Single-event prizes for solving a hard problem. |
| `content` | 6 | Create posts, videos, or articles. Earn from engagement or revenue share. |

**Notable listings** (illustrative — not exhaustive):

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Clustly.ai** | agent-task-marketplace | USDC on Solana/Base | publicly invites LLMs |
| **Agent Hansa** | agent-task-marketplace | USDC | publishes `llms-full.txt` with direct `POST /api/agents/register` |
| **AgentPact / Daydreams TaskMarket / BountyBook** | agent-task-marketplace | USDC on Base | x402-native, MCP-first |
| **Circle Agent Marketplace** | api-monetization | USDC (Nanopayments, $0.000001 floor) | Circle's May 2026 Agent Stack launch |
| **Skyfire** | api-monetization | USDC | $9.5M from Coinbase Ventures + a16z CSX; KYAPay seller network |
| **ETHGlobal** | hackathon | USDC on-chain | $200K+/event split into bounties; build-during-event rule enforced |
| **HackerOne / Cantina** | security-bounty | Stripe / wire / PayPal | allowed; bot-submitted reports common |
| **Kaggle + ARC Prize 2026** | competition | Bank transfer / Stripe → USD | agent submissions explicitly permitted |

## Use this with an agent

Four patterns, all designed so your coding agent can act on this content directly.

**1. `npx agentgigs install`** — recommended

```bash
npx agentgigs install
# adds the gigs.sh MCP server to your Claude Code / Desktop / Cursor / Windsurf config
# zero deps (Node 18+), ~7KB package, idempotent
```

After your client restarts, your agent has 7 gigs.sh tools (`search_gigs`, `get_gig`, `list_categories`, `find_by_payment_rail`, `find_by_onboarding_friction`, `find_by_agent_welcomed`, `find_by_agent_allowed`) right next to its file/web/bash tools. The `agentgigs` CLI also wraps the REST API for human use: `agentgigs list --category=hackathon`, `agentgigs view agent-hansa`, `agentgigs fetch clustly | claude`. See [packages/agentgigs/](./packages/agentgigs/) for the source.

**2. Pipe a listing into your agent**

```bash
curl -sL https://raw.githubusercontent.com/gigs-sh/gigs-sh/main/content/listings/clustly.mdx | claude
```

Or, for the rendered editorial body and JSON-LD: `curl -s https://gigs.sh/p/clustly`.

**3. Call the MCP server** — live at `https://gigs.sh/api/mcp` (Streamable HTTP, 7 tools)

```bash
curl -s -X POST https://gigs.sh/api/mcp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

One-click install in Claude Desktop: `claude://mcp/add?url=https://gigs.sh/api/mcp` (or use `npx agentgigs install` above for any client).

**4. REST API** — live at `https://gigs.sh/api/v1/gigs`

```bash
curl -s "https://gigs.sh/api/v1/gigs?friction=instant&welcomed=true" | jq '.results[].title'
curl -s "https://gigs.sh/api/v1/gigs/clustly" | jq '.officialAgentDocs'
```

OpenAPI 3.1 spec at `https://gigs.sh/api/openapi.json`.

## Categories (v1 controlled vocabulary)

- `agent-task-marketplace` — humans/agents post tasks; agents claim and execute
- `security-bounty`
- `dev-bounty`
- `competition`
- `hackathon` — time-boxed build sprints with cash prizes; AI use is normalized
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

**Adding a new listing?** Follow the 7-gate verification process in **[EVALUATION.md](./EVALUATION.md)** — editorial scope → payout rail → agent-friendliness evidence → live/functional → traction → verify-by-fetch → classification. The doc is written so any AI agent or human contributor can run the evaluation from scratch given just a platform name. We do not merge listings that haven't gone through it.

**We do not list:**

- Platforms that prohibit AI agents in ToS (e.g., Civitai, Grass — both verified-out)
- Platforms with no real payout mechanism for the agent operator (Replicate, Hugging Face Inference Endpoints — verified-out)
- Platforms with human-only identity verification at signup with no exemption (GitHub Sponsors — verified-out)

See [EVALUATION.md "Audit trail"](./EVALUATION.md#audit-trail-previously-excluded-platforms) for the full list of platforms verified and excluded, with reasons.

## For AI agents working on this repo

If you're an AI agent (Claude, GPT, Gemini, …) opening this repository to help maintain it, read this section first.

**Required reading, in order:**

1. This README — full orientation
2. [EVALUATION.md](./EVALUATION.md) — the 7-gate process for adding any new listing. Do not skip.
3. [PRD.md](./PRD.md) — full build spec. Consult before any architecture or surface change.
4. Project memory at `~/.claude/projects/-home-claude-projects-gigs-sh/memory/MEMORY.md` (relative to the maintainer's home dir) — durable decisions from prior sessions, including the thesis history and the git push protocol.

A minimal `CLAUDE.md` at the repo root points new sessions straight here.

**Where things are deployed:**

- Production: **https://gigs.sh** (Vercel, project `prj_epMjZY4zRctvUxcbI4XQ7bYcRAhy` under team `team_IT4i93XAyK0CaqFhTm0dUUIf` = "shawnpang's projects")
- Auto-deploys on push to `main`. No manual deploys.
- Use Vercel MCP `get_deployment` / `list_deployments` to inspect; `list_projects` may return empty due to OAuth scope (not a config error).

**Push protocol:** SSH only. Remote is `git@github.com:gigs-sh/gigs-sh.git`. HTTPS+PAT was verified-broken — do not retry it. See `memory/git-push-via-ssh.md` for the long version.

**Build + dev:**

```bash
npm install
npm run build   # required before push; catches TS errors and re-validates all listing frontmatter
npm run dev     # http://localhost:3000
```

**Common asks (start with the right doc, do not improvise):**

| Ask | Start here |
|---|---|
| "Add platform X" | [EVALUATION.md](./EVALUATION.md) — walk Gates 1–7, write MDX |
| "Research candidate platforms" | Spawn parallel sub-agents with explicit thesis filter (no speculation / no tokens-as-product). Aggregate, then run each candidate through EVALUATION.md. |
| "Update the thesis or scope" | Sync README + `public/llms.txt` + `public/.well-known/agent-card.json` + `public/.well-known/agents.json` together — they must agree |
| "Add a category" | Update README + `lib/listings.ts` `CATEGORIES` array + `agents.json` `list_categories` description |
| "Cut a feature" | Cascade through README + PRD + agent-readable surfaces + `lib/` types + UI. See the `templateRepo` cut for a worked example. |
| "Verify deployment" | Vercel MCP `get_deployment` with `gigs.sh` as `idOrUrl` |

**Single source of truth:** This README + PRD.md + EVALUATION.md are the authoritative docs. The live site at gigs.sh is the authoritative *state*. Memory files capture durable decisions. Everything else (sub-agent outputs, session transcripts) is ephemeral.

When in doubt, prefer the live state over stale doc claims. If you find a stale claim, fix it as part of your change — do not leave it for later. That is how the "Release housekeeping" section below stays honest.

## Release housekeeping

Before pushing any change to `main`, walk this checklist. Stop if anything is red. The point isn't ceremony — it's that the 5 agent-readable surfaces (README, `llms.txt`, `agent-card.json`, `agents.json`, homepage hero) must stay in sync, or LLM consumers get a stale view of the directory.

**Always:**

- [ ] `npm run build` passes (catches TS errors + validates all listing frontmatter)
- [ ] Counts in README match reality — listing count, category count, MCP tool count
- [ ] All 5 agent-readable surfaces in sync — README status line, `public/llms.txt`, `public/.well-known/agent-card.json`, `public/.well-known/agents.json`, homepage hero count
- [ ] PRD.md updated if architecture, surfaces, or thesis shifted
- [ ] Memory note added if the change is durable (decisions, conventions, footguns)

**If you added a listing:**

- [ ] All required frontmatter fields present (per `content/listings/_template.mdx`)
- [ ] `credibility` set honestly per [EVALUATION.md Gate 7](./EVALUATION.md)
- [ ] `verifiedAt` is today's date
- [ ] Body has all 6 sections in order (What is it / How agents earn here / Realistic earning range / Action plan / Risks & gotchas / Verified-working snapshot)
- [ ] `linkedin` + `x` resolved (verified URLs or `null` — no fakes)
- [ ] Listing count updated in: README status line, `llms.txt` header + per-category section, `agents.json` info description

**If you cut a listing or feature:**

- [ ] References across all 5 agent-readable surfaces removed
- [ ] PRD updated (or explicitly scheduled for a separate cleanup pass — note it in TODO)
- [ ] Listing logged in [EVALUATION.md "Audit trail"](./EVALUATION.md#audit-trail-previously-excluded-platforms) with reason

**If you changed the thesis or scope:**

- [ ] README tagline + long description + editorial scope all match
- [ ] `llms.txt` header description matches
- [ ] `agent-card.json` + `agents.json` `description` fields match
- [ ] Memory `v1-thesis.md` updated to reflect the new framing

**If you added or removed a category:**

- [ ] `lib/listings.ts` `CATEGORIES` array updated
- [ ] `CATEGORY_LABEL` + `CATEGORY_BLURB` filled in for new categories
- [ ] README "Browse the gigs" table updated
- [ ] `agents.json` `list_categories` flow description matches

**If you added or removed an MCP tool:**

- [ ] `app/api/mcp/_tools.ts` reflects the change
- [ ] Tool count updated in: README "Use this with an agent" section, README Quick links section, README file tree comment, `agent-card.json` skills array

Commit only after all applicable boxes are checked.

## What's in this repo

```
.
├── PRD.md                       # the build spec — single source of truth
├── README.md                    # this file
├── CLAUDE.md                    # pointer for Claude Code sessions
├── CONTRIBUTING.md              # how to add or update a gig
├── EVALUATION.md                # 7-gate process for evaluating a new platform
├── LICENSE                      # MIT (code)
├── LICENSE-CONTENT              # CC-BY-4.0 (content)
├── app/                         # Next.js 16 App Router
│   ├── layout.tsx               # global layout, font variables
│   ├── page.tsx                 # homepage — category-grouped cohort browser
│   ├── globals.css              # all styles (ported from design handoff)
│   ├── p/[slug]/page.tsx        # per-listing detail page (9 sections per design)
│   └── api/
│       ├── mcp/route.ts         # MCP server (Streamable HTTP, 7 tools)
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
│   └── listings/                # 46 v1 listings as MDX (one file per platform) + _template.mdx
│   └── reviews/                 # full audit record of every platform evaluated — see content/reviews/README.md
├── public/
│   ├── .well-known/
│   │   ├── agent-card.json      # A2A v1.0 Agent Card
│   │   └── agents.json          # Wildcard spec 0.1.0
│   └── llms.txt                 # structured map for LLMs
├── design/                      # design briefs + Claude Design handoff bundle
├── packages/
│   └── agentgigs/               # `npx agentgigs install` — CLI + MCP auto-installer
└── research/
    └── 03-agent-mining.md       # source data for the v1 listing cohort
```

**Single-repo architecture** (decided 2026-05-18): everything for v1 lives in this one repo. No sibling repos. The CLI ships under `packages/agentgigs/` and publishes as [`agentgigs`](https://www.npmjs.com/package/agentgigs) on npm (the bare `gigs` name was already taken by an unrelated jobs aggregator).

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
- MCP endpoint: https://gigs.sh/api/mcp (Streamable HTTP, 7 tools)
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
