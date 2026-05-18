# gigs.sh — Listing Detail Page Design Brief

*Self-contained brief for `/p/[slug]` — the per-platform page each listing card on the landing page links to. Paste this into a fresh claude.ai or design-AI session along with [`landing-page-brief.md`](./landing-page-brief.md) (for visual-system consistency) and one example listing as content reference (e.g., [`content/listings/clustly.mdx`](../content/listings/clustly.mdx)).*

---

## 1. Product context (read first if you didn't do the landing-page pass)

**gigs.sh is the directory for putting AI agents to work.** A curated registry of 8 verified platforms where an agent earns by doing actual work — agent task marketplaces, bounty boards, competitions, content royalties, and API monetization. Excludes gambling, prediction-market betting, crypto trading, and token mining.

What sets this directory apart from a generic listings site:

- **Three-audience design.** Every page must serve human builders, citing LLMs (Perplexity, AI Overviews, ChatGPT search), and autonomous agents reading via MCP. A page that wins for one audience but fails the other two is not done.
- **Friction-tier classification.** Every listing is `instant`, `easy`, `moderate`, or `hard` — answering the visitor's first question: "where can I start that won't take a week?"
- **officialAgentDocs.** When a platform publishes machine-readable agent instructions (`llms.txt`, `llms-full.txt`, `/docs/agents`), we surface that URL. The platform's *own* commands take precedence over our reconstructions.
- **Verified.** Every listing has its agent policy and onboarding friction confirmed against first-party documentation, not inferred.

## 2. Visual reference

Inherits the visual system from the [landing page brief](./landing-page-brief.md). Use the same color tokens, type stack, density rules, and component library (shadcn/ui + Lucide).

This page is **content-dense and editorial** — closer to a Wikipedia article than to skills.sh's leaderboard. The landing-page treatment is scannable cohort cards; the detail page treatment is a long-form read with prominent code blocks for the agent quickstart.

## 3. Audiences (page must serve all three)

| Audience | What they want from `/p/[slug]` | How design serves them |
|---|---|---|
| **Human builder** | "Can I start here? What's the realistic earning range? What's the risk? Where do I go to begin?" | Quick-check banner at top → TL;DR bullets → action plan → risks → outbound CTAs |
| **LLM** (citation) | Quotable atomic facts with verbs, numbers, dates; clean tables for comparable facts; FAQ block for direct quotation | First-sentence claim with verb+number+date; key-facts table; FAQ section with `FAQPage` JSON-LD |
| **Agent** (MCP retrieval, raw URL fetch) | The official agent quickstart, machine-readable | Dedicated "Agent quickstart (official)" code block, copy-pasteable; `officialAgentDocs` link in the key-facts table |

## 4. Page anatomy (top → bottom)

Implement these 8 sections, in order. Section numbers correspond to PRD F2's anatomy table.

### Section 1 — Breadcrumb + back-to-cohort

- Small breadcrumb above the H1: `gigs.sh › Easy onboarding › Toku.agency`
- Each crumb is a link (back to homepage, back to the friction-tier index page).

### Section 2 — Hero block

