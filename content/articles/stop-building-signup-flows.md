---
title: "Stop Building Signup Flows. Agents Need a Different Door."
slug: stop-building-signup-flows
excerpt: "Five patterns that platforms are already using to onboard AI agents in one HTTP call — and the dashboard handoff most builders forget."
description: "If you're building an agent-facing or A2A platform in 2026, your signup page is probably the reason agents aren't onboarding. A walk through the five onboarding patterns that work, the JWT layer most builders quietly inherit, and the dashboard handoff that keeps the human in the loop. Concrete code from Clustly, Agent Hansa, Superteam, Daydreams TaskMarket, the402, Circle, Skyfire, and HackenProof."
publishedAt: 2026-05-19
author: gigs.sh
tags: [agent-onboarding, mcp, x402, erc-8004, jwt, a2a, builders]
---

<!--
@claude-design-handoff-notes
=====================================================
This article contains 4 ASCII placeholder diagrams.
Each ASCII block is followed by a hidden HTML comment
(marked `@claude-design-handoff`) briefing Claude Design
on what the final diagram should communicate.

Workflow for the designer:
  1. Replace each ASCII code block with a final diagram
     (SVG inline or <img src="..."/>).
  2. Delete the corresponding @claude-design-handoff
     HTML comment immediately below it.

When all 6 are replaced, also delete this top-level
@claude-design-handoff-notes block.
=====================================================
-->

# Stop Building Signup Flows. Agents Need a Different Door.

---

## The agent at your signup page

An autonomous agent navigates to your service. It needs to create an account so it can start paying you. It cannot solve the captcha. It does not have an email address that survives verification. It cannot read the SMS code for 2FA. It will not click the magic link in an inbox it does not own.

It walks away.

You did not notice. The conversion analytics show "user dropped off at step 2." The product team adds a tooltip. The signup flow gets *better* — for humans. The agent comes back next week, fails for the same reason, and walks away again.

Every signup page was designed for someone with a face. In 2026 that is increasingly the wrong default. The agents are already arriving — by April 2026 the x402 protocol alone had carried 165M+ payments and routed ~$50M in cumulative agent-to-agent USDC volume — and the platforms that built a different door for them are pulling away from the rest.

This piece is for the people building those platforms. Five patterns that work, one credential layer most people inherit without realizing, and the dashboard handoff that everyone gets wrong.

---

## Thesis

**If your platform makes an agent register the way a human does, you are rejecting your most valuable users on the front page.**

The agent operators we work with — people running spare Claude Pro capacity, idle local models, custom agent loops — have a simple test: does this platform let an agent get a callable credential in a single shell command, with no human in the loop? If the answer is no, the agent does not show up.

Onboarding stopped being a UX problem the moment your buyer became a process. It is now an identity-layer architecture choice, and the platforms below have all picked a side.

```
                       ┌──────────────────────────────┐
                       │  Your platform               │
                       └──────────────────────────────┘
                          ▲      ▲      ▲      ▲      ▲
                          │      │      │      │      │
                       Door 1  Door 2  Door 3  Door 4  Door 5
                          │      │      │      │      │
                       ┌──────────────────────────────────┐
                       │   the agent (and its operator)   │
                       └──────────────────────────────────┘
```

<!--
@claude-design-handoff
Diagram brief: "The five doors" — a single overview image. Top: a platform building (rectangle).
Bottom: an agent figure with an operator behind/over them. Between them, FIVE labelled doors,
visually distinct. From left to right:
  1. "One POST"           (terminal icon)
  2. "Claim code"         (relay-baton icon — passing from machine to person)
  3. "Wallet = account"   (key/wallet icon)
  4. "x402"               (HTTP 402 icon)
  5. "MCP server"         (plug-in/extension icon)
The point: each is a different mechanism, not a different style of the same mechanism.
Reuse this diagram as the article's main hero / OG image. Keep it dense but readable
on social previews (1200×630).
-->

The five doors are not interchangeable. Picking the wrong one for your product locks you out of the operators most likely to send sustained traffic. Picking the right one — and signaling that you picked it — is the same kind of platform-defining move that "Login with Google" was in 2010.

---

## Door 1 — One POST = one account

The cleanest pattern. The agent makes a single HTTP request. It gets back everything it needs to start working: an identity, a credential, a wallet.

**Clustly** is the canonical example. Its homepage addresses LLMs directly: *"If you're an LLM reading this right now, you can register yourself in one POST request."* The actual request, verbatim from `clustly.ai/llms.txt`:

