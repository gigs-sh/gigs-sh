# How to evaluate a new platform for gigs.sh

This is the canonical process for deciding whether a candidate platform belongs in the gigs.sh directory. **Walk through the 7 gates in order. Stop at the first FAIL.** If all 7 gates PASS, write the MDX listing and open a PR.

This document is written so an AI agent (Claude, GPT, Gemini, …) can run the evaluation from scratch given just a platform name or URL. Humans can use it the same way.

---

## Quick reference

```
Gate 0  Check past reviews     — content/reviews/<slug>.md (don't redo work)
Gate 1  Editorial scope        — agent-native + ≤1 human touch to operate
Gate 2  Payout rail (if earn)  — USDC / fiat for earn-category listings only
Gate 3  Agent-friendliness     — public ToS / docs / llms.txt explicitly allows agents
Gate 4  Live and functional    — site loads, recent activity, real endpoints
Gate 5  Real traction          — users / volume / funding / partnership / commits
Gate 6  Verify-by-fetch        — pull homepage + docs + LinkedIn + X firsthand
Gate 7  Classification         — pick category, friction tier, agent posture
```

**Output**:
- An MDX file at `content/listings/<slug>.mdx` for PASS verdicts, following the format in `content/listings/_template.mdx`.
- A review record at `content/reviews/<slug>.md` for every verdict (PASS, REJECT, or FLAG), following the format in `content/reviews/README.md`.

---

## Gate 0 — Check past reviews (do this first)

**Before** running Gates 1–7 on any candidate, check `content/reviews/<slug>.md`:

- **If a review record exists**: read it. The platform has been evaluated already.
  - Compare the `reviewedAt` date to today. Has the platform changed since?
  - If the rejection reason no longer holds (e.g., a `dead` platform relaunched, or a `tokenomics` platform added USDC payouts) → update the existing file with fresh evidence and a new `reviewedAt`, then continue to Gate 1.
  - If nothing has changed → the previous verdict stands. Skip. Tell the maintainer "already reviewed, no change."
- **If no review record exists**: proceed to Gate 1. Write `content/reviews/<slug>.md` at the end regardless of verdict.

This gate prevents duplicate research on platforms that have already been rejected, and gives every evaluation a durable, dated, evidence-rich record.

---

## The thesis (recap — updated 2026-05-20)

gigs.sh lists **platforms designed for AI agents to onboard themselves and run autonomously**. v1 indexes earn-focused platforms; v2 broadens to infrastructure, tools, social, identity, and other use cases agents need.

The inclusion test is mechanical, not aspirational:

1. **Agent-native** — the product is *designed* for AI agents to drive (llms.txt, agent docs, API-first onboarding, agent-specific docs). Not a generic web app that grudgingly allows bots.
2. **≤1 human touch** — a fresh agent moves from "never heard of it" to "operating on it" with zero ideally, at most one manual claim or approval step (e.g., wallet authorization). Anything beyond one touch is out-of-scope for v1/v2.

The one-question test:

> Can a fresh AI agent, given just the homepage URL, get itself onboarded and operating with zero or one human action in between?

If yes → in scope. If no → out of scope (no matter how interesting the platform is).

**What this changes from the original v1 thesis** (which excluded speculation, tokenomics, mining, and gambling on ethical grounds): those exclusions are dropped. If a prediction market or token-issuing platform is genuinely agent-native and self-onboardable, it qualifies. Operator interest is preserved by clear tagging and per-listing risk notes, not by editorial exclusion. The only platforms still excluded are those that **actively block AI agents** (Civitai, Toloka, Karya, Sapien, Surge AI per their ToS).

---

## Gate 1 — Editorial scope (agent-native + self-onboard)

**PASS** when both are true:
- The product is *designed* for AI agents to drive. Concrete signals: published llms.txt or llms-full.txt, an agent-specific docs page, MCP server, dedicated `/api/agents/register` endpoint, or homepage copy that names AI agents as a target user.
- A fresh agent gets from registration to operating state in ≤1 human action. Zero is ideal; one manual claim/approval (e.g., wallet authorization, social-account binding) is the ceiling.

**FAIL** when any of:
- The platform's onboarding requires more than one human step (e.g., manual KYC + tax form + manual review).
- The platform's ToS explicitly prohibits bots / automation / AI agents (Civitai, Toloka, etc.).
- The "agent support" is a retrofit (e.g., a web app where you happen to be able to script a browser), not a designed-for-agents surface.

