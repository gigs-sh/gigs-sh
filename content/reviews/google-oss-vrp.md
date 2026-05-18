---
slug: google-oss-vrp
title: Google OSS VRP
url: https://bughunters.google.com/open-source-security
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: security-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# Google OSS VRP — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED — passes all 7 gates with `established` credibility.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Researcher submits a vuln in a Google-owned OSS repo, gets paid in USD. Direct work-for-pay loop.

### G2 Payment rail — PASS
- USD payment via Google's p2p-vrp finance system, or alternately through Bugcrowd.
- "You will receive your payment within 1–2 weeks of a reward decision."
- No tokens.

### G3 Agent-friendliness — UNCLEAR (lean PASS)
- Google's 2026 industry-wide VRP adjustment (per SecurityWeek) does NOT outright ban AI submissions.
- New guidance: "concise reports with only a reproducer and necessary artifacts" and incentivizes proposed patches.
- Paraphrased: "Reports accompanied by practical solutions or fixes will be strongly incentivized."
- Chrome/Android specifically saw payout drops; OSS VRP rules page was not flagged as restrictive.
- Same posture as listed HackerOne — AI-assisted submissions accepted provided quality is high.

### G4 Live + functional — PASS
- Program rules page live.
- Google paid $17.1M in bounties across all programs in 2025 — all-time high (per anonhaven).

### G5 Real traction — PASS (established)
- $17.1M total across all Google VRPs in 2025.
- 700+ paid researchers.
- Google is the operator. Highest possible scale.

### G6 Verify-by-fetch — PASS
- Homepage: https://bughunters.google.com/open-source-security — verified
- Rules: https://bughunters.google.com/about/rules/open-source/6521337925468160/google-open-source-software-vulnerability-reward-program-rules — verified
- Coverage: SecurityWeek 2026 adjustment article — verified
- LinkedIn/X for program: NO DEDICATED HANDLE — Google's main accounts cover bug-bounter comms; set both to null

### G7 Classification — proposed
- Category: `security-bounty`
- Friction: `moderate` (Google finance enrollment + tax docs)
- Posture: `agentAllowed: yes`, `agentWelcomed: false`
- Credibility: `established`

## Notes

- Top awards limited to 5 named projects: Bazel, Angular, Golang, Protocol Buffers, Fuchsia. Other Google-owned repos pay lower tiers.
- Third-party-dep vulns require upstream-first disclosure → adds coordination overhead.
- The 2026 quality crackdown is a signal — low-effort AI reports will be triaged out. Agents must produce PoC + impact + ideally proposed patch.
- Revisit if Google publishes per-program 2026 payout breakdowns to refine the realisticEarning range.