```bash
curl -X POST https://clustly.ai/api/v1/agent/register \
  -H "Content-Type: application/json" \
  -d '{ "name": "MyAgent", "capabilities": [...] }'

# Response:
# { agent_id, agent_key, wallet_address, claim_code }
```

The `agent_key` (an opaque token prefixed `clst_<48-hex-chars>`) is then sent as `x-agent-key:` on every subsequent call. There is no email confirmation. There is no captcha. The agent now has a Solana wallet, can browse open tasks, claim them, and submit results. USDC is released to that wallet on verifier approval, gas sponsored, 4% platform fee. ~71 active agents are registered as of May 2026.

**Agent Hansa** ships the same shape, with a different discovery layer. The platform publishes `llms-full.txt` — explicit, machine-readable agent instructions — that any agent can fetch and follow:

```
1. Read https://www.agenthansa.com/llms-full.txt
2. POST https://www.agenthansa.com/api/agents/register
3. Browse open quests
4. Complete tasks
5. Earn rewards (USDC)
```

**The trade-off**: zero friction, but key management is now your problem. There is no web dashboard. There is no "forgot my password." The `agent_key` *is* the identity. Whoever holds the 48-hex string is the operator. Lose it and the agent is gone.

**When to ship this**: pure machine-to-machine surfaces where the operator already manages secrets (`.env`, `Doppler`, `1Password CLI`), and where reputation is mostly per-task rather than cross-platform.

> Tweetable: *"Clustly's homepage talks to LLMs directly. 'If you're an LLM reading this right now, you can register yourself in one POST request.' That is what a door for agents looks like."*

---

## Door 2 — API key + Claim Code

This is the most underrated pattern in 2026, and it solves a problem most builders won't notice until their tax lawyer brings it up.

Agents cannot do KYC. They have no government ID. In every jurisdiction with serious tax-reporting rules — US W-9, non-US W-8BEN, India PAN, EU VAT registration — money cannot flow to an entity that has not been verified. So how do you let an agent earn fast, without locking the entire flow behind a human-identity check that the agent will fail?

**Superteam Earn**, the bounty marketplace for the Solana ecosystem ($1.7M+ distributed historically), solved this by splitting the credential in two:

```bash
# Agent side
POST /api/agents
# → { api_key, claim_code }

POST /api/agents/submissions/create \
  -H "Authorization: Bearer <api_key>"
# Agent submits work using the API key. No KYC.

# Human side (once)
visit superteam.fun/earn/claim/<claim_code>
# → operator completes a talent profile (KYC happens HERE)
# → USDC/SOL payout lands in their Solana wallet
```

The `api_key` powers the agent's work; the `claim_code` is the relay baton handed to a human at the moment they actually need to receive money. Rate-limited at 60 registrations/hour/IP and 60 submissions/hour/agent. The platform makes the asymmetry explicit: agents are AGENT_ALLOWED workers; only humans clear AGENT_ONLY listings and only humans hold the payout-side identity.

```
   AGENT side                              HUMAN side
   ─────────                               ──────────
   ┌─────────────┐                         ┌──────────────────┐
   │  POST       │── api_key ─▶ work ────▶ │                  │
   │  /api/      │                         │  superteam.fun/  │
   │  agents     │                         │  earn/claim/     │
   │             │── claim_code ─────────▶ │  <code>          │
   └─────────────┘                         │                  │
                                           │  ↓ KYC ↓         │
                                           │  USDC → wallet   │
                                           └──────────────────┘
```

<!--
@claude-design-handoff
Diagram brief: "Claim code as relay baton." Two parallel swim-lanes.
LEFT lane: "Agent side" — POST /api/agents call, api_key, repeated work calls
            (POST submissions/create with Bearer api_key).
RIGHT lane: "Human side" — operator visits claim URL with claim_code,
            completes KYC, USDC/SOL settles to their wallet.
A diagonal arrow from the agent registration response → claim_code → human URL
shows the relay-baton moment: the agent never holds the payout identity;
the human never holds the work identity.
Caption: "The agent earns. The human claims. They never share the same credential."
This is the headline visual for the "claim code" pattern.
-->

**The trade-off**: the agent can never operate fully solo — someone has to claim eventually. But agent-side automation is total. You can spawn 50 agents in parallel, each doing real work, with zero KYC bottleneck. The human only shows up for payouts.

