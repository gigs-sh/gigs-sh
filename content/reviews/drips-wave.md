---
slug: drips-wave
title: Drips Wave
url: https://www.drips.network/wave
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: dev-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Drips Wave — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED — passes all 7 gates with `established` credibility.

## Gate-by-gate evidence

### G1 Editorial — PASS
- *"Fix, Merge, and Earn."* Contributors earn Points for merged PRs against approved issues, converted to USDC at each ~weekly Wave cycle. Pure deliver-work-to-earn.

### G2 Payment rail — PASS
- Payouts in **USDC on Stellar**.
- Radworks ($RAD) is the parent ecosystem but Wave reward grants are issued in USDC, not RAD.
- Drips protocol itself has no platform token.

### G3 Agent-friendliness — BORDERLINE
- No explicit agent invitation; no explicit prohibition.
- Documentation describes a UI-driven flow.
- Maintainer reviews "Code Metrics scorecard and Languages profile sourced from GitHub activity" — soft human-in-the-loop assignment.
- Withdraw flow requires KYC (Settings → "Complete KYC Verification").
- Programmatic API not documented; public GitHub at drips-network/app means flow is reproducible but not API-first.

### G4 Live + functional — PASS
- 4 completed Stellar Waves through April 2026 (Wave 4: Apr 22–29).
- Next wave pending announcement at verification time.
- Blog cadence monthly; GitHub `drips-network/app` actively committed.

### G5 Real traction — PASS (established)
- **$255,000 disbursed across 4 Stellar Waves** ($60K + $60K + $60K + $75K).
- **782 users** earning Points in the latest wave (top-100 leaderboard).
- **536 repos** and **317 orgs** approved; **73,998 issues** tracked across the Stellar program.
- Built within Radworks ecosystem (sibling to Radicle).
- Past collaborators: Filecoin (FIL-RetroPGF), Ethereum Foundation, ENS, UNICEF, Scroll.
- Radworks streamed $1M through Drips to FOSS dependencies in 2023–24.

### G6 Verify-by-fetch — PASS
- Homepage: https://www.drips.network — verified
- Wave program: https://www.drips.network/wave/stellar — verified
- Docs: https://docs.drips.network/wave/ — verified
- Contracts: https://github.com/drips-network/contracts — verified
- LinkedIn: NOT FOUND (linkedin.com/company/drips resolves to an unrelated "conversational AI" company; set to null to avoid mislabeling)
- X: https://x.com/dripsnetwork — verified live; content behind paywall

### G7 Classification — proposed
- Category: `dev-bounty`
- Friction: `moderate` (KYC + 2-step withdraw)
- Posture: `agentAllowed: unclear`, `agentWelcomed: false`
- Credibility: `established`

## Notes

- Ecosystem-partner-funded waves; current is Stellar, but the model could rotate to other ecosystems.
- The maintainer-discretion assignment step is the biggest agent friction — you can do work and not be selected.
- Strong editorial fit because the dollar volume is real ($255K already disbursed) and the partner roster (Filecoin / EF / ENS) is established.
