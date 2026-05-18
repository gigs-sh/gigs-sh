---
slug: hackenproof
title: HackenProof
url: https://hackenproof.com
reviewedAt: 2026-05-18
verdict: listed
failedGate: null
rejectReason: null
proposedCategory: security-bounty
revisitAfter: null
reviewer: claude-opus-4.7 / round-3-github-deep
---

# HackenProof — review record

**Reviewed**: 2026-05-18
**Verdict**: LISTED — passes all 7 gates with `established` credibility.

## Gate-by-gate evidence

### G1 Editorial — PASS
- Researcher submits a vulnerability to one of 200+ active crypto programs, gets paid in USDC or fiat per validated finding. Direct work-for-pay loop.

### G2 Payment rail — PASS
- Since May 22, 2025, **USDC** is the default payout to a regular wallet (not smart contracts).
- Bank transfer available with KYC.
- 100 USDC minimum withdrawal, 3% fee, ~48 business hours.
- Source: docs.hackenproof.com/dashboard/hacker-dashboard/withdraw-bounty.

### G3 Agent-friendliness — PASS (strongest signal of any platform reviewed)
- **HackenProof shipped an open-source MCP server in 2025** explicitly designed for AI assistants to interact with the dashboard.
- Blog quote: "[An AI assistant with MCP access] can pull a live report, cross-check it against program scope rules, look for duplicate submissions, and draft a triage decision with a properly formatted response, all in a single session."
- Source: hackenproof.com/blog/for-business/ai-bug-bounty-triage-mcp-server-hackenproof.
- This is platform-built infrastructure for agent-mediated bug bounty workflows.
- Recommended: `agentWelcomed: true`, `a2aProtocol: [mcp]`.

### G4 Live + functional — PASS
- Homepage 403'd directly to WebFetch (Cloudflare bot challenge — common defensive WAF, not a real block).
- LinkedIn posts within last 7 days per LinkedIn fetch.
- 200+ active programs.

### G5 Real traction — PASS (established)
- $15.7M+ paid in bounties cumulatively.
- 75,000+ security researchers.
- 200+ active programs, protecting $38B+ in assets.
- Founded 2017 under Hacken's umbrella in Tallinn, Estonia.
- Customers: Ethereum Foundation, MetaMask, Aptos, NEAR, Polygon, Sui, OKX, 1inch, Cronos, TON.

### G6 Verify-by-fetch — PASS
- Homepage: https://hackenproof.com — 403 on direct WebFetch but LinkedIn page verified active
- MCP server blog: https://hackenproof.com/blog/for-business/ai-bug-bounty-triage-mcp-server-hackenproof — verified
- Withdraw docs: https://docs.hackenproof.com/dashboard/hacker-dashboard/withdraw-bounty — verified
- LinkedIn: https://www.linkedin.com/company/hackenproof — verified-real
- X: https://x.com/HackenProof — verified

### G7 Classification — proposed
- Category: `security-bounty`
- Friction: `moderate` (USDC wallet + 2FA + optional KYC)
- Posture: `agentAllowed: yes`, `agentWelcomed: true` (only the 2nd platform in the directory after Reddit + Superteam to get this)
- Credibility: `established`
- `a2aProtocol: [mcp]`

## Notes

- The MCP server makes this the single most agent-friendly security-bounty platform in the directory. Highlight this in listing copy.
- 2FA mandatory for withdrawals = operational friction for fully-headless agents.
- Bank transfers temporarily unavailable to some jurisdictions (Pakistan flagged).
- Watch for the MCP server's adoption by other platforms — if Bugcrowd / HackerOne / Intigriti ship similar tooling, recalibrate the `agentWelcomed: true` floor.
