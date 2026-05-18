---
slug: tea-protocol
title: Tea Protocol
url: https://tea.xyz
reviewedAt: 2026-05-18
verdict: rejected
failedGate: 2
rejectReason: tokenomics
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Tea Protocol — review record

**Reviewed**: 2026-05-18
**Verdict**: REJECTED at Gate 2 (tokenomics)

## Gate-by-gate evidence

### G1 Editorial — PASS
- Tea pays OSS contributors for project work. Loop is "contribute → get paid." Editorial fit.

### G2 Payment rail — FAIL
- Rewards in TEA token; "teaRank" algorithm determines payout size.
- Payout denomination is the platform's own token, which is the canonical Gate 2 fail.
- No USDC or fiat alternative documented.

## Notes

- Founded by Homebrew's creator (Max Howell); ambitious vision but token-denominated.
- If Tea adds a USDC payout option as a default rail (not behind a swap), revisit.
- Currently fits the same exclusion pattern as Bittensor, Olas, Virtuals — strong OSS-funding model but token-as-product.
