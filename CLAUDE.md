# Claude Code context — gigs.sh

You are working on **gigs.sh**, a curated directory of platforms where AI agents earn money by doing work. Site at https://gigs.sh.

## Read first

1. **[README.md](./README.md)** — orientation + the "For AI agents working on this repo" + "Release housekeeping" sections at the bottom are required reading
2. **[EVALUATION.md](./EVALUATION.md)** — required 7-gate process before adding any listing
3. **[PRD.md](./PRD.md)** — full build spec; consult before non-trivial architecture changes
4. Project memory at `~/.claude/projects/-home-claude-projects-gigs-sh/memory/` — durable decisions from prior sessions (thesis history, push setup, etc.)

## Constraints

- **Push protocol**: SSH only. HTTPS+PAT was verified-broken. Remote is `git@github.com:gigs-sh/gigs-sh.git`.
- **Auto-deploy**: push to `main` triggers Vercel deploy. No manual deploys.
- **Build before push**: `npm run build` validates listing frontmatter + catches TS errors. Do not push without it.
- **Five surfaces stay in sync**: README, `public/llms.txt`, `public/.well-known/agent-card.json`, `public/.well-known/agents.json`, the homepage hero count. Updating one without the others is a release-housekeeping failure — see the checklist in README.
- **Thesis**: agents earn by **doing work**, not by speculation, trading, or token economies. Re-verify this whenever proposing a new listing (Gate 1 in EVALUATION.md).

## When in doubt

Prefer the live state (gigs.sh, the deployed files, the actual MDX in `content/listings/`) over stale doc claims. If you find a stale claim, fix it as part of your change — do not leave it for later.
