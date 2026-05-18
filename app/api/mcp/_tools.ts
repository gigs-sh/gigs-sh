// Tool registration for the gigs.sh MCP server.
//
// This module exports a single `registerTools` function that wires all nine
// tools described in the gigs.sh PRD §6 F5 onto an `McpServer` instance. It is
// kept in `app/api/mcp/_tools.ts` (underscore prefix) so Next.js does NOT
// treat it as a route segment.

import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

import {
  getAllListings,
  getListing,
  type Listing,
  type Tier,
} from "@/lib/listings";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

const FRICTION_VALUES = ["instant", "easy", "moderate", "hard"] as const;
const AGENT_ALLOWED_VALUES = ["yes", "unclear", "required", "no"] as const;

type AgentAllowedFilter = (typeof AGENT_ALLOWED_VALUES)[number];

/**
 * Wrap a JSON-serialisable payload in the MCP `content` envelope. We use a
 * single `text` block whose body is `JSON.stringify(payload)` — the
 * MCP-recommended pattern for "give the model structured data".
 */
function jsonResult(payload: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(payload),
      },
    ],
  };
}

function matchesQuery(listing: Listing, q: string): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return (
    listing.title.toLowerCase().includes(needle) ||
    listing.excerpt.toLowerCase().includes(needle)
  );
}

function matchesCategory(listing: Listing, category: string): boolean {
  const needle = category.trim().toLowerCase();
  if (!needle) return true;
  return listing.categories.some((c) => c.toLowerCase() === needle);
}

function matchesRail(listing: Listing, rail: string): boolean {
  const needle = rail.trim().toLowerCase();
  if (!needle) return true;
  // Case-insensitive substring match: "usdc" matches "usdc-solana".
  return listing.paymentRails.some((r) => r.toLowerCase().includes(needle));
}

function matchesAgentAllowed(
  listing: Listing,
  status: AgentAllowedFilter
): boolean {
  // `Listing.agentAllowed` is typed as `AgentAllowed = "yes" | "unclear" |
  // "required"`, but the upstream YAML can in principle produce `"no"` too
  // (and `coerceFrontmatter` will pass it through). We compare as strings to
  // stay forward-compatible.
  return (listing.agentAllowed as string) === status;
}

// ---------------------------------------------------------------------------
// Tool registration
// ---------------------------------------------------------------------------