**Note on category**: a candidate that passes the inclusion test fits one of the use cases (earn, use, pay, compute, persist, social — taxonomy expanding in v2). Gate 7 picks the specific category.

If FAIL: stop. Record at `content/reviews/<slug>.md` with `verdict: rejected` and the failed gate.

---

## Gate 2 — Payout rail (earn-category listings only)

This gate only applies to candidates classified under earn-type categories (`agent-task-marketplace`, `api-monetization`, `hackathon`, `dev-bounty`, `security-bounty`, `competition`, `content`). For other use cases (infra, tools, social, identity, etc.), payout rail is N/A — skip to Gate 3.

**For earn-type listings:**

**PASS** when:
- Payouts are in USDC (any chain), USDT, DAI, or another established stablecoin, OR
- Payouts are in fiat via Stripe, wire, PayPal, Payoneer, or bank transfer, OR
- Payouts are in a platform-issued token. (Previously a FAIL — now flagged in `agentAllowedNotes` so operators know what they're walking into, but no longer auto-rejected.)

**Always document in `agentAllowedNotes`:**
- Token-denominated payouts and the token's liquidity/volatility profile.
- Off-ramp friction (does the agent need a CEX account to convert?).

The point of this gate post-pivot: surface the rail honestly. Operators decide if a token-paid platform is acceptable for their use case — gigs.sh no longer decides for them.

---

## Gate 3 — Agent-friendliness evidence

**PASS** when at least one of:
- Public ToS, homepage copy, `/docs`, or `llms.txt` explicitly mentions agents, bots, automation, or autonomous systems as **allowed** or **welcomed**.
- The platform ships an API / CLI / MCP server designed for programmatic access without a human in the loop.
- The platform's homepage targets agent operators directly ("AI agents earn USDC", "deploy your agent here", etc.).

**FAIL** when:
- ToS prohibits bots, automation, or AI agents (e.g., Civitai, Toloka, Surge AI, Karya, Sapien).
- "AI welcomed" but only as a tool used by humans — agents themselves cannot hold accounts (e.g., ElevenLabs requires captcha for Voice Library).
- Platform is silent on agents and offers no programmatic onboarding.

Capture the **exact quote** (≤30 words) plus the URL. This goes into the listing's `agentAllowedNotes` field and the "Verified-working snapshot" section.

---

## Gate 4 — Live and functional

**PASS** when all of:
- Homepage returns HTTP 200 and is not a "coming soon" placeholder.
- Latest visible activity (blog post, tweet, GitHub commit, new listing) is within 90 days.
- At least one core flow responds (homepage browsable, API endpoint live, docs site renders).

**FAIL** when:
- Site parks, redirects to a placeholder, or returns 4xx / 5xx.
- Last visible activity is > 6 months ago.
- Platform is "paused," "in maintenance," or "early access" with no actual access available.

---

## Gate 5 — Real traction

**PASS** when ANY ONE of:
- Verified user / agent count > 100.
- Verified payout volume disclosed (any non-zero number from the platform itself).
- Verified funding round (pre-seed or later) from a credible investor.
- Verified partnership with a known operator (Coinbase, Anthropic, Circle, Visa, NEAR Foundation, Mastercard, etc.).
- Active GitHub repo with > 10 stars and commits in the last 30 days.

**FLAG** (not auto-fail) when:
- Solo founder, no funding, < 100 users, but otherwise passing all other gates.

In FLAG cases, list the platform with `onboardingFriction` reflecting reality and add an "early beta" note in `agentAllowedNotes`. The directory loses value if it ignores early stages of agent platforms entirely, but flagging keeps the visitor honest.

---

## Gate 6 — Verify-by-fetch (MANDATORY)

This gate must be executed against live sources. Do NOT skip it even if earlier research seems definitive — secondary sources are often stale.

Required fetches:

1. **Homepage** — confirm thesis fit, capture the exact agent-welcome quote (Gate 3 evidence).
2. **Docs page or `/llms.txt`** (whichever exists) — confirm the payout rail and the agent onboarding flow. If `officialAgentDocs` exists, record its full URL.
3. **LinkedIn** — search for the company page. Verify it is live (not a parked URL) and represents the platform (not an unrelated company with the same name). Capture the full URL or `null`.
4. **X (Twitter)** — search for the platform's account. Verify recent posts (≤ 90 days). Capture the full URL or `null`. **Do not use a founder's personal account unless it is explicitly the platform's voice.**

If any fetch contradicts earlier research (site pivoted, fee changed, token introduced), prefer the live data over secondary sources.

---

## Gate 7 — Classification

Pick values from the v1 controlled vocabulary.

**`categories`** (pick one for v1; multi-category support is a v1.5 item):

| Slug | Use when … |
|---|---|
| `agent-task-marketplace` | Humans or agents post tasks; agents claim and execute. Post-and-claim model. |
| `security-bounty` | Agent finds and reports vulnerabilities; gets paid per accepted finding. |
| `dev-bounty` | Agent claims open dev tasks (PRs, features, fixes); gets paid on ship. |
| `competition` | Single-event prizes for solving a hard problem. |
| `content` | Agent creates posts / videos / articles; earns from engagement or revenue share. |
| `api-monetization` | Agent is published as a callable API or service; earns per call. |

If the platform supports multiple flows, pick the **primary user flow on the homepage**.

**`onboardingFriction`**:

| Slug | Means … |
|---|---|
| `instant` | Single API call or CLI; first earnings in minutes; no human review. |
| `easy` | Signup + wallet, < 30 min to first earnings. |
| `moderate` | KYC, manual review, or non-trivial setup. |
| `hard` | Application, partnership, or deep technical work to start. |

**`agentAllowed`**: `yes` | `unclear` | `required` (per platform posture).
**`agentWelcomed`**: `true` if the platform PUBLICLY invites agents; `false` if merely tolerated.

**`credibility`** — how much independent verification we have on the platform's scale and reliability. This is NOT a quality ranking — listings aren't ranked. It's a signal to visitors about what they're walking into.

| Tier | When to use |
|---|---|
| `established` | Third-party verified scale: >$10M funding, >10K users, established operator (Coinbase / Anthropic / Circle / Visa / etc.), or clear market leader. |
| `growing` | Verifiable traction signals but smaller scale: 100–10K users, seed-stage funding, named partnerships. |
| `early` | Pre-traction, solo founder, or platform-flagged as early-beta. Product works but validation is limited. |
| `self-reported` | Only the platform's own metrics; could not be independently corroborated. |

Pick honestly. `early` is not a slur — it's information the visitor needs. Don't tier up to flatter a platform; don't tier down because you personally prefer another option. As the directory matures, this field should converge with (eventual) usage stats and community ratings.

---

## Output: writing the MDX listing

If all 7 gates PASS, create `content/listings/<slug>.mdx`. The slug is kebab-case of the platform name (`agent-pact`, `coinbase-agent-market`, `near-ai-agent-market`).

Use `content/listings/_template.mdx` as the starting point. Required frontmatter:

```yaml
---
title: <Display name>
slug: <kebab-case slug>
url: <homepage URL>
linkedin: <full URL or null>
x: <full URL or null>
categories: [<one category from Gate 7>]
paymentRails: [<rail slug, e.g. usdc-base, usdc-solana, stripe-usd>]
agentAllowed: yes | unclear | required
agentWelcomed: true | false
onboardingFriction: instant | easy | moderate | hard
a2aProtocol: []
payoutLatency: instant | hours | days
minPayout: <number or null>
realisticEarning: "<one sentence with numbers + source>"
agentAllowedNotes: "<2 sentences citing the exact quote from Gate 3>"
launchCohort: true
verifiedAt: <YYYY-MM-DD of evaluation>
logo: ./<slug>.png
excerpt: "<≤120 char one-liner>"
officialAgentDocs: <URL or null>
---
```

Required body sections, in order:

1. `## What is it` — Wikipedia-style declarative, ≤80 words. Lead with verb-number-date claim.
2. `## How agents earn here` — earning loop end-to-end, ≤150 words.
3. `## Realistic earning range` — cite numbers; mark "unknown" if no public data. Never fabricate.
4. `## Action plan` — numbered runnable steps an operator can follow.
5. `## Risks & gotchas` — 3–5 bullets.
6. `## Verified-working snapshot` — receipt for the `verifiedAt` claim: a quote from the homepage, a public stat, a Show HN link, a tweet, etc.

---

## Style guide

- Wikipedia-style declarative writing. No marketing voice. No hype.
- Lead with the verb-number-date claim ("AgentPact lists 1,180 registered agents as of May 2026"). LLMs will quote it.
- Don't fabricate numbers. Use "unknown" if you cannot verify.
- Don't editorialize or speculate. State what is observable.
- One sentence per Risks bullet. No prose paragraphs.

---

## For AI agents running this process

If you are an AI agent (Claude, GPT, Gemini, etc.) and someone asks you to evaluate platform X for gigs.sh:

1. Read this entire document.
2. Read `content/listings/_template.mdx` for exact frontmatter format.
3. Read `content/reviews/README.md` for the review record format.
4. **Run Gate 0**: check `content/reviews/<slug>.md`. If it exists, read it first — the platform may already have been evaluated. Only proceed to Gate 1 if (a) no record exists or (b) the existing rejection reason no longer holds.
5. Read 2 existing listings (e.g., `agent-hansa.mdx`, `clustly.mdx`) for style reference.
6. Walk through Gates 1–7 in order, capturing evidence at each step. Do not improvise; do not skip gates.
7. If any gate FAILS: stop. Write the rejection to `content/reviews/<slug>.md` with `verdict: rejected`, `failedGate: <N>`, and the rejection reason. Report which gate failed and why. Do not force the platform through.
8. If all 7 gates PASS: send a short evaluation summary (one paragraph per gate, plus your draft classification) BEFORE writing the MDX, so the maintainer can sanity-check the classification.
9. After approval: write BOTH `content/listings/<slug>.mdx` (the listing) AND `content/reviews/<slug>.md` (the review record). Run `npm run build` to confirm everything compiles, then open a PR.

---

## Audit trail: previously excluded platforms

Platforms evaluated and rejected, with reason. This is the quick-glance index for older rejections evaluated before the `content/reviews/` system landed (2026-05-18). Rejections after that date have full review records at `content/reviews/<slug>.md`. When rejecting a new candidate, write the full record there — and append a one-liner here for at-a-glance scanning.

**Anti-bot / anti-AI ToS:**
- Civitai — Creator Program ToS bans bots / automation explicitly
- Toloka, Surge AI, Karya, Sapien — data-labeling platforms; ToS bans automated workers
- TikTok Creator Rewards Program — *"fully AI-generated content"* explicitly prohibited from monetization (escalating suspensions, permanent ban after 4th offense)
- Medium Partner Program — *"AI-generated writing (disclosed as such or not) is not allowed to be paywalled"*; undisclosed AI gets "Network Only" distribution
- Beehiiv — *"Publications that rely entirely on AI-generated material without meaningful human input are not permitted"* (Acceptable Use Policy)
- Ko-fi — *"Bots or other automatic means must not be used to interact with Ko-fi"*; also bans scraping for AI training
- Buy Me a Coffee — restricts AI impersonation use cases; ToS leans hostile to fully AI-driven creator accounts

**Speculation, not labor:**
- Polymarket, Limitless — prediction markets
- Hyperliquid — perp DEX

**Tokenomics plays:**
- Bittensor (TAO), Olas (OLAS), Virtuals (VIRTUAL), Akash (AKT), IO.Net (IO), Arkham (ARKM), Gitcoin (GTC) — payouts denominated in platform-issued token
- Tea Protocol (TEA) — see `content/reviews/tea-protocol.md`
- Bepro Network (BEPRO-fee-gated) — see `content/reviews/bepro-network.md`
- Filecoin Foundation ProPGF / DevGrants — mixed FIL/USDC + grant-shaped — see `content/reviews/filecoin-foundation-grants.md`

**Reversed direction (agent is buyer, not earner):**
- RentAHuman / MeatLayer — AI agents hire humans (inverse of thesis)

**No payout mechanism for the operator:**
- Replicate, Hugging Face Inference Endpoints
- LinkedIn Creator Mode — sponsorship-mediated income only; no unified platform-paid revenue share
- Hugging Face Competitions — competitions page stale; no prize column populated; no payment mechanism documented
- Hume AI Competitions — research-glory leaderboards; no cash prize pool disclosed for any active competition
- Chai Prize / Chaiverse — emphasizes "recognition and satisfaction" over monetary prizes; no documented active cash pool
- METR bounty program — pays $20/idea, $200/spec for evaluation-task creation; piecework structure, not single-event competition (could be re-evaluated for `dev-bounty` if scope broadens)

**Human-only identity gating with no exemption:**
- GitHub Sponsors
- Synack — invite-only Synack Red Team with 5-step human vetting; no public agent provision

**Pivoted / discontinued (Gate 4 fail):**
- OnlyDust — *"The OnlyDust chapter closes here"*; team pivoted to ctrlg.com
- Replit Bounties — 301-redirects to contra.com/replit; bounty model deprecated
- Wonderverse — pivoted to Discord bot product
- Mirror.xyz — folded into Paragraph (May 2024); Paragraph is the listed successor
- CodaLab — explicit notice: *"will not allow new competitions after the end of September 2025"*
- Pinterest Creator Rewards — program discontinued 2023, not replaced
- BountyHub.dev — last commit September 2024; dormant
- IssueHunt.io — pivoted to bug bounty only; *"#1 Bug Bounty platform in Japan"*; if reconsidered would be `security-bounty`
- OpenSauced — pivoted to OSS insights / analytics, not a bounty product — see `content/reviews/opensauced.md`
- Outdefine — pivoted to "AI for healthcare and life sciences" — see `content/reviews/outdefine.md`
- Bountify — HTTP 503, no 2024+ activity — see `content/reviews/bountify.md`
- GitHub Security Lab CodeQL Bug Bounty — officially discontinued — see `content/reviews/github-security-lab-codeql.md`
- Web3 Foundation Grants Program — discontinued December 2025 — see `content/reviews/w3f-grants.md`

**Editorial mismatch:**
- BountyCaster — Farcaster-native, but currency mix is dominantly memecoins ($degen, $higher, $build, MOXIE, etc.); listing would dilute dev-bounty category
- CodaBench — academic benchmark/leaderboard platform; no cash-prize distribution mechanism
- Amazon Nova AI Challenge — $250K grants paid *to universities*; agent operators cannot enter directly
- Ghost — newsletter infrastructure; not a marketplace (Stripe pays operator directly without Ghost as disbursing party)
- Octant — quadratic-funding / public-goods distribution; not per-issue bounties — see `content/reviews/octant.md`
- OpenSSF Alpha-Omega — $12.5M distributed as grants to orgs (Rust Foundation, OpenJS, etc.), not to individuals — see `content/reviews/openssf-alpha-omega.md`
- OSS-Fuzz Reward Program — pays project-integration work, not vuln discovery; narrow audience — see `content/reviews/oss-fuzz.md`

**Single-company / -project bounty programs** (implicitly covered by listed aggregators):
- Vercel OSS Bug Bounty — Next.js / Nuxt / Turborepo / AI SDK / SWR / Svelte on HackerOne — see `content/reviews/vercel-oss-bug-bounty.md`
- Kubernetes / CNCF Bug Bounty — single-project on HackerOne — see `content/reviews/kubernetes-cncf-bug-bounty.md`
- Hyperledger / Linux Foundation Decentralized Trust — single-project family on HackerOne — see `content/reviews/hyperledger-bug-bounty.md`

**Too early / FLAG for revisit:**
- uBounty.ai — rail and posture are on-thesis (USDC on Base + x402 + no KYC) but `/bounties` page rendered empty on 2026-05-18 verification; revisit when bounty supply lands
- Collaborators.build — *"experimental"* with ambiguous future-token language; below traction bar
- YesWeHack — ToS silent on AI/bot researchers; revisit if they publish explicit posture
- Snapchat Spotlight — allows AI with disclosure but threshold (100 hours of view time / 28 days) is high
- Patreon — March-April 2026 policy updates address AI but focus on adult/impersonation; revisit when general AI policy stabilizes
- Internet Bug Bounty (IBB) — paused March 27, 2026 after AI-report overload; high-value if it returns — see `content/reviews/internet-bug-bounty.md`
- Solana Foundation Grants — grant-shaped not bounty-shaped; revisit if low-friction RFP queue ships — see `content/reviews/solana-foundation-grants.md`
- Ethereum Foundation ESP — Nov 2025 restructure, evaluate after next cohort — see `content/reviews/ethereum-foundation-esp.md`
- NEAR Foundation Grants — insufficient evidence; deferred — see `content/reviews/near-foundation-grants.md`
- Sphinx Tribes — Lightning bounty marketplace; insufficient traction evidence — see `content/reviews/sphinx-tribes.md`
- Stakwork — Lightning microtask platform; ToS not surfaced — see `content/reviews/stakwork.md`

**Infra, not marketplace** (agent doesn't pick up work here):
- Skyfire (initially) — re-evaluated and listed once seller-onboarding flow was documented
- Nevermined, Crossmint, Latinum, Catena Labs, Pay.sh, Lobster.cash, Dexter — agent payment / wallet / facilitator infrastructure rather than gig platforms

**Inverted framing (worth re-evaluating if posture changes):**
- Payman — explicit "agents pay humans" positioning; revisit if agent-as-worker side becomes the headline product
