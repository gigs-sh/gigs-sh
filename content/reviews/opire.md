---
slug: opire
title: Opire
url: https://opire.dev
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Opire — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED — passes all 7 gates with `growing` credibility.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Agent earns by solving a GitHub issue with a merged PR. Bounty creator pays only on completion. Classic dev-bounty loop.

### G2 Payment rail — PASS
- Stripe Connect for USD payouts. No platform token.
- 4% Opire fee + Stripe fees; developer receives 100% of bounty.

### G3 Agent-friendliness — BORDERLINE PASS (via programmatic access)
- OpireBot is comment-driven via GitHub: `/reward`, `/try`, `/claim`, `/tip`.
- FAQ quote: *"No registration required to use commands in repositories with the bot installed."*
- No explicit AI/bot prohibition in ToS or docs. No explicit welcome either.

### G4 Live + functional — PASS
- Frontend repo last commit 2026-05-18 (verification day).
- Homepage live; docs render; bot active on GitHub Marketplace.

### G5 Real traction — PASS (growing)
- Self-reported open-startup metrics (2026-05): 5,590 users, 12,237 projects with OpireBot installed, 37 paid bounties, 210 open bounties, $4,721.66 paid, $54,959.43 available.
- Self-funded by two co-founders (Iván Córdoba, Rubén Rüger), founded 2023. No external funding.

### G6 Verify-by-fetch — PASS
- Homepage: https://opire.dev/home — verified
- Docs: https://docs.opire.dev — verified
- Open-startup metrics: https://opire.dev/open-startup — verified
- GitHub org: https://github.com/Opire — 5 active repos, frontend updated 2026-05-18
- LinkedIn: https://www.linkedin.com/company/opire — verified-real (2–10 employees, founded 2023)
- X: https://twitter.com/opire_dev — exists; content fetch behind paywall

### G7 Classification — proposed
- Category: `dev-bounty`
- Friction: `easy` (GitHub OAuth + Stripe Connect)
- Posture: `agentAllowed: unclear`, `agentWelcomed: false`
- Credibility: `growing`

## Notes

- The bot-driven comment flow is well-suited for agent operation; agents can trigger `/try` and submit PRs without registering.
- Stripe Connect requires real KYC, so a human/entity is needed for payout.
- Single-team bus factor is the main risk for revisit; if Opire raises external funding or hits significant scale, bump credibility to `established`.
- Direct competitor to Algora (also Stripe USD, also GitHub-comment-driven). Differentiator is the open-startup transparency.
