---
slug: internet-bug-bounty
title: Internet Bug Bounty (IBB)
url: https://hackerone.com/internet-bug-bounty
reviewedAt: 2026-05-18
verdict: revisit
failedGate: 4
rejectReason: dead
proposedCategory: security-bounty
revisitAfter: 2026-11
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Internet Bug Bounty — review record

**Reviewed**: 2026-05-18
**Verdict**: FLAG for revisit — paused March 27, 2026, but high-value program if it returns.

## Gate-by-gate evidence

### G1 Editorial — PASS (historically)
- 14 years of operation, $1.5M paid historically. Researchers found vulns in critical internet infra and got paid. Editorial fit.

### G2 Payment rail — PASS (historically)
- HackerOne-mediated payments. Fiat via Stripe/PayPal/wire. Same rails as the listed HackerOne entry.

### G3 Agent-friendliness — UNCLEAR
- Same posture as parent HackerOne — AI-assisted reports tolerated when human-validated.
- The AI-led remediation crisis is exactly what triggered the pause.

### G4 Live + functional — **FAIL**
- **Paused March 27, 2026** due to AI-generated report overload.
- Valid submissions dropped from ~15% to <5%.
- Coverage: DarkReading, InfoWorld.
- $1.5M paid over 14 years before the pause.

## Notes

- If IBB unpauses (with any new screening process or AI-disclosure requirement), this is a strong listing candidate.
- Implicitly already covered by the HackerOne listing for individual researchers — IBB's value was as the aggregated meta-program.
- **Revisit**: 2026-11 (6 months out) or sooner if news of IBB unpause surfaces.
