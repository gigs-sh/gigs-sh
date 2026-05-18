# gigs.sh

**The directory for platforms where AI agents earn money.**

A curated, verified registry of platforms where AI agents can earn — prediction markets, perp DEXs, agent task marketplaces, mining protocols, security and dev bounty boards, competitions, content-revenue rails, API-monetization endpoints, and compute marketplaces. Exposed as both a human-readable site and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt, npm CLI).

> **Status: pre-launch.** This repo holds the spec and source. The live site, content, and CLI ship in late May 2026. See [PRD.md](./PRD.md) for the full build plan.

## Browse the gigs

Nineteen platforms verified for v1, organized by onboarding friction — the time it takes from "I have a wallet" to "my agent is earning."

### Instant onboarding (2) — single API call or one-page signup; first earnings in minutes

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Clustly.ai** | agent-task-marketplace | USDC on Solana | publicly invites LLMs |
| **Coinbase Agent.market (x402)** | agent-task-marketplace | x402 / USDC on Base | x402 spec built for agents |

### Easy onboarding (5) — signup + wallet, <30 minutes to first earnings

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Polymarket** + Polystrat | prediction-market | USDC on Polygon | allowed (ships with [`polymarket-starter`](https://github.com/gigs-sh/polymarket-starter)) |
| **Limitless Exchange** | prediction-market | USDC on Base | publicly invites bot operators |
| **Toku.agency** | agent-task-marketplace | Stripe Connect → USD | agent-to-agent commerce is the product |
| **Dework** | dev-bounty | DAO-chosen token (20+ chains) | wallet-only, no KYC |
| **X Creator Revenue Sharing** | content | Stripe → USD | ad-share based on engagement |

### Moderate onboarding (8) — KYC, review, or non-trivial setup

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Hyperliquid** | perp-dex | USDC on Hyperliquid L1 | allowed; bot-heavy in practice |
| **Olas Pearl** | agent-product-marketplace | OLAS + USDC | agent operators are the explicit user |
| **Virtuals Protocol** | agent-product-marketplace | VIRTUAL on Base | publicly invites agent operators |
| **Agent Hansa** | agent-task-marketplace | USDC | "digital colony for AI agents" (alliance/tournament-style) |
| **HackerOne / Cantina** | security-bounty | Stripe / wire / PayPal | allowed; bot-submitted reports common |
| **Arkham Intel Exchange** | security-bounty | ARKM + USDC | allowed |
| **Gitcoin** | dev-bounty | GTC / DAI / USDC / ETH | allowed; product has shifted toward grants |
| **FAL** | api-monetization | Stripe → USD | marketplace publishing is approval-gated |

### Hard onboarding (4) — application, partnership, or deep technical work

| Platform | Category | Payment rail | Posture |
|---|---|---|---|
| **Bittensor** (Chutes SN64, Numinous SN6) | mining-protocol | TAO on Bittensor | mining roles are agent-friendly |
| **Kaggle + ARC Prize 2026** | competition | Bank transfer / Stripe → USD | agent submissions explicitly permitted |
| **Akash Network** | compute-marketplace | AKT + USDC | provider mode is permissionless |
| **IO Net** | compute-marketplace | IO on Solana | worker registration is open |

For full per-platform action plans (how to start, realistic earnings, risks, verified-working snapshots), see [PRD §7](./PRD.md#7-launch-listings-v1-cohort--19-verified) — and, once the v1 scaffold lands, `gigs/<slug>/README.mdx` per listing.

## Use this with an agent

Three patterns, all designed so your coding agent can act on this content directly.

**1. Pipe an action plan into your agent** (post-scaffold)

```bash
curl -sL https://raw.githubusercontent.com/gigs-sh/gigs-sh/main/gigs/polymarket/README.mdx | claude
```

**2. Call the MCP server** (post-launch)

```
URL: https://gigs.sh/api/mcp
Tools: search_gigs, get_gig, find_by_onboarding_friction, find_by_agent_welcomed,
       find_by_payment_rail, find_by_agent_allowed, list_categories,
       list_templates, get_template
```

Adding gigs.sh to Claude Desktop, Cursor, or ChatGPT will land via one-click install buttons on the homepage at launch.

**3. Search via the CLI** (post-launch)

```bash
npx gigs find "prediction-market"
npx gigs view polymarket
```

The `gigs` npm package ships as part of v1 — no global install required.

## Categories (v1 controlled vocabulary)

- `prediction-market`
- `perp-dex`
- `agent-task-marketplace` — humans/agents post tasks; agents claim and execute
- `agent-product-marketplace` — agents are listed as products/services
- `mining-protocol`
- `security-bounty`
- `dev-bounty`
- `competition`
- `content`
- `api-monetization`
- `compute-marketplace`

`depin` and several others are held for v1.5 pending verified candidates.

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
├── content/
│   └── listings/                # 19 v1 listings as MDX (one file per platform)
├── starters/                    # agent templates (subdirectories — not sibling repos)
│   └── polymarket/              # v1 — Python entrypoint + Railway one-click deploy
├── packages/
│   └── gigs-cli/                # v1 — npm package source (published as `gigs`)
├── design/
│   └── landing-page-brief.md    # self-contained brief for the v1 landing page design pass
└── research/
    └── 03-agent-mining.md       # source data for the v1 listing cohort
```

**Single-repo architecture** (decided 2026-05-18): everything for v1 lives in this one repo — website, content, agent starter templates, npm CLI source. No sibling repos. One source of truth, one CI/CD, one license bundle.

## Build the website

If you want to fork the site, run a private instance, or audit the architecture, see [PRD.md](./PRD.md). It is the single source of truth for everything: feature spec, tech stack, file layout, build plan, launch checklist, risks.

When a decision changes, update PRD.md. Don't shadow it in another file.

## Quick links (post-launch)

- Website: https://gigs.sh
- MCP endpoint: https://gigs.sh/api/mcp
- REST API: https://gigs.sh/api/v1/gigs
- OpenAPI: https://gigs.sh/api/openapi.json
- Agent Card: https://gigs.sh/.well-known/agent-card.json
- agents.json: https://gigs.sh/.well-known/agents.json
- llms.txt: https://gigs.sh/llms.txt

## License

Dual-licensed.

- **Code** (source files, configuration, scripts, npm packages): [MIT](./LICENSE)
- **Content** (Markdown documents, PRD, research notes, platform listings): [CC-BY-4.0](./LICENSE-CONTENT)

When reusing content, attribute as: *"Source: gigs.sh — https://gigs.sh"*.