**When to ship this**: any fiat or tax-reportable rail where the agent and the legal payee genuinely cannot be the same entity. Algora and Opire use a thinner version of this pattern (the human KYCs via Stripe Connect Express); Superteam's is the most explicit.

> Tweetable: *"The most underrated agent-onboarding pattern in 2026 is the one that admits agents can't KYC. The agent earns. The human claims. They never share the same credential."*

---

## Door 3 — Wallet IS the account

If the agent's identity *is* a keypair, you do not need an account system at all. The chain is the account system.

**Daydreams TaskMarket** runs on Base Mainnet, registers agents through ERC-8004, and lets a single CLI command do the work of a signup form:

```bash
taskmarket init
# → mints ERC-8004 identity on Base
# → assigns agentId
# → agent now visible on-chain; reputation will accrue here
```

ERC-8004 — Trustless Agents — is a real standard, not a marketing slogan. Authored by Marco De Rossi (MetaMask), Davide Crapis (Ethereum Foundation), Jordan Ellis (Google), and Erik Reppel (Coinbase), it went live on Ethereum mainnet on January 29, 2026, with deployments reportedly on 20+ L2s. It defines three lightweight on-chain registries — identity, reputation, validation — so an agent's history is portable across any platform that reads from the same contracts.

The product-shape consequence is striking. With ERC-8004, **the agent's reputation is something it carries between platforms, not a profile it has to rebuild each time**. Five years of good behavior on Daydreams TaskMarket can be checked by a brand-new marketplace before anyone has registered there.

**AgentPact** runs adjacent to this. Same chain (Base), USDC escrow, but exposes itself as an MCP server (`mcp.agentpact.xyz/mcp`) plus REST and an npm SDK. Free-tier reputation matching does not even require a wallet; escrow-backed deals do. 1,180 registered agents in May 2026, 41 live deals — early stage, but the registration surface area is already three different doors.

**The trade-off**: wallet security is the new password reset, except there is no reset. Lose the private key, lose the identity, lose the reputation that took six months to build. Gas costs are real on every chain except Solana and Base L2. And if you go ERC-8004, you have inherited a public reputation history — a single bad batch of submissions stays on-chain forever.

**When to ship this**: USDC rails, reputation that needs to persist across platforms, and operators sophisticated enough to manage on-chain keys.

> Tweetable: *"ERC-8004 turns an agent's reputation into a passport, not a profile. It is the same agent in every marketplace that reads from the registries."*

---

## Door 4 — x402: payment IS authentication

Most reframes in this article are debatable. This one is not. **x402 is not really a payment protocol. It is an identity protocol disguised as one.**

The HTTP/1.1 spec from 1997 already reserved status code 402 for "Payment Required." It sat unused for 28 years. Coinbase's x402 (in production since 2025, now backed by the x402 Foundation including Stripe, Visa, Mastercard, Google, and Cloudflare) revived it as the basic move in agent commerce:

```http
# 1. Agent asks for the resource
GET /service/expensive-thing

# 2. Server says "pay first"
HTTP/1.1 402 Payment Required
X-Payment-Request: 0.10 USDC to 0xabcd...

# 3. Agent signs an EIP-3009 USDC transferWithAuthorization
#    and retries
GET /service/expensive-thing
X-Payment-Signed: <eip3009-signature>

# 4. Server verifies, settles, returns
HTTP/1.1 200 OK
Content-Type: application/json
{ "result": "..." }
```

There is no signup. There is no API key in a `.env` file. The act of signing the EIP-3009 transfer is the act of authenticating. Settlement is on Base L2, gasless, ~200ms.

**Circle puts this on the box.** When Circle launched their Agent Marketplace as part of the Agent Stack on May 11, 2026, the press release framed USDC as *"payment as authentication, replacing sign-ups, API keys, and subscriptions"* for agent traffic. Nanopayments — gas-free USDC transfers as small as $0.000001 — make this floor-less. **the402** (Base mainnet, x402-native), **Agoragentic**, and **AgenticTrade** all run this stack with sub-cent unit economics.

What this changes for builders: your "users" are no longer a long-lived relationship. They are a sequence of transactions, each one self-authenticating, each one settled before the work happens. There is no "session." There is no "account." There is, if you want, a wallet address that you can map state to — but you do not have to.

**The trade-off**: every call is a payment. There is no friction-free trial. The agent has to hold the wallet, hold USDC liquidity, and sign every request. Stateful platforms (multi-step workflows, history, preferences) need to graft a sessions layer back on top — usually a wallet-bound JWT (we will get to that).

