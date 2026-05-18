# Review records

Every platform considered for gigs.sh gets a review record here — both **listed**
and **rejected** ones — so future evaluators (human or AI) can:

1. Avoid duplicating research that has already been done
2. See *why* a platform was rejected, with the evidence captured at decision time
3. Decide whether a rejection still holds, or if new information warrants re-review
4. Track which platforms are flagged for future revisits

This complements (not replaces) the editorial listings in `content/listings/`.
Listings are agent-facing recommendations; reviews are the audit trail behind them.

---

## File format

One file per platform. Filename = platform slug (kebab-case).

```yaml
---
slug: <platform-slug>
title: <Display name>
url: <homepage URL>
reviewedAt: <YYYY-MM-DD>
verdict: listed | rejected | revisit
failedGate: <1-7 or null>           # null if listed; 1-7 for the gate that ended evaluation
rejectReason: <enum below or null>  # null if listed
proposedCategory: <category or null>
revisitAfter: <YYYY-MM or null>     # optional — when to re-check, if revisit-worthy
reviewer: <session label, e.g. "claude-opus-4.7 / round-2"  >
---

# <Title> — review record

**Reviewed**: <date>
**Verdict**: LISTED | REJECTED at Gate N | FLAG for revisit

## Gate-by-gate evidence

### G1 Editorial — PASS / FAIL / not-evaluated
- evidence
- citation URL

### G2 Payment rail — PASS / FAIL / not-evaluated
- ...

### G3 Agent-friendliness — PASS / FAIL / not-evaluated
- ...

### G4 Live + functional — PASS / FAIL / not-evaluated
- ...

### G5 Real traction — PASS / FAIL / not-evaluated
- ...

### G6 Verify-by-fetch — PASS / FAIL / not-evaluated
- URLs checked + dates

### G7 Classification — proposed (if listed)
- category, friction, posture, credibility

## Notes
- Free-form observations: edge cases, future revisit triggers, related platforms
```

## rejectReason enum

Use one of these so the audit trail is filterable:

| Value | Meaning |
|---|---|
| `tokenomics` | Payouts denominated in platform-issued token (Gate 2 fail) |
| `pivoted` | Platform changed business model and no longer fits (Gate 4 fail) |
| `dead` | Site down / no recent activity / shut down (Gate 4 fail) |
| `anti-bot` | ToS explicitly bans bots or AI agents (Gate 3 fail) |
| `inverted` | Agent is the buyer not the earner (Gate 1 fail) |
| `too-early` | Site live but no real traction / empty bounty pool (Gate 5 flag) |
| `infrastructure` | Payment/wallet/facilitator infra, not a gig marketplace (Gate 1 fail) |
| `speculation` | Prediction market / perp DEX / mining / capital deployment (Gate 1 fail) |
| `editorial-mismatch` | Real product but doesn't fit the directory's thesis |
| `single-company` | One-company bug-bounty program; already implicitly covered by an aggregator |
| `no-payment-mechanism` | Honors / leaderboards only; no cash payout |
| `human-only` | Hard human-identity gating without exemption (Gate 3 fail) |

## Workflow integration

Before researching ANY new platform candidate, the first step (Gate 0) is:

1. Check `content/reviews/<slug>.md` — does a record already exist?
2. If yes: read it. Has anything changed since `reviewedAt`?
   - If the rejection reason no longer holds → update the existing file with new evidence and a new `reviewedAt`
   - If nothing has changed → skip; the rejection still stands
3. If no: proceed with the 7-gate evaluation per [EVALUATION.md](../../EVALUATION.md). At the end, write the review file here regardless of verdict.

For PASS verdicts, also write the listing MDX in `content/listings/<slug>.mdx`
as usual.

## Backfill status

This system was introduced 2026-05-18 alongside the directory expansion from
40 → 46 listings. **Review records exist for platforms evaluated 2026-05-18
and later.** Platforms listed before that date have their gate evidence
captured in the listing MDX itself (`agentAllowedNotes`, `verifiedAt`, and
the "Verified-working snapshot" body section); review files can be backfilled
opportunistically when a maintainer next re-verifies those platforms.

The one-line audit trail at the bottom of [EVALUATION.md](../../EVALUATION.md)
remains the quick-glance index of older rejections.
