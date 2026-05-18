# gigs.sh — Design Briefs

*Drop this entire `design/` folder into a fresh claude.ai or design-AI session. Together these briefs cover every page needed for the v1 launch.*

## What's here

| File | Covers |
|---|---|
| [`landing-page-brief.md`](./landing-page-brief.md) | Homepage at `gigs.sh/` — hero, install commands, install-in-your-agent grid, the 19-platform cohort browser with friction-tier filtering, featured Polymarket starter, category index, newsletter, footer. **Start here.** |
| [`listing-detail-page-brief.md`](./listing-detail-page-brief.md) | Per-platform page at `gigs.sh/p/[slug]` — the page each listing card on the homepage links to. Quick-check banner, key-facts table, TL;DR, agent quickstart (with official platform commands), editorial body, template section, related listings. |

Other pages in v1 (per PRD §6 F4) **reuse the components from the two briefs above** — no separate brief needed:

- **Friction-tier pages** `/f/[friction]` — 4 pages (instant/easy/moderate/hard). Same shape as the homepage's "Browse the gigs" section, pre-filtered to one tier. Add a tier-specific intro paragraph above the cards.
- **Category pages** `/c/[category]` — 11 pages. Same shape as `/f/[friction]` but filtered by `categories`.
- **Alternatives pages** `/alternatives/[slug]` — 19 pages. Renders the listing's quick-check banner from the detail brief, then a card grid of 4–6 platforms in the same category. Pure SEO surface.
- **Compare pages** `/compare/[pair]` — ~25 hand-picked pairs. Two `KeyFactsTable` components side-by-side (from the detail brief) + a short editorial intro. Pure SEO surface.

## How to run the design pass

1. **Open a fresh Claude or design-AI session.** Paste this README first.
2. **Send the landing-page brief** as the main task. Reference [https://www.skills.sh/](https://www.skills.sh/) as the visual model.
3. **Once the landing-page mockup returns**, send the listing-detail brief in the same session with: *"Same visual system as the landing page you just designed. Apply it to the detail page."*
4. **Verify both mockups together** — color tokens, type scale, spacing rhythm, dark mode treatment should match.

Expected total design time: ~1 day if the design AI is fast; 2 days if iterating.

## Component reuse map

These components ship with the landing page and are reused on every other page:

- `<FrictionBadge tier="instant|easy|moderate|hard" />`
- `<AgentWelcomedBadge value={true|false} />`
- `<PaymentRailBadge rail="usdc-solana" />`
- `<VerifiedAtBadge date="2026-05-18" />`
- `<QuickCheckBanner {...listing} />` — the line under each H1
- `<ListingCard variant="default|compact" {...listing} />` — used in the homepage cohort browser, related-listings block, alternatives pages, category pages
- `<KeyFactsTable {...listing} />` — used in the detail page and the compare pages
- `<FilterBar />` — used in the homepage and the friction-tier / category pages
- `<InstallButton client="claude-desktop|cursor|chatgpt|custom-mcp" />` — used in the homepage and footer
- `<CopyableCodeBlock language="bash" />` — used in the homepage quick-start and every detail page's agent quickstart

If the design AI returns a mockup that introduces a new component, name it explicitly so the engineer doesn't accidentally reinvent it.

## Style consistency requirements

- **Color tokens** identical across both briefs.
- **Type stack** identical (monospace family + sans family).
- **Dark mode** implemented via `prefers-color-scheme` with no manual toggle.
- **No emoji, photos, gradients, illustrations, or animations** beyond hover states and the copy-button feedback. Lucide icons only.
- **Tier color tokens** (defined in the detail-page brief) used consistently anywhere a tier is referenced — the homepage filter chips, the detail-page banner, the related-listings cards.

## Acceptance — designer's work is launch-ready when…

- All 10 sections of the landing page are mocked at desktop + mobile breakpoints (per landing brief §10).
- All 9 sections of the listing detail page are mocked for at least 3 representative listings (Polymarket / Clustly / Akash) at desktop + mobile (per detail brief §9–§10).
- Dark mode variants provided for each major view.
- Component inventory lists every reusable piece, mapped to shadcn/ui primitives and Lucide icons.
- A short style spec is delivered: color tokens, type scale, spacing scale — in Tailwind units.
- The output is self-contained: an engineer can implement v1 directly from these mockups + briefs without further design clarification.

---

*The PRD ([../PRD.md](../PRD.md)) is the source of truth for everything that informs these designs: features, content model, the 19 launch listings, the architecture. Designer doesn't need to read it cover-to-cover; the briefs surface the relevant excerpts.*
