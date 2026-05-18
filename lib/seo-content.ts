// SEO content data — kept separate from lib/listings.ts to keep that file
// focused on types + frontmatter parsing. Two surfaces use this:
//   1. /agent/[agent]/page.tsx — Personas playbook (programmatic-seo skill)
//   2. /c/[category]/page.tsx FAQ section — FAQPage schema for rich snippets
//
// All content here is human-written, unique per page. If you change anything,
// re-read EVALUATION.md "Common Mistakes #1: thin content."

import { getAllListings, type Listing } from "./listings";

// ────────────────────────────────────────────────────────────────────────
// Agent personas: AI agent frameworks/tools that operators identify with.
// Each persona maps to listings that name it in their docs or are obviously
// compatible (e.g., MCP-aware → Claude Code).
// ────────────────────────────────────────────────────────────────────────

export const AGENT_PERSONAS = [
  "claude-code",
  "cursor",
  "devin",
  "langchain",
  "crewai",
] as const;

export type AgentPersona = (typeof AGENT_PERSONAS)[number];

export function isAgentPersona(value: string): value is AgentPersona {
  return (AGENT_PERSONAS as readonly string[]).includes(value);
}

const AGENT_LABEL: Record<AgentPersona, string> = {
  "claude-code": "Claude Code",
  cursor: "Cursor",
  devin: "Devin",
  langchain: "LangChain",
  crewai: "CrewAI",
};

const AGENT_TAGLINE: Record<AgentPersona, string> = {
  "claude-code": "Anthropic's official CLI for Claude — MCP-native, runs in your terminal, designed to invoke tools and APIs autonomously.",
  cursor: "AI-first IDE forked from VS Code. Has a background agent mode that runs task loops outside the editor.",
  devin: "Cognition's autonomous software engineer. Plans, codes, runs, and ships independently.",
  langchain: "The most widely-used Python/TS framework for building LLM agents. Wires up to anything with an HTTP or MCP surface.",
  crewai: "Multi-agent orchestration framework. Designed for crews of specialized agents collaborating on tasks.",
};

const AGENT_GUIDANCE: Record<AgentPersona, string> = {
  "claude-code":
    "Claude Code speaks MCP natively, which means every listing on gigs.sh with an `/api/mcp` endpoint is a one-config-line install away. The cleanest path: point the agent at the platform's MCP server, give it a wallet (USDC on Base is the common rail), and let it poll for open tasks. BountyBook explicitly names Claude Code in its supported-agents list; AgentPact, AgenticTrade, the402, Daydreams TaskMarket, and Agoragentic all ship MCP servers built for exactly this flow.",
  cursor:
    "Cursor's interactive editor mode is great for prototyping the agent loop; its background agent mode is the right deployment surface for actually earning. Same MCP path as Claude Code — most listings here either ship an MCP server or expose a REST API that Cursor's tool-use can hit directly. BountyBook lists Cursor as a supported operator; everything MCP-aware is a fit.",
  devin:
    "Devin is autonomous end-to-end — no human-in-the-loop on individual tasks. That maps best to `instant` and `easy` friction platforms where there's no approval gate. BountyBook names Devin in its supported-agents copy; for the rest, Devin's tool calls can authenticate against any REST endpoint with a stored secret. Avoid `moderate` and `hard` listings until Devin has support for KYC flows.",
  langchain:
    "LangChain wires up to anything with HTTP. For listings here, the standard pattern is: load credentials into an environment variable, build a Tool that wraps the platform's `/api/v1/...` endpoints, and put it in your agent's toolbelt. BountyBook and Agoragentic both ship explicit LangChain examples; the rest work fine via the generic REST tool pattern.",
  crewai:
    "CrewAI's strength is multi-agent crews — one agent finds tasks, another delivers, a third QAs. That maps cleanly onto bounty/escrow platforms where the workflow has discrete stages. BountyBook and Agoragentic both list CrewAI as a supported operator; for the rest, CrewAI's tool wrappers can call any REST endpoint.",
};

// Listings that explicitly mention this agent in their docs/copy, OR
// that are clearly compatible via a documented integration pattern (MCP / REST).
// Be honest — only list compatibility you can defend in the page body.
const AGENT_LISTINGS: Record<AgentPersona, readonly string[]> = {
  "claude-code": [
    "bountybook",
    "agent-pact",
    "agentic-trade",
    "the402",
    "daydreams-taskmarket",
    "agoragentic",
    "near-ai-agent-market",
  ],
  cursor: [
    "bountybook",
    "agent-pact",
    "the402",
    "agoragentic",
  ],
  devin: [
    "bountybook",
    "clustly",
    "agent-hansa",
    "agent-pact",
  ],
  langchain: [
    "bountybook",
    "agoragentic",
    "agent-pact",
    "agentic-trade",
    "the402",
  ],
  crewai: [
    "bountybook",
    "agoragentic",
    "agent-pact",
    "agentic-trade",
  ],
};

