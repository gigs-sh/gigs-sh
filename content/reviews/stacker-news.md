---
slug: stacker-news
title: Stacker News
url: https://stacker.news
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Stacker News — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED — passes all 7 gates with `growing` credibility.

## Gate-by-gate evidence

### G1 Editorial — PASS
Three overlapping earning flows on the same platform:
1. **Bounty post type** (released 2022): any user posts a question/task with a sat bounty; OP rewards comment authors. Use cases per release thread: "digital/knowledge work (programming, design, writing, podcast editing)" and "specific legal or technical questions."
2. **Stakwork microtask posts** on the SN jobs board, sat-denominated.
3. **SN repo CONTRIBUTING bounty program** (most directly OSS-flavored): 20K sats Good First / 100K Easy / 250K Medium / 500K Medium-Hard / 1M Hard for merged PRs against `stackernews/stacker.news`. Plus 100K-sats minimum responsible-disclosure bounty.

### G2 Payment rail — PASS
- All payouts in **Bitcoin sats over Lightning Network**.
- No platform token.
- Cowboy Credits (CCs) exist for users without an attached wallet but cannot be withdrawn — withdrawable earnings are real Lightning sats.
- FAQ quote: *"all bitcoin payments are denominated in sats and use the Lightning Network."*

### G3 Agent-friendliness — UNCLEAR (lean PASS)
- FAQ does not explicitly address AI/bots.
- Community polices via downzaps rather than ToS bans.
- No anti-bot ToS clause found.
- Lightning's non-custodial design means an agent with a Lightning wallet can sign up and earn without KYC.

### G4 Live + functional — PASS
- Homepage returns HTTP 200, content-length 171,220 bytes — direct curl verified.
- Active feed visible with multi-thousand-sat posts dated current.
- Repo `stackernews/stacker.news` shows v0.1.185 release (Oct 2025), 3,927 commits.

### G5 Real traction — PASS (growing)
- March 2025 stats: 4.5M-sat monthly rewards pool, all-time-high stackers/items/comments.
- 522 GitHub stars on the platform repo.
- Active for ~4 years.
- k00b (founder) extremely active.

### G6 Verify-by-fetch — PASS
- Homepage: https://stacker.news — verified HTTP 200 via curl
- FAQ: https://stacker.news/faq — verified
- Bounty post type release thread: https://stacker.news/items/127070 — verified
- GitHub repo: https://github.com/stackernews/stacker.news — verified
- X: https://x.com/stacker_news — exists
- LinkedIn: NOT FOUND — small FOSS team led by k00b; set to null

### G7 Classification — proposed
- Category: `dev-bounty` (primary OSS-relevant flow)
- Friction: `easy` (attach Lightning wallet, no KYC)
- Posture: `agentAllowed: unclear`, `agentWelcomed: false`
- Credibility: `growing`

## Notes

- The no-KYC + Lightning rail is uniquely well-suited for agent operators among all dev-bounty listings.
- No escrow on community bounties — OP-trust risk. SN repo bounties (operated by the SN team itself) are more reliable.
- Cowboy Credits is a UX gotcha: an agent that doesn't attach a wallet at signup accumulates non-withdrawable credits.
- If the platform ever publishes a comprehensive payout-volume number across all bounty post types, bump to `established`.
