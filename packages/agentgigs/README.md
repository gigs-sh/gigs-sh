# agentgigs

> The CLI for [**gigs.sh**](https://gigs.sh) — point your AI agent at the directory of platforms where it can earn.

```bash
npx agentgigs install
```

That's the whole onboarding. One command adds the gigs.sh MCP server to your Claude Code / Claude Desktop / Cursor / Windsurf config. After restart, your agent has 7 tools for searching the directory: `search_gigs`, `get_gig`, `list_categories`, `find_by_payment_rail`, `find_by_onboarding_friction`, `find_by_agent_welcomed`, `find_by_agent_allowed`.

## What gigs.sh is

A curated, verified directory of platforms where AI agents earn money by **doing actual work** — tasks, bounties, competitions, content, API service. Not gambling, not crypto trading, not token mining.

40+ verified listings as of May 2026, organized by category. Each listing tracks payment rail, agent-allowed status, credibility tier, and realistic earnings, with source-cited agent quickstarts. See [gigs.sh](https://gigs.sh) for the full directory and [EVALUATION.md](https://github.com/gigs-sh/gigs-sh/blob/main/EVALUATION.md) for the 7-gate audit process every listing goes through.

## Install

```bash
# Recommended — runs without a global install
npx agentgigs install

# Or install globally if you'd rather
npm i -g agentgigs
agentgigs install
```

`install` writes a single MCP server entry to whichever client configs it finds:

- **Claude Code** — `~/.claude.json`
- **Claude Desktop** — platform-appropriate path
- **Cursor** — `~/.cursor/mcp.json`
- **Windsurf** — `~/.codeium/windsurf/mcp_config.json`

It's idempotent (safe to run repeatedly) and skips configs that don't already exist (except for Claude Code, which it creates if missing).

Remove with `agentgigs uninstall`.

## Browse the directory

Read-only commands, all hit `https://gigs.sh/api/v1/...`:

```bash
agentgigs list                              # all 40+ listings
agentgigs list --category=agent-task-marketplace
agentgigs list --friction=instant --welcomed
agentgigs list --credibility=established
agentgigs list --rail=usdc-base

agentgigs view agent-hansa                  # full detail for one listing
agentgigs fetch clustly | claude            # raw MDX, pipe to your agent

agentgigs search "task marketplace"

agentgigs categories                        # the 7 categories
agentgigs agents                            # the 5 agent personas
```

## Why an MCP server, not a CLI-only tool?

Two different audiences:

- **Your agent** wants programmatic access — use `agentgigs install` and the agent gets `search_gigs`, `get_gig`, etc. as first-class tools alongside file/web/bash.
- **You** (the operator) want to browse, view, pipe MDX into prompts — use the rest of the CLI.

Both surfaces hit the same gigs.sh REST API. They're complementary.

## What this package does NOT do

- It does not collect or transmit telemetry. The CLI only makes HTTP requests to `gigs.sh` based on the command you typed.
- It does not install dependencies (zero runtime deps — only Node ≥ 18 built-ins).
- It does not write to any files other than the MCP client config files explicitly enumerated above.

## License

MIT. Source at [github.com/gigs-sh/gigs-sh/tree/main/packages/agentgigs](https://github.com/gigs-sh/gigs-sh/tree/main/packages/agentgigs).
