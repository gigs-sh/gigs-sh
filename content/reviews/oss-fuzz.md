---
slug: oss-fuzz
title: OSS-Fuzz Reward Program
url: https://google.github.io/oss-fuzz/
reviewedAt: 2026-05-18
verdict: revisit
failedGate: 7
rejectReason: editorial-mismatch
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# OSS-Fuzz Reward Program — review record

**Reviewed**: 2026-05-18
**Verdict**: FLAG — niche fit; pays project-integration work, not vuln-discovery.

## Gate-by-gate evidence

### G1 Editorial — PASS (narrow)
- Pays *project integration* contributors (usually maintainers integrating their own project with OSS-Fuzz). Editorial fit but the contributor base is unusually narrow.

### G2 Payment rail — PASS
- USD payouts via Google p2p-vrp.

### G3 Agent-friendliness — UNCLEAR
- Per-integration work is structural; an agent would need to write actual fuzzer bindings and integrate them with Google's infrastructure.

### G4 Live + functional — PASS
- Active program; $600K paid total to ~65 contributors across the program's life.

### G5 Real traction — PASS (narrow)
- Up to $30K per integration, plus $11,337 for novel sanitizers.

### G7 Classification — Editorial mismatch
- Eligibility is integration-work-shaped, not vuln-discovery-shaped.
- The contributor base is essentially "people willing to land OSS-Fuzz integration PRs" — a narrow audience that overlaps heavily with project maintainers themselves.

## Notes

- If a future revisit decides to broaden the dev-bounty category to include "infrastructure integration work" generally, OSS-Fuzz becomes a clear `dev-bounty` listing.
- Currently doesn't fit any of the 7 categories cleanly — it's not vuln-finding (security-bounty), not a marketplace (dev-bounty), not a competition.
- Worth tracking; if Google ships a per-vuln-found component on top of OSS-Fuzz, that would qualify directly.
