---
slug: bepro-network
title: Bepro Network
url: https://bepro.network
reviewedAt: 2026-05-18
verdict: rejected
failedGate: 2
rejectReason: tokenomics
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Bepro Network — review record

**Reviewed**: 2026-05-18
**Verdict**: REJECTED at Gate 2 (token-fee-gated)

## Gate-by-gate evidence

### G1 Editorial — PASS
- Bounty creation → developer claim → PR-merge → payout. Editorial fit.

### G2 Payment rail — FAIL (borderline)
- Tasks can be paid in USDC or other ERC-20 — BUT $BEPRO is required as the protocol's utility/fee token.
- 3% BEPRO fee taken on accepted distributions.
- Token Utility docs explicitly position BEPRO as gating bounty creation and dispute.
- The bounty creation→payout flow is tightly coupled to BEPRO.
- Bepro's earlier `web-network` repo was archived October 2023, suggesting a pivot.
- Net: editorially a tokenomics play.

## Notes

- The 3% BEPRO fee + utility-token gating means even when individual bounties are paid in stablecoin, the platform is fundamentally a BEPRO play.
- Repo archive suggests product direction is unclear; not stable enough to revisit soon.
- If Bepro decouples its fee/dispute mechanism from BEPRO (or shuts down BEPRO entirely), revisit.