export function registerTools(server: McpServer): void {
  // 1. search_gigs ----------------------------------------------------------
  server.registerTool(
    "search_gigs",
    {
      title: "Search gigs",
      description:
        "Free-text + faceted search across all gigs.sh platform listings. " +
        "Use this when an agent or user has a fuzzy question like 'where can I earn USDC from prediction markets?'. " +
        "`q` does a case-insensitive substring match against title + excerpt. " +
        "Facets (`category`, `rail`, `friction`, `welcomed`) narrow the result set; each is optional. " +
        "Returns up to `limit` listings (default 20, max 100), already sorted instant → easy → moderate → hard.",
      inputSchema: {
        q: z
          .string()
          .optional()
          .describe("Case-insensitive substring matched against title + excerpt."),
        category: z
          .string()
          .optional()
          .describe(
            "Exact category slug from `list_categories`, e.g. 'prediction-market'."
          ),
        rail: z
          .string()
          .optional()
          .describe(
            "Payment rail substring, e.g. 'usdc' matches usdc-solana / usdc-base."
          ),
        friction: z
          .enum(FRICTION_VALUES)
          .optional()
          .describe("Onboarding friction tier."),
        welcomed: z
          .boolean()
          .optional()
          .describe(
            "If true, only platforms that explicitly welcome agents (agentWelcomed=true)."
          ),
        limit: z
          .number()
          .int()
          .min(1)
          .max(MAX_LIMIT)
          .optional()
          .describe(`Max results to return. Default ${DEFAULT_LIMIT}, max ${MAX_LIMIT}.`),
      },
    },
    async ({ q, category, rail, friction, welcomed, limit }) => {
      const all = getAllListings();
      const filtered = all.filter((l) => {
        if (q && !matchesQuery(l, q)) return false;
        if (category && !matchesCategory(l, category)) return false;
        if (rail && !matchesRail(l, rail)) return false;
        if (friction && l.onboardingFriction !== friction) return false;
        if (welcomed !== undefined && l.agentWelcomed !== welcomed) return false;
        return true;
      });
      const cap = limit ?? DEFAULT_LIMIT;
      const results = filtered.slice(0, cap);
      return jsonResult({ count: results.length, results });
    }
  );

  // 2. get_gig --------------------------------------------------------------
  server.registerTool(
    "get_gig",
    {
      title: "Get gig",
      description:
        "Fetch a single listing by slug, including the full MDX `body` and parsed `agentQuickstart` block. " +
        "Use this after `search_gigs` to get the full details and code sample for one platform. " +
        "Returns `{ error: 'not_found' }` when the slug is unknown.",
      inputSchema: {
        slug: z
          .string()
          .describe("Listing slug, e.g. 'polymarket'. See `search_gigs` results."),
      },
    },
    async ({ slug }) => {
      const listing = getListing(slug);
      if (!listing) return jsonResult({ error: "not_found" });
      return jsonResult(listing);
    }
  );

  // 3. list_categories ------------------------------------------------------
  server.registerTool(
    "list_categories",
    {
      title: "List categories",
      description:
        "Return the deduplicated, sorted set of category slugs across all listings. " +
        "Use this to discover valid values for the `category` facet on `search_gigs`.",
      inputSchema: {},
    },
    async () => {
      const set = new Set<string>();
      for (const l of getAllListings()) {
        for (const c of l.categories) set.add(c);
      }
      const categories = Array.from(set).sort();
      return jsonResult({ categories });
    }
  );

  // 4. find_by_payment_rail -------------------------------------------------
  server.registerTool(
    "find_by_payment_rail",
    {
      title: "Find gigs by payment rail",
      description:
        "Return all listings whose `paymentRails` include the given rail. " +
        "Matching is case-insensitive substring, so 'usdc' matches both 'usdc-solana' and 'usdc-base'. " +
        "Use for questions like 'which platforms pay in USDC on Base?' (then pass 'usdc-base').",
      inputSchema: {
        rail: z
          .string()
          .min(1)
          .describe(
            "Rail name or substring, e.g. 'usdc', 'usdc-solana', 'stripe', 'x402'."
          ),
      },
    },
    async ({ rail }) => {
      const results = getAllListings().filter((l) => matchesRail(l, rail));
      return jsonResult({ count: results.length, results });
    }
  );

  // 5. find_by_agent_allowed ------------------------------------------------
  server.registerTool(
    "find_by_agent_allowed",
    {
      title: "Find gigs by agent-allowed status",
      description:
        "Return listings whose `agentAllowed` value equals the given status. " +
        "'yes' = agents permitted per ToS / official docs. " +
        "'required' = the platform is agent-only (e.g. Bittensor, Olas). " +
        "'unclear' = no explicit ToS guidance; tolerated in practice. " +
        "'no' = agents explicitly disallowed (none in v1 of the directory).",
      inputSchema: {
        status: z
          .enum(AGENT_ALLOWED_VALUES)
          .describe("Agent-allowed status to filter on."),
      },
    },
    async ({ status }) => {
      const results = getAllListings().filter((l) =>
        matchesAgentAllowed(l, status)
      );
      return jsonResult({ count: results.length, results });
    }
  );

  // 6. find_by_onboarding_friction -----------------------------------------
  server.registerTool(
    "find_by_onboarding_friction",
    {
      title: "Find gigs by onboarding friction (newcomer-friendly entry point)",
      description:
        "PRIMARY newcomer-facing tool. Filter listings by how hard onboarding is. " +
        "Use 'instant' to find platforms where agents can register and start earning in a single API call (no KYC, no review) — best for first-time integrators. " +
        "'easy' = <30 min, signup + wallet, no KYC. " +
        "'moderate' = KYC, review, or non-trivial setup. " +
        "'hard' = application, partnership, or deep technical work (e.g. running a Bittensor subnet). " +
        "If an agent is asking 'where do I start?', call this with friction='instant'.",
      inputSchema: {
        friction: z
          .enum(FRICTION_VALUES)
          .describe(
            "Onboarding-friction tier: instant | easy | moderate | hard."
          ),
      },
    },
    async ({ friction }) => {
      const results = getAllListings().filter(
        (l) => l.onboardingFriction === (friction as Tier)
      );
      return jsonResult({ count: results.length, results });
    }
  );

  // 7. find_by_agent_welcomed -----------------------------------------------
  server.registerTool(
    "find_by_agent_welcomed",
    {
      title: "Find gigs by agent-welcomed flag",
      description:
        "Return listings where `agentWelcomed` matches the given boolean. " +
        "`agentWelcomed=true` is a stronger signal than `agentAllowed='yes'`: the platform " +
        "actively markets to / supports agents (docs, SDK, agent-specific surface area). " +
        "Use `welcomed=true` to find platforms most likely to stay agent-friendly long-term.",
      inputSchema: {
        welcomed: z
          .boolean()
          .describe("true = only agent-welcomed; false = only NOT agent-welcomed."),
      },
    },
    async ({ welcomed }) => {
      const results = getAllListings().filter(
        (l) => l.agentWelcomed === welcomed
      );
      return jsonResult({ count: results.length, results });
    }
  );

  // 8. list_templates -------------------------------------------------------
  server.registerTool(
    "list_templates",
    {
      title: "List starter templates",
      description:
        "Return listings that ship an official starter-template repo (`templateRepo !== null`). " +
        "At v1 only Polymarket has a published template. Use this to enumerate what `get_template` will accept.",
      inputSchema: {},
    },
    async () => {
      const results = getAllListings().filter((l) => l.templateRepo !== null);
      return jsonResult({ count: results.length, results });
    }
  );

  // 9. get_template --------------------------------------------------------
  server.registerTool(
    "get_template",
    {
      title: "Get starter template",
      description:
        "Return the starter-template bundle for a listing: the MDX `body` as README, plus a synthesized manifest. " +
        "Returns `{ error: 'no_template' }` when the listing has no `templateRepo`. " +
        "NOTE: the canonical template manifest will live at `starters/<slug>/template.json` in the repo " +
        "(not built yet at v1). The `envVars` array and `deploy` URLs returned here are stubs that will be " +
        "replaced once the starters/ directory ships.",
      inputSchema: {
        slug: z
          .string()
          .describe("Listing slug whose template you want, e.g. 'polymarket'."),
      },
    },
    async ({ slug }) => {
      const listing = getListing(slug);
      if (!listing) return jsonResult({ error: "not_found" });
      if (!listing.templateRepo) return jsonResult({ error: "no_template" });
      const manifest = {
        name: `${listing.slug}-starter`,
        platform: listing.slug,
        language: "python",
        envVars: [] as string[],
        deploy: {
          railway: "TBD",
          render: "TBD",
        },
      };
      return jsonResult({
        slug: listing.slug,
        templateRepo: listing.templateRepo,
        README: listing.body,
        manifest,
      });
    }
  );
}
