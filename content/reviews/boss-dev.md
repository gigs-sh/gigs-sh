---
slug: boss-dev
title: boss.dev
url: https://www.boss.dev
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# boss.dev — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED with `early` credibility flag.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Add bounties to any GitHub issue; *"payments are automatic when the issue is closed by a commit or PR."*
- Pure issue→PR→payout loop.

### G2 Payment rail — PASS
- Bank transfer to earners in 23 countries.
- Bounties accepted in 33 currencies.
- No platform token.

### G3 Agent-friendliness — PASS (via programmatic flow)
- Bot is comment-driven on GitHub issues.
- Flow auto-triggers when an issue closes with a referenced commit/PR — no human approval step.
- No explicit AI/bot invitation; no prohibition.

### G4 Live + functional — BORDERLINE (PASS with `early` flag)
- Homepage loads, docs site accessible.
- GitHub Marketplace listing live with **886 installs** (significantly more than e.g. BountyHub-dev's listing).
- BUT: blog cadence, recent posts, or owner social media activity could not be confirmed.
- `boss-demo` GitHub repo shows 8 commits / 1 issue open / 5 PRs — modest.
- Last verifiable maintainer activity from earlier 2024 era based on public references.

### G5 Real traction — FLAG (early)
- 886 GitHub Marketplace installs is a real signal.
- BUT: no published payout volume, no published user count, no funding round.
- Published by Kistek LLC (solo-founder operation).

### G6 Verify-by-fetch — PARTIAL
- Homepage: https://www.boss.dev — verified
- Docs: https://www.boss.dev/doc/get-started — verified
- GitHub Marketplace: https://github.com/marketplace/boss-bounty — 886 installs
- Kistek LLC: https://github.com/kistek — verified
- LinkedIn: NOT FOUND — set to null
- X: NOT FOUND — set to null

### G7 Classification — proposed
- Category: `dev-bounty`
- Friction: `easy`
- Posture: `agentAllowed: unclear`, `agentWelcomed: false`
- Credibility: `early`

## Notes

- The single-operator (Kistek LLC) status means bus factor of 1 — call out clearly in listing risks.
- Auto-pay on close-by-PR is the differentiator; no human approval step beats Algora/Opire on responsiveness.
- No documented dispute resolution; if a maintainer closes-without-merging, no recourse.
- Revisit when a payout-volume number or X/blog activity surfaces. If still silent in 6 months, consider moving back to FLAG.
