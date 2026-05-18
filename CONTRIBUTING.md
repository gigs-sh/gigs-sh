# Contributing to gigs.sh

Thanks for wanting to help. This is a curated, verified directory — quality over quantity. The bar is honest, current, agent-friendly.

## What we want

- **New gig listings** for platforms where AI agents can actually earn, verified against the platform's own docs and ToS.
- **Corrections** to existing listings — outdated payment rails, friction tiers that no longer match reality, agent posture changes after a ToS update.
- **Verified-working snapshots** — receipts that prove a listing's claims (a transaction hash, a payout screenshot with PII redacted, a leaderboard link, a successful API call log).

## What we don't list

These are hard exclusions. Submissions that violate any of them will be closed.

- **Platforms whose ToS prohibits AI agents, bots, or automation.** Listing such a platform would mislead users into account bans. Examples already verified-out: Civitai (ToS §11.4/§11.9 explicitly), Grass (anti-bot filtering).
- **Platforms with no real payout mechanism for the agent operator.** "You can publish a model" is not earning if the platform keeps all the revenue. Examples already verified-out: Replicate, Hugging Face Inference Endpoints.
- **Platforms requiring human-only identity verification at registration with no exemption.** KYC at payout time is OK; KYC at signup that no agent can complete is not. Example already verified-out: GitHub Sponsors.
- **MLMs, pyramid schemes, "referral-only" platforms** where the only real earning path is recruiting downstream users.
- **Anything we cannot verify.** If the platform's docs are private, the homepage is opaque, or the team won't answer questions about agent policy, it doesn't ship.

## How to submit a new gig (pre-scaffold)

Until the v1 scaffold lands (`content/listings/` and the Velite content model), the submission flow is GitHub Issues:

1. Open an issue at https://github.com/gigs-sh/gigs-sh/issues with title `[gig] <Platform Name>`.
2. Include all of:
   - Platform URL
   - Category (from [the v1 controlled vocabulary](./README.md#categories-v1-controlled-vocabulary))
   - Payment rail (token + chain, or fiat + processor)
   - Agent posture: `welcomed` / `allowed` / `tolerated` / `unclear` / `prohibited` — with a citation to the specific ToS clause or homepage copy
   - Onboarding friction: `instant` / `easy` / `moderate` / `hard` — with a step-by-step from zero-account to first earning
   - Realistic earning range (or "unknown" if no public data)
   - Red flags (KYC, country restrictions, ToS gotchas, token volatility, payout delays)
3. We verify independently before listing. Submissions that pass verification become PRs against `content/listings/` once the scaffold exists.

## How to submit a new gig (post-scaffold)

Once `content/listings/` exists, the flow becomes:

1. Copy `gigs/_TEMPLATE/README.mdx` to `gigs/<your-slug>/README.mdx`.
2. Fill the frontmatter — all fields are Zod-validated at build time and the build will fail if any are missing or malformed.
3. Write the six body sections per the PRD's listing template: *what is it / how agents earn / realistic earning range / action plan / risks / verified-working snapshot*.
4. Add a verified-working artifact (screenshot, transaction link, API call log) in `gigs/<your-slug>/screenshots/` or referenced inline.
5. Open a PR. Title format: `[gig] Add <Platform Name>`.

PRs are reviewed for accuracy, ToS verification, and consistency. We do not merge stale-on-arrival listings — the `verifiedAt` field must be within the last 30 days at merge time.

## How to submit a correction

Open a PR against the relevant `gigs/<slug>/README.mdx` with the change plus a citation to the source. Title format: `[fix] <Platform>: <one-line summary>`.

## Style & quality bar

- **Honest claims only.** Don't fabricate earning ranges, don't invent agent-posture language the platform never used. If something is unknown, write "unknown."
- **Cite primary sources.** ToS sections by number, homepage banner text in quotes, leaderboard URLs, transaction hashes.
- **Editorial body is 200–400 words.** Long enough to be substantive; short enough that agents and humans can consume it in one read.
- **No marketing voice.** Wikipedia-style declarative writing. No "revolutionary," "game-changing," "next-gen."
- **Action plan is numbered and runnable.** A reader should be able to copy the steps and follow them. No vagueness.

## Code contributions

The website code (Next.js, Tailwind, components, MCP server, CLI) lives in this repo. Until the v1 scaffold lands there's nothing to build against. After scaffold:

- Open an issue first for non-trivial changes.
- Match the existing code style (Prettier, ESLint enforced in CI).
- Tests pass; types compile cleanly under strict.
- No new top-level dependencies without a `why` in the PR description.

## License

Contributions are accepted under the dual license of the repository:

- Code contributions → MIT ([LICENSE](./LICENSE))
- Content contributions → CC-BY-4.0 ([LICENSE-CONTENT](./LICENSE-CONTENT))

By opening a PR you confirm you have the right to contribute the material and agree to license it under these terms.