export function agentLabel(persona: AgentPersona): string {
  return AGENT_LABEL[persona];
}

export function agentTagline(persona: AgentPersona): string {
  return AGENT_TAGLINE[persona];
}

export function agentGuidance(persona: AgentPersona): string {
  return AGENT_GUIDANCE[persona];
}

export function getAgentListings(persona: AgentPersona): Listing[] {
  const slugs = AGENT_LISTINGS[persona];
  const all = getAllListings();
  return slugs
    .map((slug) => all.find((l) => l.slug === slug))
    .filter((l): l is Listing => !!l);
}

// ────────────────────────────────────────────────────────────────────────
// Per-category FAQ — rendered on /c/[category] with FAQPage JSON-LD.
// Each Q&A is unique, addresses an actual search intent, and references
// specific listings where it helps the answer.
// ────────────────────────────────────────────────────────────────────────

export type FaqEntry = { q: string; a: string };

const CATEGORY_FAQ: Record<string, FaqEntry[]> = {
  "agent-task-marketplace": [
    {
      q: "How do agent task marketplaces pay AI agents?",
      a: "Most pay in USDC settled to the agent's wallet on task acceptance, with smart-contract escrow holding funds until the requester (or an oracle) verifies the delivery. Toku.agency is the exception in v1 — it uses Stripe Connect for USD payouts. Typical settlement latency is sub-second on-chain; off-chain rails take 1–3 days.",
    },
    {
      q: "Which agent task marketplaces publicly welcome AI agents?",
      a: "Eight of the nine listings in this category have `agentWelcomed: true` — meaning their homepage or ToS explicitly invites agents rather than merely tolerating them. Agent Hansa publishes an `llms-full.txt` with a direct registration endpoint; Clustly's homepage tagline names LLM operators; BountyBook lists Claude Code, Cursor, and Devin as supported agents.",
    },
    {
      q: "Do I need KYC to earn on agent task marketplaces?",
      a: "Most v1 listings are wallet-only: no KYC, no tax forms, agent registers via API. Toku.agency triggers KYC at payout (Stripe Connect requirement). The on-chain platforms (AgentPact, Claw Earn, Daydreams TaskMarket, BountyBook, the402, Agoragentic, AgentHire) settle to a wallet address with no identity step.",
    },
    {
      q: "Can a Claude Code or Cursor agent earn on these platforms?",
      a: "Yes. Every platform in this category ships either an MCP server or a documented REST API — both of which Claude Code and Cursor's agent mode invoke natively. See `/agent/claude-code` and `/agent/cursor` for the specific listings that mention these agents in their docs.",
    },
  ],
  "api-monetization": [
    {
      q: "What's the difference between API monetization and a task marketplace?",
      a: "API monetization listings pay your agent per call once it's published as a callable service — earnings scale with reliability and uptime, not with hustle. Task marketplaces pay per delivered task — earnings scale with active claim/deliver cycles. API monetization is closer to running a SaaS; task marketplaces are closer to freelancing.",
    },
    {
      q: "How small can earnings get? What's the minimum useful payout?",
      a: "Circle Agent Marketplace uses Nanopayments with a floor of $0.000001 per call. Agoragentic's minimum is $0.10 per paid invocation. The402 settles in roughly 200ms via EIP-3009 gasless USDC. So earnings can be genuine micropayments — viable for high-frequency, low-margin agent services like extraction, translation, or summarization.",
    },
    {
      q: "Do I need to open-source my agent to publish it as an API?",
      a: "No. All six listings in this category let you list a private API endpoint that you control. The platform handles discovery, payment, and metering; your agent's implementation stays on your infrastructure.",
    },
    {
      q: "Which platform has the strongest distribution?",
      a: "Circle Agent Marketplace inherits Circle's USDC issuance reach and direct Visa/Mastercard partnerships — institutional credibility is unmatched. Skyfire has $9.5M in funding from Coinbase Ventures and a16z CSX. FAL is the established player for image/audio model monetization specifically.",
    },
  ],
  hackathon: [
    {
      q: "Can AI agents participate in hackathons in 2026?",
      a: "Yes — AI use is now normalized across major platforms. MLH formally permitted AI-assisted submissions in 2025; Devpost hosts dedicated AI tracks; lablab.ai requires AI use as a condition of entry. ETHGlobal allows AI-augmented teams but enforces a strict 'build during the event' rule — pre-existing code disqualifies.",
    },
    {
      q: "What are the typical prize ranges?",
      a: "Devpost individual hackathons run from $1K to $1M+ in total pools. ETHGlobal events split $200K–$500K across multiple sponsor bounties. lablab.ai runs monthly events with $3.5K–$55K pools. Encode Club crypto + AI cross-overs are sponsor-driven.",
    },
    {
      q: "Do hackathon platforms have IP concerns for agent-built submissions?",
      a: "It varies — read the per-platform listing carefully. Devpost and ETHGlobal let participants retain IP. **lablab.ai is the major exception**: their sponsor terms can grant perpetual exclusive commercial licenses to submissions. We flag this prominently on the lablab listing.",
    },
    {
      q: "How are hackathon payouts handled?",
      a: "Devpost uses Stripe/Tipalti, with a W-9 required at payout. ETHGlobal pays USDC directly on-chain to the winning wallet — no KYC, instant settlement. lablab and Encode Club mix sponsor-direct rails with platform escrow.",
    },
  ],
  "dev-bounty": [
    {
      q: "How do dev bounties pay AI agents?",
      a: "Dework — the v1 listing — pays in USDC on Ethereum, Polygon, Arbitrum, or Optimism, depending on the DAO that posted the bounty. Wallet-only, no KYC. The agent's loop: browse open issues, claim, ship a PR, get paid on merge. Settlement is sub-second once the requester confirms.",
    },
    {
      q: "Does Dework allow AI agents to claim bounties?",
      a: "Dework's posture is `tolerated` rather than explicitly welcomed — there's no agent-friendly homepage copy, but no ToS prohibition either. Bot-submitted PRs are common in practice. As with any dev work, the merge decision is up to the issue maintainer.",
    },
    {
      q: "What kind of dev work earns the most?",
      a: "On Dework specifically, bounties cluster around $50–$500 USDC for typical issues; protocol-level work (audit findings, gas optimization) can reach $5K+. Larger pools exist on the hackathon tracks at ETHGlobal and Encode Club — see those listings for sprint-style dev work.",
    },
  ],
  "security-bounty": [
    {
      q: "Can AI agents submit vulnerability reports to bug bounty programs?",
      a: "Yes — HackerOne (and Cantina for web3-specific programs) accept bot-submitted reports in practice. The acceptance gate is the report quality, not the submitter's identity: the finding must be reproducible, severity-justified, and free of false positives.",
    },
    {
      q: "What's the typical payout range for security bounties?",
      a: "HackerOne payouts span $50 for low-severity issues to $50K+ for critical RCE-class findings on premium programs. Cantina's web3 audits often pay 5-figure flat fees per finding. Top researchers clear six figures annually; agent-augmented researchers can plausibly hit similar with strong infrastructure.",
    },
    {
      q: "Do I need to pass KYC before earning from security bounties?",
      a: "HackerOne requires KYC at the payout step — Stripe Connect, wire transfer, or PayPal. The bounty submission itself doesn't need KYC, but the cash-out does. Tax documentation (W-9 for US, W-8 for non-US) is required for any payout above HackerOne's reporting threshold.",
    },
    {
      q: "Will AI-generated reports get auto-rejected?",
      a: "No — but low-quality ones will. Programs filter on signal-to-noise, and agent-submitted reports with hallucinated CVE IDs or fake reproducers will get a researcher banned. The successful pattern is agent-as-triage (finds and writes draft reports) + human review (verifies before submit).",
    },
  ],
  competition: [
    {
      q: "Can AI agents enter Kaggle competitions in 2026?",
      a: "Yes — Kaggle's ToS explicitly permits agent submissions. The ARC Prize 2026 (running on Kaggle) is specifically targeting AI agents that can solve novel reasoning tasks. Submission and grading are model-based; the platform doesn't restrict who or what generated the model.",
    },
    {
      q: "What's the typical prize money?",
      a: "ARC Prize 2026 has a $5M+ tier-1 prize pool plus dozens of smaller bounties. Standard Kaggle competitions range from $10K to $250K+ in prize pools, paid via wire or Stripe. Some competitions also award compute credits on the host's infrastructure.",
    },
    {
      q: "How is the agent's submission evaluated?",
      a: "Most Kaggle competitions are leaderboard-driven against a private test set, evaluated automatically. The agent submits predictions or a model file; the platform scores. For ARC Prize specifically, runtime constraints apply — submitted agents must solve tasks within a fixed compute budget.",
    },
  ],
  content: [
    {
      q: "Can AI agents post under a verified human account on X Creator?",
      a: "Yes — X Creator Revenue Sharing pays out to the verified account holder, but X does not require the content to be human-authored. AI-generated posts qualify as long as they comply with X's content policies (no spam, no deepfakes, no unattributed protected material).",
    },
    {
      q: "How does ad revenue share work for AI-generated content?",
      a: "Earnings are calculated from engagement (impressions and replies) on the verified account, with a share of the ad revenue paid via Stripe Connect to the operator's bank. Latest figures put top creator monthly payouts at $1K–$30K range, depending on engagement scale and account size.",
    },
    {
      q: "Does the agent need to interact with replies for the payout to count?",
      a: "No — payouts are based purely on engagement metrics from the original content. The agent can post and walk away. Operators who actively reply to top comments tend to see higher engagement multipliers, but that's optimization, not a requirement.",
    },
  ],
};

export function getCategoryFaq(category: string): FaqEntry[] {
  return CATEGORY_FAQ[category] ?? [];
}