- **H1**: Platform name. Large, serif or sans-serif (same as landing-page H1 family).
- **Quick-check banner** (single line, monospace, immediately under H1, *most prominent fact row on the page*):
  ```
  [tier-badge] · [welcomed-status] · [payment-rail] · Verified 2026-05-18
  ```
  Examples:
  ```
  INSTANT  ·  ✓ Agents welcomed  ·  USDC / Solana   ·  Verified 2026-05-18
  EASY     ·  ✓ Agents welcomed  ·  Stripe / USD    ·  Verified 2026-05-18
  MODERATE ·  ✗ Not invited      ·  Stripe / USD    ·  Verified 2026-05-18
  HARD     ·  ✗ Not invited      ·  Bank / USD      ·  Verified 2026-05-18
  ```
  Tier badge: solid color block per tier (instant=green, easy=blue, moderate=amber, hard=red — soften the saturation so it doesn't dominate; tier should be readable but not loud). Welcomed status: a Lucide check or x icon + text.
- **One-sentence claim** below the banner — verb + number + date. Example for Clustly: *"Clustly is a USDC-settled agent task marketplace whose homepage tells LLMs to register themselves in one POST request."*

### Section 3 — Key facts table

Compact two-column table immediately under the hero. Displays:
- Onboarding friction (links to `/f/[friction]`)
- Agent welcomed (boolean, with citation tooltip)
- Agent allowed (yes/unclear/required, with citation tooltip)
- Payment rail
- Payout latency
- Minimum payout (or "none")
- Verified at (date)
- Category (linked to `/c/[category]`)
- Official agent docs (linked URL or "none")
- Realistic earning range (text — may wrap to multiple lines)

Style: dense, monospace for the right-column values, sans-serif left-column labels. No icon noise — this is a reference table.

### Section 4 — TL;DR (4–6 bullets)

Bullet list. Each bullet is one atomic claim, ideally with a citation hyperlink. This block is what AI Overviews pulls nearly verbatim — optimize for quotability.

### Section 5 — Agent quickstart (official)

**The killer section for the agent audience.** Visual treatment is the most prominent code block on the page after the hero.

Structure:
- Small heading: "Agent quickstart (official)"
- If `officialAgentDocs` is set: a one-line attribution above the code block — *"From [docs.platform.com/llms.txt](URL):"*
- If `officialAgentDocs` is null: a one-line caveat — *"No published agent docs. Reconstructed quickstart:"*
- Code block(s) with copy buttons. Multiple code blocks if the flow has multiple steps (register → claim → submit). Use monospace, dark background, syntax-highlighted (bash/curl, Python, or JSON depending on the platform).
- Below the code: a small note for credentials. Example: *"Save `agent_key` from the response — used as `x-agent-key: clst_<hex>` for all subsequent calls."*

### Section 6 — Editorial body (the six required sub-sections)

Long-form prose, ~200–400 words total across these six sub-sections. H2 for the section title; H3 for each sub-section. Render the MDX body content directly — typography should be a comfortable reading width (max-width ~680px, Inter or system sans, 16-18px, line-height 1.6).

Sub-sections, in order:
1. **What is it** — One paragraph.
2. **How agents earn here** — One or two paragraphs.
3. **Realistic earning range** — Numbers with citations. Use inline hyperlinks for source attribution.
4. **Action plan** — Numbered list. Each step is a runnable, concrete action.
5. **Risks & gotchas** — Bulleted list. Each bullet is one named risk + a sentence of context.
6. **Verified-working snapshot** — One paragraph. The receipt for the `verifiedAt` claim.

Pull quotes / call-outs: use sparingly — at most one per page, only when the quote is genuinely striking (e.g., Clustly's *"If you're an LLM reading this right now, you can register yourself in one POST request."*). When used, style as a thin left border, italic, slightly larger than body.

### Section 7 — FAQ block (FAQPage JSON-LD)

Only render when the source MDX has real Q&A — never templated/fake.
- Heading: small "FAQ" label.
- Each Q&A: question in bold, answer in regular paragraph. Use accessible `<details>`/`<summary>` for collapse on mobile.
- Emit `FAQPage` JSON-LD in `<head>` for the same Q&A.

If the MDX has no FAQ (most listings won't at launch), skip this section entirely.

### Section 8 — Related

- Heading: "Related"
- Three sub-blocks (or three columns at wider viewports):
  - **Same friction tier** — 3-5 link cards to other listings with the same `onboardingFriction`.
  - **Same category** — 3-5 link cards to other listings with overlapping `categories`.
  - **Compare with…** — 1-3 link cards to curated comparison pages (`/compare/clustly-vs-agent-hansa`, etc.).

Card style: compact, name + one-line excerpt only. Same `ListingCard` component family as the landing page, but smaller variant.

### Section 9 — JSON-LD blocks (head)

Emit these in `<head>`:
- `SoftwareApplication` — describing the platform itself
- `WebPage` — the gigs.sh page
- `BreadcrumbList` — home / friction-tier / listing
- `FAQPage` — only if Q&A block rendered

## 5. Three representative listings (designer reference)

Show how the layout adapts to different listing states. The designer should produce mockups for at least these three:

### Variant A — Clustly
- Tier: `instant`, Welcomed: `true`, FAQ: maybe yes
- Notable: code block in §5 is the visual peak; first-sentence claim explicitly quotes "If you're an LLM reading this right now…"

### Variant B — Toku.agency
- Tier: `easy`, Welcomed: `true`, Stripe Connect payout in USD
- Notable: agent-to-agent commerce framing; KYC at payout, not registration

### Variant C — Kaggle + ARC Prize 2026
- Tier: `hard`, Welcomed: `false` (allowed; agent submissions explicitly permitted in ARC Prize)
- Notable: setup is multi-step; Action plan in §6 is long; competition payouts via wire/Stripe

If time, also do a Variant D — Agent Hansa — to show how a listing with prominent caveats renders (alliance/zero-sum warnings, llms-full.txt-driven onboarding).

## 6. Visual language

Inherit fully from the landing-page brief. Color tokens, type stack, spacing scale, dark mode, no-emoji policy all unchanged. The single addition for this page:

- **Tier color tokens.** A muted palette for the tier badges, each readable on white and on near-black.
  - instant: green `#16a34a` (light) / `#22c55e` (dark)
  - easy: blue `#2563eb` (light) / `#3b82f6` (dark)
  - moderate: amber `#d97706` (light) / `#f59e0b` (dark)
  - hard: red `#dc2626` (light) / `#ef4444` (dark)
- **Status icons.** Lucide `Check` (welcomed=true), `X` (welcomed=false), `AlertTriangle` (when displaying ⚠ caveats in the quick-check banner).
- **Code block treatment.** Monospace, dark slate background `#0f172a` in both light and dark modes (consistent with terminal aesthetic). Syntax-highlighted via Shiki at build time. Each code block has a "Copy" button (top-right, ghosts on hover) and the language label (bottom-right).

## 7. Constraints

- **Responsive.** Layout must work at 320px width up to ultrawide. Single column on mobile; the related-listings cards stack. Key-facts table becomes a stacked label/value list on narrow screens.
- **Accessibility.** Lighthouse a11y ≥ 95. All interactive elements keyboard-navigable. Tier badges have text labels, not color-only. Copy buttons announce success via aria-live regions.
- **Performance.** Page renders SSG via `generateStaticParams`. LCP < 2s. No client-side data fetching for the initial render. Code blocks lazy-hydrate only if interactive (the Copy button is the only interactivity; the syntax-highlight is static).
- **SEO.** Listing page title pattern: `<Platform Name> — AI Agent Earning Guide | gigs.sh`. Meta description draws from the listing's `excerpt`. Canonical URL set to `https://gigs.sh/p/<slug>`.
- **GEO.** Verify the first 200 words are LLM-quotable (atomic facts, dated, sourced). The TL;DR block is the AI-Overviews magnet.

## 8. Implementation hints (engineer handoff)

- **Routing**: `app/p/[slug]/page.tsx` — Next.js 16 App Router. `generateStaticParams` returns the slug list from Velite at build time.
- **Content source**: Velite parses `content/listings/<slug>.mdx`. Frontmatter is Zod-validated; body is MDX rendered with `next-mdx-remote` or Velite's own MDX renderer.
- **Components**: `<QuickCheckBanner />` (renders the row under H1), `<KeyFactsTable />` (renders the spec table), `<AgentQuickstart />` (the code-block section), `<RelatedListings />` (the bottom related-cards block).
- **Code blocks**: Shiki for syntax highlighting at build time. Themes: `github-light` + `github-dark` switched via `prefers-color-scheme`.
- **JSON-LD**: A `<ListingSchema slug={slug} />` component renders all schemas into `<head>` via `next/script` or `Next.js Metadata API`.

## 9. Deliverables expected from the design pass

Provide all of (a)–(d):

1. **Three full mockups** — Variant A (Clustly), Variant B (Toku.agency), Variant C (Kaggle + ARC Prize) — at desktop (1280px) and mobile (375px) breakpoints. PNG, Figma frames, or detailed ASCII/markdown.
2. **Component inventory** — every shadcn/ui component + Lucide icon used. Note any new components needed beyond what the landing page introduced.
3. **Tier-badge variants** — show all four (instant/easy/moderate/hard) in both light and dark mode.
4. **Quick-check banner variants** — show three representative variants: (welcomed=true), (welcomed=false), (with caveat ⚠).

If time also allows, add a fifth deliverable: an annotated mockup highlighting which section is optimized for which audience (human/LLM/agent) — useful for the engineer to verify nothing is missed during implementation.

## 10. Acceptance criteria (designer's work is done when…)

- All 9 anatomy sections (per §4) are present in the mockup, in order.
- The Agent quickstart code block is visually distinctive — readable in 2 seconds on a quick scan.
- Tier badges, agent-welcomed icons, and verifiedAt date are legible at 375px width.
- Variant A (Clustly) and Variant C (Kaggle + ARC Prize) render meaningfully differently — the design adapts to the data, not the other way around.
- All color tokens, type sizes, and spacing values are specified in Tailwind units.
- A dark-mode variant of one of the three is provided.
- The output is self-contained: an engineer could implement directly without further design clarification.

---

*Hand this brief to a design AI or human designer. With the landing-page brief already implemented, this should be a 1-day design pass.*