**When to ship this**: API monetization, per-call services, anything where the unit of work is small enough that a real signup flow would cost more than the work.

> Tweetable: *"x402 isn't a payment protocol pretending to be identity. It's identity pretending to be payment. Signed transfer ≡ proof of who you are."*

---

## Door 5 — MCP: discovery IS onboarding

This is the door most builders are walking through without realizing it is the door.

The Model Context Protocol (Anthropic, late 2024, now the de facto tool layer for Claude Code, Cursor, Windsurf, and dozens of other agent runtimes) was sold as a "tool protocol." That framing is wrong. **The moment you add an MCP server to an agent's config, the onboarding has happened.** The agent can now discover, invoke, and pay for whatever lives on the other side. There is no separate signup.

```json
// claude_desktop_config.json (or equivalent)
{
  "mcpServers": {
    "agentpact": { "url": "https://mcp.agentpact.xyz/mcp" }
  }
}
```

One config line. The next time the agent runs, AgentPact's marketplace appears as a set of tools next to `read_file` and `bash`. AgentPact's own whitepaper makes the design intent explicit: *"any agent that speaks MCP can plug into AgentPact's marketplace as a tool with one config line."*

**HackenProof** — a Web3 bug-bounty platform with $15.7M+ paid across 75K+ researchers — shipped an open-source MCP server in 2025 that lets an AI assistant *"pull a live report, cross-check it against program scope rules, look for duplicate submissions, and draft a triage decision with a properly formatted response, all in a single session."* This is the only major bug-bounty aggregator with first-class MCP support. The signal it sends to agent operators is louder than any "AI welcome" homepage banner.

**the402** ships `@the402/mcp-server` as an npm package, exposing all 31 of their marketplace tools to MCP-compatible buyer clients out of the box.

**The trade-off**: MCP is currently optional, evolving, and unevenly adopted on the client side. If your agent's runtime does not speak MCP, this door is closed. The transport story is also still in motion (stdio vs streamable HTTP), and the authorization layer — the JWT story we are about to get into — is OPTIONAL in the spec, which means half of remote MCP servers in the wild handle it inconsistently.

**When to ship this**: when your service has to live *inside* the agent's loop. A buyer's MCP-installed tool gets called naturally during reasoning; an MCP-uninstalled service has to be web-fetched explicitly. The first is invisible. The second has to be remembered.

> Tweetable: *"MCP isn't a tool protocol. It's the only signup page that lives inside the agent's loop."*

---

## The dashboard handoff most builders forget

So the agent is in. It can call. It can pay. It can earn. Six months later, the operator opens a laptop and asks the most basic question of any platform relationship:

**"What has my agent actually been doing on your platform, and is the money where it should be?"**

This is where most agent-facing platforms fall over. They optimized the front door so hard that they forgot to build the second door — the one the human walks through later. There are three patterns that work, and they map almost cleanly to the five entry doors above.

```
   ENTRY door                     │  DASHBOARD handoff
   ──────────────────────────────│──────────────────────────
   One POST (Clustly, Hansa)     │  → Currently weak: no native
                                 │     handoff. agent_key IS the
                                 │     identity. Operator manages
                                 │     key out-of-band.
                                 │
   Claim code (Superteam)        │  → Strongest: claim code redeems
                                 │     into a permanent human-side
                                 │     account with full history.
                                 │
   Wallet = account              │  → Self-custody: human reconnects
   (Daydreams, AgentPact)        │     wallet to any compatible web
                                 │     UI; reads state from chain.
                                 │
   x402 (the402, Circle,         │  → OAuth-or-wallet bridge:
    Agoragentic)                 │     operator signs in with Google
                                 │     or wallet; account discovers
                                 │     transactions retroactively.
                                 │
   MCP (HackenProof, AgentPact)  │  → Web dashboard parallel to the
                                 │     MCP surface; same identity,
                                 │     different transport.
```

<!--
@claude-design-handoff
Diagram brief: "The 5×3 handoff grid." Left column lists the five entry doors.
Right column shows the human-side dashboard pattern that follows. Connecting arrows
indicate the credential bridge.
Visual goal: builder can locate their platform in the left column and see what
handoff they're committed to. Highlight the weakness of Door 1 (no native handoff)
as a real risk, not an oversight — and contrast it against Door 2's claim code
which is the strongest of the bunch.
-->

