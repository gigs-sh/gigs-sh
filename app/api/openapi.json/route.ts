import { zodToJsonSchema } from "zod-to-json-schema";
import {
  CategoriesResponseSchema,
  CategorySchema,
  GigDetailResponseSchema,
  GigsListQuerySchema,
  GigsListResponseSchema,
  ListingSchema,
  ListingSummarySchema,
  NotFoundResponseSchema,
} from "@/lib/api-schemas";
import { jsonResponse, optionsResponse } from "@/lib/api-http";

// OpenAPI document is fully derived from the static Zod schemas — pre-render it.
export const dynamic = "force-static";

type JSONSchema = Record<string, unknown>;

function toSchema(schema: Parameters<typeof zodToJsonSchema>[0]): JSONSchema {
  // Inline (no $ref / definitions wrapper). Drop the `$schema` key — OpenAPI
  // components shouldn't carry it.
  const raw = zodToJsonSchema(schema, { target: "openApi3" }) as JSONSchema;
  if ("$schema" in raw) delete (raw as { $schema?: unknown }).$schema;
  return raw;
}

function buildOpenApiDoc(): JSONSchema {
  const components = {
    schemas: {
      Listing: toSchema(ListingSchema),
      ListingSummary: toSchema(ListingSummarySchema),
      Category: toSchema(CategorySchema),
      GigsListResponse: toSchema(GigsListResponseSchema),
      CategoriesResponse: toSchema(CategoriesResponseSchema),
      NotFoundResponse: toSchema(NotFoundResponseSchema),
    },
  } as const;

  // Build query parameter list from the Zod query schema. We render each
  // top-level shape entry as an OpenAPI parameter with `in: query`.
  const querySchema = toSchema(GigsListQuerySchema) as {
    properties?: Record<string, JSONSchema>;
    required?: string[];
  };
  const required = new Set(querySchema.required ?? []);
  const gigsListParameters = Object.entries(querySchema.properties ?? {}).map(
    ([name, schema]) => {
      const description =
        typeof schema.description === "string" ? schema.description : undefined;
      // Don't repeat description inside the schema object — OpenAPI puts it on
      // the parameter itself.
      const schemaCopy: JSONSchema = { ...schema };
      if ("description" in schemaCopy) delete schemaCopy.description;
      return {
        name,
        in: "query",
        required: required.has(name),
        ...(description ? { description } : {}),
        schema: schemaCopy,
      };
    },
  );

  return {
    openapi: "3.1.0",
    info: {
      title: "gigs.sh API",
      version: "0.1.0",
      description:
        "Read-only REST API for the gigs.sh directory of agent-earning platforms.",
      license: { name: "MIT", identifier: "MIT" },
    },
    servers: [{ url: "https://gigs.sh" }],
    paths: {
      "/api/v1/gigs": {
        get: {
          summary: "List / search agent-earning platform listings.",
          description:
            "Returns a paginated list of platform listings, optionally filtered by keyword, category, payment rail, friction tier, agent posture, and template availability. The bulky MDX body / rendered HTML / quickstart fields are excluded — fetch them via the detail endpoint.",
          operationId: "listGigs",
          parameters: gigsListParameters,
          responses: {
            "200": {
              description: "Matching listings (paginated).",
              content: {
                "application/json": {
                  schema: {
                    $ref: "#/components/schemas/GigsListResponse",
                  },
                },
              },
            },
            "400": {
              description: "Invalid query parameters.",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { const: "invalid_query" },
                      issues: { type: "array", items: { type: "object" } },
                    },
                    required: ["error", "issues"],
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/gigs/{slug}": {
        get: {
          summary: "Fetch a single listing by slug.",
          description:
            "Returns the full listing including the raw MDX body, rendered editorial HTML, and the official agent quickstart (when present).",
          operationId: "getGig",
          parameters: [
            {
              name: "slug",
              in: "path",
              required: true,
              description: "Listing slug (e.g. 'clustly').",
              schema: { type: "string" },
            },
          ],
          responses: {
            "200": {
              description: "Listing detail.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Listing" },
                },
              },
            },
            "404": {
              description: "No listing with that slug.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/NotFoundResponse" },
                },
              },
            },
          },
        },
      },
      "/api/v1/categories": {
        get: {
          summary: "Enumerate categories with listing counts.",
          description:
            "Returns every category referenced by at least one listing, with the count of listings tagged in that category. Sorted by descending count, then alphabetically.",
          operationId: "listCategories",
          responses: {
            "200": {
              description: "Category counts.",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/CategoriesResponse" },
                },
              },
            },
          },
        },
      },
    },
    components,
  };
}

export function OPTIONS(): Response {
  return optionsResponse();
}

export function GET(): Response {
  return jsonResponse(buildOpenApiDoc());
}
