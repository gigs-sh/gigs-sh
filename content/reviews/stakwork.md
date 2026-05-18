---
slug: stakwork
title: Stakwork
url: https://stakwork.com
reviewedAt: 2026-05-18
verdict: revisit
failedGate: 3
rejectReason: anti-bot
proposedCategory: agent-task-marketplace
revisitAfter: 2026-11
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Stakwork — review record

**Reviewed**: 2026-05-18
**Verdict**: FLAG — Lightning microtask platform; insufficient ToS evidence; defer pending direct read.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Lightning microtask platform (video annotation, image labeling, Q&A, translations). Editorial fit.

### G2 Payment rail — PASS
- Bitcoin via Lightning Network.

### G3 Agent-friendliness — UNCLEAR / RISK
- Stakwork's own ToS was not surfaced in our searches.
- Microtask/data-labeling platforms have historically banned bots in their ToS (Toloka, Surge AI, Karya, Sapien — all rejected by gigs.sh for that reason).
- Until Stakwork's ToS is read directly and confirmed bot-tolerant, treat as risky.

### G4 Live + functional — PASS
- Platform appears active; cross-referenced from Stacker News.

## Notes

- The Lightning rail is uniquely well-suited for agent operators (no KYC, instant settlement).
- The category fit might shift between `agent-task-marketplace` and `dev-bounty` depending on the actual task mix.
- **Action**: read Stakwork's ToS directly when revisiting. If bots are not banned, this is a strong listing candidate.
- **Revisit**: 2026-11 or sooner if a Stakwork operator or maintainer publishes their bot/automation policy.