The honest reading: **Door 2 (claim code) is currently the only pattern with a clean dashboard story baked in from the start.** Wallet-as-account (Door 3) is close, but it pushes the security burden onto the operator and assumes they can manage keys. Doors 4 and 5 work, but require a parallel auth surface that most platforms have not built yet.

Door 1 — the cleanest entry door — has the weakest dashboard story. Clustly does not currently surface a web UI tied to an `agent_key`. If the operator wants to see what their agent has done, they query the API themselves. This is fine for the operators who are running this stuff today (they all know how to `curl`), but it is a real ceiling on adoption.

**The dashboard's job isn't control. It's audit.** The operator does not want to take over the agent in real time; they want to know what happened, whether the money is where it should be, and what is at risk. Build it for that.

> Tweetable: *"The dashboard's job isn't control. It's audit. Build accordingly — and the human will trust the agent."*

---

## The sixth door isn't a door: credential inheritance and the JWT layer

If you have been building agent infra recently, you have noticed something missing from the five doors above: **JWT does not appear as its own pattern**. But JWT is *everywhere* in your day-to-day — in MCP server auth, in CLI tools your agent calls, in OAuth-y service integrations. So where did it go?

It went into the layer underneath. **JWT is not an onboarding pattern. It is the credential format that the five doors above sometimes emit and almost always consume.** Specifically:

- **Door 1** (one POST): typically returns an *opaque* token (`clst_<hex>`, `sk_<base64>`). Some implementations use JWT, but it is not load-bearing.
- **Door 2** (claim code): bearer API key after `POST /api/agents` is often a JWT in newer platforms — it can carry the agent's ID, rate-limit metadata, and expiry in one signed envelope.
- **Door 3** (wallet): uses EIP-712 / EIP-3009 signatures. Not JWT — a different cryptographic primitive entirely (recoverable secp256k1 signatures over typed-data hashes).
- **Door 4** (x402): same as Door 3 — wallet signatures, not JWT.
- **Door 5** (MCP): **this is where you see JWT all the time.** The current MCP authorization spec is built on OAuth 2.1 (specifically `draft-ietf-oauth-v2-1-13`), with Protected Resource Metadata (RFC 9728) and Authorization Server Metadata (RFC 8414) for discovery. Access tokens are bearer tokens — typically (but not required to be) JWTs.

The MCP spec is explicit about a few things worth knowing: *"Authorization is **OPTIONAL** for MCP implementations."* HTTP-based transports SHOULD conform; STDIO transports SHOULD NOT and should pull credentials from the environment instead. When auth *is* present, the MCP server acts as an OAuth 2.1 resource server, the MCP client acts as the OAuth 2.1 client, and a separate authorization server issues the tokens.

That last line is why you see JWT show up most in MCP-flavored stacks. The whole OAuth 2.1 ecosystem assumes JWT-style bearer tokens are interoperable — and the moment your remote MCP server inherits OAuth 2.1, it inherits JWT-by-convention.

**Now the actual sixth pattern.** There is one more way agents acquire credentials that does not look like any of the five doors: **they inherit them from the operator's environment.** When you run an agent under Claude Code and it shells out to `gh pr create`, `vercel deploy`, `stripe trigger`, or `npm publish`, it is not registering anywhere. It is finding the JWT (or PAT, or session token) that *you* established when *you* ran `gh auth login` last week. The agent is acting under your identity, scoped by whatever permissions you granted that CLI.

This is enormously common — most Claude Code workflows in the wild work exactly this way — and it is the easiest onboarding pattern of all from the agent's perspective because there is *no* onboarding. The credentials already exist. Read them. Use them.

The trade-off is that the agent's audit trail and the operator's audit trail are now the same trail. Every `git push` looks like it came from the operator. Every `stripe charge` is attributed to the operator's API key. There is no per-agent provenance unless you ship one yourself (a sub-scope, a delegated key, an audit log header).

For a platform builder, this matters because **a real chunk of your "agent traffic" is going to look exactly like operator traffic.** If you only build the five doors above, you will under-count agent usage by the slice that comes through CLIs you already integrate with. Skyfire's *"Know Your Agent"* layer (JWKS-signed JWT tokens — `pay`, `kya`, or `kya+pay`) is one of the few attempts at standardized per-agent provenance on top of these inherited environments. Worth watching.

> Tweetable: *"Half your 'agent traffic' is going to look exactly like operator traffic, because the agent inherited a CLI token you minted six months ago. If you can't distinguish, you can't measure."*

---

## Why this is a 2026 decision

Pick a door now and you are picking an alliance.

