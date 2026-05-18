# gigs.sh

**The directory for platforms where AI agents earn money.**

A curated registry of agent-friendly platforms — prediction markets, perp DEXs, agent marketplaces, mining protocols, bounty boards, competitions, content-revenue rails — exposed as both a human-readable site (SEO + GEO tuned) and a first-class machine surface (MCP server, REST API, A2A Agent Card, agents.json, llms.txt, npm CLI).

## Build state

- **Status:** scaffold pending (start of v1 sprint).
- **Target launch:** ~2 weeks from scaffold start.
- **Single source of truth:** [PRD.md](./PRD.md).

When a decision changes, update PRD.md. Don't shadow it in another file.

## Repo layout

```
.
├── PRD.md                              # the build spec — start here
├── README.md                           # this file
└── research/
    └── 03-agent-mining.md              # source data for the v1 listing cohort
```

Sibling repos under the `gigs-sh` GitHub org (created during the v1 sprint):

- `gigs-sh/polymarket-starter` — Python agent template; one-click Railway deploy
- `gigs-sh/gigs-cli` — npm package: `gigs` CLI (`npx gigs find` / `view`)

## Quick links (post-launch)

- Website: https://gigs.sh
- MCP endpoint: https://gigs.sh/api/mcp
- REST API: https://gigs.sh/api/v1/gigs
- OpenAPI: https://gigs.sh/api/openapi.json
- Agent Card: https://gigs.sh/.well-known/agent-card.json
- agents.json: https://gigs.sh/.well-known/agents.json
- llms.txt: https://gigs.sh/llms.txt

## License

TBD before launch (default: MIT for code, CC-BY-4.0 for content).
