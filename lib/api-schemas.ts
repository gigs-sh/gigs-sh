// Shared Zod schemas for the public REST API + OpenAPI generation.
//
// We import from "zod/v3" because `zod-to-json-schema` (v3.x) targets the
// zod v3 type surface. Zod v4 ships a v3-compatible subpath, so this keeps
// runtime/types aligned with the converter. If `zod-to-json-schema` ever
// updates to consume the native zod v4 surface, we can switch to `"zod"`.

import { z } from "zod/v3";

// -----------------------------
// Enums
// -----------------------------

export const TierSchema = z
  .enum(["instant", "easy", "moderate", "hard"])
  .describe("Onboarding friction tier.");

export const AgentAllowedSchema = z
  .enum(["yes", "unclear", "required"])
  .describe("Whether agents are explicitly allowed on the platform.");

export const StatusSchema = z
  .enum(["welcomed", "tolerated", "allowed"])
  .describe("Derived posture toward agent users.");

export const PayoutLatencySchema = z
  .enum(["instant", "hours", "days"])
  .describe("Typical payout latency after earnings are generated.");

// -----------------------------
// Agent quickstart (nested)
// -----------------------------

export const AgentQuickstartSchema = z
  .object({
    source: z.string().nullable(),
    sourceUrl: z.string().nullable(),
    code: z.string(),
    language: z.string(),
    caveat: z.string().optional(),
    note: z.string().optional(),
  })
  .describe(
    "Official agent quickstart pulled from the platform's own LLM-facing docs.",
  );

// -----------------------------
// Listing (full) and ListingSummary (list view)
// -----------------------------

// Fields shared by both summary and full views.
const baseListingShape = {
  title: z.string(),
  slug: z.string(),
  url: z.string().url(),
  categories: z.array(z.string()),
  paymentRails: z.array(z.string()),
  agentAllowed: AgentAllowedSchema,
  agentWelcomed: z.boolean(),
  onboardingFriction: TierSchema,
  a2aProtocol: z.array(z.string()).optional(),
  payoutLatency: PayoutLatencySchema,
  minPayout: z.number().nullable(),
  realisticEarning: z.string(),
  agentAllowedNotes: z.string(),
  launchCohort: z.boolean(),
  verifiedAt: z.string().describe("ISO date (YYYY-MM-DD)"),
  logo: z.string().optional(),
  excerpt: z.string(),
  officialAgentDocs: z.string().nullable(),
  // Derived/computed fields:
  status: StatusSchema,
  rail: z.string().describe('Pretty payment rail string, e.g. "USDC / Solana".'),
  tagline: z
    .string()
    .describe('First paragraph after the "What is it" heading.'),
};

export const ListingSummarySchema = z
  .object(baseListingShape)
  .describe(
    "Compact listing view used by /api/v1/gigs. Excludes the full MDX body and rendered HTML.",
  );

export const ListingSchema = z
  .object({
    ...baseListingShape,
    body: z.string().describe("Raw MDX body (frontmatter stripped)."),
    editorialHtml: z
      .string()
      .describe(
        'Rendered HTML of the listing body with the "What is it" and "Agent quickstart" sections removed.',
      ),
    agentQuickstart: AgentQuickstartSchema.nullable(),
  })
  .describe("Full listing including MDX body, rendered HTML, and quickstart.");

// -----------------------------
// Query / response schemas
// -----------------------------

export const GigsListQuerySchema = z
  .object({
    q: z.string().optional().describe("Keyword search (title + excerpt)."),
    category: z.string().optional().describe("Filter by category slug."),
    rail: z
      .string()
      .optional()
      .describe(
        "Case-insensitive substring match against paymentRails (e.g. 'usdc', 'solana').",
      ),
    friction: TierSchema.optional(),
    welcomed: z
      .enum(["true", "false"])
      .optional()
      .describe("Filter by agentWelcomed."),
    allowed: AgentAllowedSchema.optional().describe("Filter by agentAllowed."),
    limit: z.coerce
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Max results (1-100)."),
    offset: z.coerce
      .number()
      .int()
      .min(0)
      .default(0)
      .describe("Offset for pagination."),
  })
  .describe("Query parameters for GET /api/v1/gigs.");

export const GigsListResponseSchema = z.object({
  count: z.number().int().describe("Total matching listings (pre-pagination)."),
  limit: z.number().int(),
  offset: z.number().int(),
  results: z.array(ListingSummarySchema),
});

export const GigDetailResponseSchema = ListingSchema;

export const NotFoundResponseSchema = z.object({
  error: z.literal("not_found"),
  slug: z.string(),
});

export const CategorySchema = z.object({
  slug: z.string(),
  count: z.number().int().min(0),
});

export const CategoriesResponseSchema = z.object({
  categories: z.array(CategorySchema),
});

// -----------------------------
// TypeScript inference helpers
// -----------------------------

export type Tier = z.infer<typeof TierSchema>;
export type AgentAllowedT = z.infer<typeof AgentAllowedSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type ListingSummary = z.infer<typeof ListingSummarySchema>;
export type ListingFull = z.infer<typeof ListingSchema>;
export type GigsListQuery = z.infer<typeof GigsListQuerySchema>;
export type GigsListResponse = z.infer<typeof GigsListResponseSchema>;
export type CategoriesResponse = z.infer<typeof CategoriesResponseSchema>;
