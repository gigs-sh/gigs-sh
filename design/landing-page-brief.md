# gigs.sh — Landing Page Design Brief

*Self-contained brief. Designer / design agent receives only this file plus the visual reference (https://www.skills.sh/). Output: a landing page design that an engineer can implement directly in Next.js 16 + Tailwind v4 + shadcn/ui.*

---

## 1. The product (read this first)

**gigs.sh is the directory for putting AI agents to work.** A curated, verified registry of 8 platforms where an agent earns by doing actual work — agent task marketplaces (Clustly, Agent Hansa, Toku), bounty boards (HackerOne, Dework), competitions (Kaggle + ARC Prize), content rev share (X Creator), and API monetization (FAL). Excludes gambling, prediction-market betting, crypto trading, and token mining.

What makes this directory different:

1. **Verified.** Every listing has its agent-policy posture and onboarding friction confirmed against first-party documentation, not inferred.
2. **Friction-tiered.** Listings are organized by how long it takes to start earning — `instant` (single API call), `easy` (<30 min), `moderate` (KYC/review), `hard` (deep technical setup). This is the **primary self-selection axis for visitors**.
3. **Agent-readable.** The site is also an MCP server, a REST API, and an A2A Agent Card. A coding agent can call it as a tool, not just a human can browse it.

## 2. Visual reference

Model the design on **[skills.sh](https://www.skills.sh/)**. Study that landing page before sketching. Specifically reuse:

- ASCII-art wordmark in the hero (their "SKILLS" → our "GIGS").
- Quick-start shell command as the first below-hero CTA, dominant visual weight, copy-paste-ready.
- Grid of compatible agent-client logos early on the page (build trust + breadth signal).
- Browsable directory below the fold, with search input + filter chips.
- Restrained, typography-driven palette. No photos, no gradients, no illustrations.
- Multi-column footer organized by link group.

Diverge in these specific ways:

- **Friction tiers, not popularity.** skills.sh sorts by install count; we sort by onboarding-friction tier. We don't have install volume at launch and won't fake it.
- **Cards grouped by tier, not a flat table.** 8 listings is too few for a leaderboard and the tiered grouping IS our editorial signal.
- **Verified-At date prominently per listing.** skills.sh doesn't show recency; we do because verification is our credibility play.

## 3. Audiences (page must serve all three)

| Audience | What they want from the homepage | How the design serves them |
|---|---|---|
| **Human builder** (founder, dev, AI tinkerer) | "Where do I start? Which platform fits my skill level?" | Friction-tier segmented control as the dominant filter; quick-check info on every card (rail, welcomed-status, verified date) |
| **LLM** (ChatGPT search, Perplexity, AI Overviews citing the page) | Quotable claims, dated, structured | First-paragraph claim with verb + number + date; verified-count number prominent; structured cards parseable as JSON-LD `CollectionPage` + `ItemList` |
| **Agent** (Claude Code, Cursor, custom MCP clients) | One-click connect to the MCP server | "Install in your agent" button row with one-click deeplinks: Claude Desktop, Cursor, ChatGPT, custom MCP |

The page must NOT feel like it was designed only for one of these — every section needs to land for all three.

## 4. The 8 launch listings (designer reference)

These need to fit comfortably in the browse section. Treat each as a card with: platform name (link), category tag, payment-rail badge, agent-welcomed badge (`welcomed` / `allowed` / `tolerated`), verifiedAt date.

### Instant (2)
- **Clustly.ai** — agent-task-marketplace — USDC/Solana — welcomed
- **Agent Hansa** — agent-task-marketplace — USDC — welcomed

### Easy (3)
- **Toku.agency** — agent-task-marketplace — Stripe/USD — welcomed
- **Dework** — dev-bounty — USDC/multi-chain — tolerated
- **X Creator Revenue Sharing** — content — Stripe/USD — allowed

### Moderate (2)
- **HackerOne / Cantina** — security-bounty — Stripe/wire — allowed
- **FAL** — api-monetization — Stripe/USD — allowed

### Hard (1)
- **Kaggle + ARC Prize 2026** — competition — USD — allowed

## 5. Page anatomy

Implement these 10 sections, in this order, top to bottom.

### Section 1 — Header / nav

- Sticky on scroll.
- Left: monospace wordmark `gigs.sh` (small, clickable, returns to top).
- Right: text links — `Gigs` · `Categories` · `Templates` · `MCP` · `Docs` · `GitHub` (external).
- Background: white in light mode, near-black in dark mode. 1px bottom border for separation when scrolled.

### Section 2 — Hero

- ASCII-art wordmark "GIGS" as the dominant visual element. Treat as the brand mark. Render with monospace.
- Below: one-line tagline in regular text — *"The directory for platforms where AI agents earn money."*
- Below tagline: a sub-line in muted color — *"19 platforms verified · last updated 2026-05-18"* (date dynamically updated by the build).
- Single column, centered, generous vertical padding. No image, no decoration.

### Section 3 — Quick-start command

- Full-width code block, monospace, dark background (works in both light and dark modes).
- Content: `$ npx gigs find "agent-task-marketplace"`
- A "Copy" button (top-right inside the block) that copies the command.
- Below the block, two faded alt examples in smaller text: `$ npx gigs view clustly` and `$ npx gigs categories`.
- This is the install moment. Visual weight should be high — it's the second-most prominent element on the page after the hero wordmark.

### Section 4 — Install in your agent

- Heading: small, e.g., "Or call it from your agent — one-click connect:"
- Below: 4 buttons arranged in a row (single column on mobile):
  - **Claude Desktop** — deeplink: `claude://mcp/add?url=https://gigs.sh/api/mcp`
  - **Cursor** — deeplink: `cursor://anysphere.cursor-deeplink/mcp/install?...`
  - **ChatGPT** — link to Connectors directory submission URL once approved
  - **Custom MCP** — opens a modal with a copy-pasteable URL
- Each button shows the client logo (or a clean monospace label if logo is unavailable/heavy) + the action ("Add to Claude").

### Section 5 — Browse the gigs (the meat of the page)

The dominant section. High info density. Must work at 320px width.

- **Search input** spanning full width, placeholder: *"Search 8 platforms by name, category, or payment rail…"*
- **Friction-tier segmented control** immediately below the search — 4 chips: `Instant (2)` · `Easy (3)` · `Moderate (2)` · `Hard (1)`. Clicking a chip filters the cohort. Default state: all four selected (show everything).
- **Secondary category chip row** (smaller, less visually weighty): `agent-task-marketplace` · `security-bounty` · `dev-bounty` · `competition` · `content` · `api-monetization`. Multi-select.
- **Listings grid**, grouped by tier with tier-headers above each group:
  - "Instant onboarding — single API call, first earnings in minutes"
  - "Easy onboarding — signup + wallet, <30 min to first earnings"
  - "Moderate onboarding — KYC, review, or non-trivial setup"
  - "Hard onboarding — application, partnership, or deep technical work"
- **Each listing card** contains:
  - Platform name (large, link).
  - Quick-check banner row: friction-tier badge · welcomed-status badge · payment-rail badge · `Verified 2026-05-18` date. Use monospace for the rail and date; use bold sans for the platform name.
  - One-line excerpt (the listing's `excerpt` frontmatter field, ~120 chars).
  - Category tag (clickable, filters by category).
  - Click target: whole card → `/p/[slug]` listing page.
- Empty state: when filters return zero results, show *"No platforms match these filters. Try broader criteria or [reset]."*

### Section 6 — Category index

Compact section below the browse section. 6 categories as cards or text links — pick whichever reads better in your design. Each card shows category name + a count of listings in it.

Layout suggestion: 3-column grid on desktop, 2-column on tablet, single-column on mobile. Cards are small (4 lines max).

### Section 8 — Trust strip

A single horizontal row, visually understated but informational:

> *19 platforms verified · last updated 2026-05-18 · MIT (code) + CC-BY-4.0 (content) · No sponsored placement*

Centered, muted text, small.

### Section 9 — Newsletter signup

- Heading: "Get the weekly agent-mining report"
- Sub: One sentence describing what subscribers get.
- Single email field + submit button, inline.
- Honeypot field (hidden) for spam.
- Success state below replaces the form on submission.

### Section 10 — Footer

Multi-column (5 columns on desktop, collapsing to 2 on mobile, single on phone).

- **Browse:** All gigs · Templates · Search · Sitemap
- **By tier:** Instant · Easy · Moderate · Hard
- **By category:** (link to each of the 11 categories)
- **Agent surfaces:** MCP server · REST API · OpenAPI · Agent Card · agents.json · llms.txt
- **Project:** About · Contribute · GitHub · License · Manifesto

Bottom row: `gigs.sh · 2026 · MIT/CC-BY-4.0 · No sponsored placement · Open-source`.

## 6. Visual language

### Typography

- **Display / wordmark:** monospace, ASCII-art treatment for the hero "GIGS" wordmark. Suggest JetBrains Mono or a system mono fallback.
- **Body:** sans-serif (Inter or system stack), regular weight, comfortable line-height (1.5–1.6).
- **Code / commands:** monospace (same family as wordmark), slightly smaller than body.
- **Listing platform names:** sans-serif, semibold.
- **Badges (friction, rail, welcomed):** monospace, all-caps or small-caps for the rail/date metadata.

### Color

- **Light mode:** white background `#ffffff`, near-black text `#0a0a0a`, muted text `#6b7280`, accent green `#16a34a` (used sparingly for "go" / welcomed signals), border gray `#e5e7eb`.
- **Dark mode:** near-black background `#0a0a0a`, near-white text `#fafafa`, muted text `#9ca3af`, accent green `#22c55e`, border gray `#1f2937`.
- Apply via `prefers-color-scheme`. No manual toggle in v1.

### Density

- Hero, quick-start, featured callout: **spacious**. One idea per section, generous whitespace.
- Browse section: **dense**. The cohort is the meat. Cards can be compact and scannable.
- Footer: dense but organized by group.

### What NOT to do

- No photographs.
- No gradient backgrounds.
- No illustrations or mascots.
- No animations beyond simple hover states and the copy-button feedback.
- No emoji in the design (use Lucide icons sized to body text or smaller).
- No "Sign up to see the listings" or any other gating. The cohort is 100% public.

## 7. Constraints

- **Responsive.** Must work at 320px viewport width up to ultrawide. Browse section should be scannable on mobile (cards stack to a single column).
- **Accessibility.** Lighthouse a11y score must hit ≥95. All interactive elements keyboard-navigable. Color contrast meets WCAG AA. Filter chips must be reachable via Tab and operable via Enter/Space.
- **Performance.** Above-the-fold renders in <1s on Vercel preview. Largest Contentful Paint <2s. No client-side JS for the initial render (Next.js 16 SSG).
- **SEO.** Page renders `WebSite` + `Organization` + `ItemList` (for the cohort) JSON-LD. Canonical URL set. OpenGraph + Twitter card metadata.
- **No tracking until consent.** Vercel Analytics is OK (cookieless). Plausible loads after the page is interactive. No third-party scripts above the fold.

## 8. Implementation hints (for engineer handoff)

- **Framework:** Next.js 16 App Router, SSG via `generateStaticParams`.
- **UI primitives:** shadcn/ui components (Button, Input, Card, Badge, Tabs for the segmented control, Tooltip for hover details).
- **Icons:** Lucide React (the shadcn default). Use `Terminal`, `Zap`, `Check`, `AlertTriangle`, `ArrowUpRight` etc. — never raw emoji.
- **Content source:** the 8 listings come from `content/listings/*.mdx` via Velite. The homepage reads the index at build time, no runtime fetches.
- **Search:** Pagefind indexes the build output. The search input on the homepage uses Pagefind's client-side API.
- **Friction-tier filter state:** URL-encoded query param (`?friction=instant,easy`) so links are shareable and SSR-renderable.

## 9. Deliverables expected from the design pass

Provide whichever of these you can — at minimum (a) and (b):

1. **A full mockup of the landing page** (desktop + mobile breakpoints). PNG, Figma frame, or detailed ASCII/markdown layout — designer's choice.
2. **A component inventory** — list every shadcn/ui component and Lucide icon needed, plus any custom components (e.g., `<FrictionBadge />`, `<QuickCheckBanner />`).
3. **A short style spec** — final color tokens, type scale (sizes + weights), spacing rhythm (Tailwind scale unit chosen as the base — 4 or 8?). Tailwind utility-class examples are great.
4. **Tier-card and category-card visual variants** — show 3–4 representative cards (e.g., one Instant, one Easy, one Hard) so the engineer knows the exact layout per state.

## 10. Acceptance criteria (designer's work is done when…)

- The mockup shows all 10 sections in order.
- The 19 launch listings (per §4) fit comfortably in the browse section.
- The friction-tier segmented control is the visually dominant filter element on the page.
- The quick-start command block is the second-most-prominent visual element (after the hero wordmark).
- Mobile mockup at 375px width is provided and legible.
- Dark-mode variant of the hero + browse section is provided.
- All color tokens, type sizes, and spacing values are specified in Tailwind units.
- The output is self-contained: an engineer could implement directly without further design clarification.

---

*Hand this brief to a design AI or a human designer. Output should be implementable in 1–2 days against the spec above and the constraints in PRD §6 F14.*
