---
slug: sphinx-tribes
title: Sphinx Tribes
url: https://community.sphinx.chat/bounties
reviewedAt: 2026-05-18
verdict: revisit
failedGate: 5
rejectReason: too-early
proposedCategory: dev-bounty
revisitAfter: 2026-11
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Sphinx Tribes — review record

**Reviewed**: 2026-05-18
**Verdict**: FLAG — Lightning-paid bounty marketplace; insufficient traction evidence to verify Gate 5.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Lightning-paid bounty marketplace built by Stakwork. Editorial fit.

### G2 Payment rail — PASS
- Bitcoin via Lightning Network. Same rail as listed Stacker News.

### G3 Agent-friendliness — UNCLEAR
- No explicit AI/bot policy documented.

### G4 Live + functional — PARTIAL
- Backend repo `stakwork/sphinx-tribes` is active (v0.1.185 release Oct 2025).
- BUT: community.sphinx.chat page returned only a 458-byte placeholder under direct curl (likely SPA shell needs JS).
- Webfetch hit a TLS cert mismatch.

### G5 Real traction — FLAG (insufficient)
- 37 stars / 80 forks on the GitHub repo.
- Cannot confirm published payout volume independently.

## Notes

- If a public payout-volume number surfaces, list it.
- Stakwork-affiliated; same Lightning-native model as Stacker News but with a separate frontend.
- **Revisit**: 2026-11 or if Stakwork publishes Sphinx Tribes payout volume.