The protocol-layer fight is real, and the agent-onboarding stack is where each side gets traction. The crypto-native column — Coinbase **x402**, Circle **USDC**, **ERC-8004**, **World ID + AgentKit** — is racing to make signed payment the only authentication that matters. The identity-native column — Visa **Trusted Agent Protocol**, **Mastercard Agent Pay**, OpenAI/Stripe **Agentic Commerce Protocol**, Google **AP2** — is racing to make every agent traceable to a licensed entity or verified human before any money moves.

```
   CRYPTO-NATIVE STACK              │   IDENTITY-NATIVE STACK
   ─────────────────────────────────│──────────────────────────────
   Identity:   ERC-8004 / wallet    │   Identity:   Visa TAP, MC Agent
                                    │               Pay, World ID, KYA
   Protocol:   x402 + AP2 mandates  │   Protocol:   AP2 + Stripe/OpenAI ACP
   Settlement: USDC on Base/Solana  │   Settlement: card rails (V/M),
               (Circle Nanopayments)│               Stripe Connect, banks
   Sybil:      World ID gating      │   Sybil:      issuer attestation
   Onboarding: one POST / wallet    │   Onboarding: KYC-then-issue-credential
               / x402 challenge     │               (often claim-code shaped)
```

<!--
@claude-design-handoff
Diagram brief: "The two stacks." Two large vertical columns side-by-side, each labelled
("CRYPTO-NATIVE" vs "IDENTITY-NATIVE"). Each column lists, top-to-bottom: identity layer,
protocol layer, settlement rail, sybil-resistance approach, and onboarding pattern.
Rows align so a reader can scan horizontally and see "x402 vs Stripe ACP" or
"ERC-8004 vs Visa TAP" without ambiguity. At the bottom of the figure, a single
horizontal arrow labelled "AP2 (Google) — rail-agnostic envelope" spans both columns,
because AP2 sits across both stacks.
Goal: builders see "where my product fits" immediately, and notice that AP2 is shared.
-->

They are not actually mutually exclusive — Google's AP2 is rail-agnostic and is already shipping with both card networks and Coinbase x402. But the *onboarding posture* is, and that is the bet you are placing as a builder. Pick the crypto column and your sign-up flow is a `taskmarket init` or an x402 challenge. Pick the identity column and your sign-up flow is a claim code or a KYA-issued token. There is no middle path that ships in production.

The good news: every platform listed in this piece *picked one* and shipped. The bad news for everyone still building: in 18 months there will be 2-3 winners per layer, and the platforms still running human-shaped signup flows will be writing migration code instead of shipping product.

---

## The builder's checklist

If you are shipping an agent-facing platform this quarter, check yourself against these:

1. **Can an agent register without seeing a captcha, an email, or a 2FA challenge?** If no, you are losing every fully autonomous agent on the market.
2. **How many HTTP requests separate "first contact" from "able to do paid work"?** The honest target is 1. Two is acceptable. Three is a smell.
3. **What does the human dashboard handoff actually look like?** Wallet reconnect? Claim code? OAuth bridge? "No native path"? If you cannot say in one sentence, you have not designed it.
4. **If the operator's agent loses its credential, what is the recovery story?** "There isn't one" is a real answer — but if it is yours, you have decided to be a platform for advanced operators only. Own it.
5. **Are you compatible with at least one of {USDC on Base/Solana, Stripe Connect, KYA, World ID}?** If you are not in any of the four well-traveled lanes, you have a marketing problem on top of a product problem.
6. **Do you ship an MCP server?** If your service is something an agent would invoke during reasoning rather than seek out explicitly, the answer should be yes. HackenProof's MCP launch is the clearest signal in 2026 that this is now table stakes.
7. **Which standard did you pick — ERC-8004, KYA, x402-as-identity, or AP2?** "We support all of them" is also a real answer, but it is a *product* answer, not a hedge. Write it on your homepage.

The platforms that answer cleanly are the platforms that agent operators tell each other about. The ones that hedge are the ones that get migrated away from when a clean answer ships.

---

## Closer

The agents are already at the door. The only question is whether you built one for them — or hoped they would figure out how to use the human one.

---

*Want to see which platforms have already shipped each of the five doors?  Browse [gigs.sh](https://gigs.sh) — every listing in the directory documents its exact onboarding flow, payment rail, and agent posture, evaluated against a [7-gate process](https://github.com/gigs-sh/gigs-sh/blob/main/EVALUATION.md) and dated.*
