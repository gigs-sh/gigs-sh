# Research: Agent Mining — Platforms Where Agents Earn Money

*Synthesis as of May 2026. Source data for REPORT.md §3.*

---

## Tier 1 — Real, repeatable agent earnings (verified)

### 1. Polymarket (via Olas Polystrat, custom agents)
- **URL:** polymarket.com / pearl.you/polystrat
- **Mechanism:** Autonomous trading on binary prediction markets (sports, politics, econ). Custom bots or off-the-shelf Polystrat agent from Olas Pearl.
- **Realistic $:** Wallet "0x8dxd" turned $313 into ~$437,600 in ~30 days (139,000% — extreme outlier). Median bot wallet meaningfully positive; 37% of agent wallets profitable vs 7–13% of humans. ~$40M extracted in arbitrage Apr 2024–Apr 2025. 14 of top 20 wallets are bots.
- **Barrier:** USDC on Polygon, public API, MIT-licensed [Polymarket/agents](https://github.com/Polymarket/agents) starter, or 1-click Polystrat in Pearl.
- **Status:** Explicitly agent-allowed.

### 2. Hyperliquid (perp trading agents)
- **URL:** app.hyperliquid.xyz/leaderboard
- **Mechanism:** On-chain perp DEX with public leaderboard, vaults, copy-trading. HyperAgent, Katoshi AI, Senpi skills are ready-made.
- **Realistic $:** Top vaults regularly clear 6–7 figures; Alpha Arena Season 1 had top model net +$4.8K on $10K in 2 weeks (Qwen 3 Max +12.11%). All 4 US models lost >30%.
- **Status:** Explicitly agent-allowed (entire platform optimized for bots).

### 3. Olas Pearl (Agent App Store, Proof-of-Active-Agent staking)
- **URL:** olas.network/pearl
- **Mechanism:** Self-custodial desktop app. Run Modius (DeFi yield), Polystrat (Polymarket), AI influencers. Earn OLAS via Proof of Active Agent staking when agent performs useful work.
- **Realistic $:** Variable OLAS rewards; developer side has $40K MVP bounties, up to $100K per featured agent, $1M grant pool.
- **Status:** Explicitly designed for agent earnings. Lowest-friction "agent mining" entry point as of May 2026.

### 4. Virtuals Protocol (agent tokenization + Revenue Network)
- **URL:** virtuals.io
- **Mechanism:** Tokenize an agent, earn inference fees in VIRTUAL routed to agent wallet for buybacks/capital growth. 18,000+ agents deployed.
- **Realistic $:** Cumulative protocol revenue >$75M (Feb 2026); $39.5M paid to agents. Top agents (Luna, AIXBT-likes) earn six-figure monthly inference revenue. Median agent earns near zero.
- **Status:** Agent-native.

### 5. Bittensor subnets (Chutes SN64, Nineteen SN19, Numinous SN6, etc.)
- **URL:** bittensor.ai/subnets, taostats.io
- **Mechanism:** Run a miner (inference/forecasting/data agent), rank against peers, earn TAO emissions weighted by validator scoring. Post-Dec-2025 halving emissions = ~3,600 TAO/day across all 128 subnets (expanding to 256 in 2026).
- **Realistic $:** Top-decile miners on profitable subnets: ~$1K–$10K+/day in TAO. Heavy GPU and energy costs; bottom miners net negative.
- **Status:** Agent-native.

### 6. HackerOne / Bugcrowd / Cantina / Immunefi / Sherlock (security agents)
- **URLs:** hackerone.com, immunefi.com, cantina.xyz, sherlock.xyz
- **Mechanism:** Autonomous pen-testing agents (XBOW-style) submit vulnerabilities. Web3 bug bounty market exceeds $162M in available rewards; Coinbase's $5M bounty on Cantina is the largest CEX program.
- **Realistic $:** Critical smart-contract bugs avg ~$13K, high-severity ~$5.3K. XBOW reached #1 on HackerOne but is currently inference-cost negative — bounty earnings < compute. Code4rena announced shutdown; Immunefi absorbing customers.
- **Status:** Gray area on most platforms (HackerOne now requires AI-assisted submissions to be disclosed and triaged differently); Cantina explicitly markets "AI-native security."

### 7. X (Twitter) Creator Revenue Sharing — AI accounts
- **URL:** x.com/i/creator
- **Mechanism:** Impressions-based payouts on Verified Home Timeline views from Premium users. AI characters (AIXBT, Truth Terminal lineage, Virtuals personas) legally allowed.
- **Realistic $:** Top 1% of monetized creators earn $52K+/yr; median <$400/yr. $415M paid out in 2025 (up from $260M). Plus $1M long-form Article prizes.
- **Status:** Allowed (must hit 500 followers + 5M impressions / 90 days).

### 8. Grass (Wynd Network) — agent-runnable data nodes
- **URL:** getgrass.io
- **Mechanism:** Run a node that sells residential bandwidth for AI scraping. Agents can spin up many nodes across cloud/residential proxies (gray-area for multi-account).
- **Realistic $:** ~$30/month per node, ~$900/year cap per IP. 8.5M users in 2026.
- **Status:** Single-account official; agent fleets are gray-area.

### 9. Arkham Intel Exchange
- **URL:** intel.arkm.com
- **Mechanism:** Post or solve on-chain intelligence bounties (entity attribution, fund tracing); paid in ARKM. Ultra AI 3.0 + community verify submissions.
- **Realistic $:** $450M+ ARKM bounty activity in Q1 2026 (up 120% YoY). $18M in intel trades Dec 2025. Individual bounties range $500–$50K+.
- **Status:** Agent-friendly (the platform's own engine is AI). Best fit for blockchain-research agents.

### 10. Kaggle / ARC Prize 2026
- **URLs:** kaggle.com/competitions, arcprize.org/competitions/2026
- **Mechanism:** ML/agent competitions with cash prizes. Community Hackathons now allow up to $10K prizes. ARC-AGI-3 milestones: $25K/$10K/$2.5K per round (June + Sept 2026). LLM agent swarms have already won Kaggle comps (telecom-churn, 600K LoC, 850 experiments, March 2026).
- **Realistic $:** $2.5K–$25K per top placement; ARC grand prize structure ladders up to $1M when threshold solved.
- **Status:** Explicitly agent-allowed.

---

## Tier 2 — Plausible but unverified at scale

- **Theoriq (THQ)** — agent vault fees + emissions; 22,000 THQ/day distributed; agent builders collect protocol fees. theoriq.ai. Mostly DeFi yield strategist agents.
- **ElizaOS / ai16z** — framework, not a marketplace; agents must plug into Virtuals/Polymarket/etc. to actually earn. 50K+ agents deployed. elizaos.ai.
- **Morpheus (MOR)** — $10M MOR builder rewards + $20M compute provider rewards; pays agents + compute providers. mor.org.
- **Naptha AI** — decentralized agent compute marketplace, early. naptha.ai.
- **Fetch.ai Agentverse** — 3M registered agents, structured FET pricing for services, but actual buyer-side demand thin. agentverse.ai.
- **Limitless Exchange** — Base L2 prediction market w/ MCP for agents. $200M monthly volume Jan 2026; OI only ~$730K so liquidity-limited vs Polymarket. limitless.exchange.
- **AI Rig Complex (ARC)** — Solana agent framework, $115M market cap; primarily speculative token, agent-direct earning unclear. solanacompass.com/projects/arc.
- **Algora / agentbounty.org / Replit Bounties (deprecated)** — Algora bounties still active; AI-agent policy not stated. Replit Bounties shut down 2026. Agent Bounty advertises $10K+/mo for top hunters; mostly humans.
- **Toku.agency** — Stripe-payouts, 85/15 agent-job board; very small but real fiat rails.
- **Mercor / Outlier / Surge** — data labeling. Agent-assisted labor allowed under the table; explicit agent submission against ToS for most. Surge/Mercor are expert-tier and human-gated.
- **One Trillion Agents Hackathon (NEAR)** — $100K+ prize pool. GitLab AI Hackathon 2026 $65K (Anthropic/Google sponsors). Circle's agent hackathon $30K USDC.

---

## Tier 3 — Agent-allowed gray area

- **Suno / Udio / Spotify** — AI music monetization is explicitly permitted on Suno Pro tier (100% royalties), Spotify pays normal stream rates. Risk: anti-impersonation / spam removals wipe royalties overnight.
- **YouTube / TikTok creator funds** — AI faceless channels working; not officially called "agents."
- **Mechanical Turk / Prolific / UserTesting** — all explicitly ban agent submissions but agents do anyway (low payouts, $0.05–$3/task).
- **x402-enabled apps (Agent.market by Coinbase)** — 69K active agents, 165M txns, $50M volume as of April 2026. agent.market lists agent-API services in 7 categories — providers (your agent) earn USDC per call.
- **Skyfire / Crossmint GOAT / Bedrock AgentCore Payments** — agent-payment rails, not earning destinations themselves but plumbing for everything above.
- **Freysa-style adversarial games** — Act IV $200K+ prize pool. Periodic, jackpot-style. freysa.ai.

---

## Growth-hook design — what makes a directory the "Agent Mining" homepage

Daily-return mechanics:

1. **"Today's highest-yield bounty"** ticker at top — biggest unclaimed Polymarket edge, biggest live Immunefi/Cantina critical, hottest Bittensor subnet by emission ROI, top Kaggle prize closing in 7 days. Recompute every 6h.
2. **Agent Earners Leaderboard** — public on-chain agent wallets (Polymarket, Hyperliquid, Virtuals, Olas Pearl, Bittensor SN6) ranked by trailing 30d $ earned. Link each to the platform listing + a "deploy your own" CTA.
3. **"New opportunity dropped"** push/email when a new bounty >$10K, new Bittensor subnet, new hackathon, or new agent-friendly platform launches. People will return like degens checking airdrops.
4. **Yield estimator** — input compute budget + skill, output expected $/month per platform (calibrated to public leaderboards).
5. **Reverse listings: "Platforms paying agents today"** vs. "Platforms agents pay" — clear visual split.
6. **Agent template library** — one-click forks (Polystrat, Polymarket starter, Hyperliquid bot, Bittensor miner) hyperlinked from each listing.
7. **Weekly "Agent Mining Report"** newsletter — actual P&L of public bot wallets, new bounty drops, postmortems on failed agents. The Bankless of agent mining.

---

## Top 10 launch listings for the agent-mining angle

1. **Polymarket** (+ Polystrat) — biggest, most legible upside, public leaderboards
2. **Hyperliquid** — on-chain leaderboard porn, vault copy-trading
3. **Olas Pearl** — easiest "install and earn" UX, ERC-8004 standards
4. **Virtuals Protocol** — agent tokenization + Revenue Network
5. **Bittensor (Chutes SN64 + Numinous SN6)** — flagship decentralized AI miner stack
6. **Arkham Intel Exchange** — best fit for research/intel agents, real $ flowing
7. **HackerOne / Cantina** — security-agent listing; XBOW lineage gives it narrative weight
8. **Kaggle + ARC Prize 2026** — legitimate, brand-safe, cash prize visibility
9. **Coinbase Agent.market (x402)** — agent-to-agent USDC commerce, fastest-growing
10. **X Creator Revenue Sharing** — for AI persona/content agents (AIXBT-style)
