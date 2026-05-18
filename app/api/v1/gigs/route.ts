import { getAllListings, type Listing } from "@/lib/listings";
import {
  GigsListQuerySchema,
  type ListingSummary,
} from "@/lib/api-schemas";
import { jsonResponse, optionsResponse } from "@/lib/api-http";

// Query parameters vary per request, so we serve this dynamically.
export const dynamic = "force-dynamic";

function toSummary(l: Listing): ListingSummary {
  // Strip body / editorialHtml / agentQuickstart.
  const {
    body: _body,
    editorialHtml: _editorialHtml,
    agentQuickstart: _agentQuickstart,
    ...rest
  } = l;
  return rest;
}

export function OPTIONS(): Response {
  return optionsResponse();
}

export function GET(req: Request): Response {
  const url = new URL(req.url);
  const params = Object.fromEntries(url.searchParams.entries());

  const parsed = GigsListQuerySchema.safeParse(params);
  if (!parsed.success) {
    return jsonResponse(
      {
        error: "invalid_query",
        issues: parsed.error.issues,
      },
      { status: 400 },
    );
  }
  const {
    q,
    category,
    rail,
    friction,
    welcomed,
    allowed,
    has_template,
    limit,
    offset,
  } = parsed.data;

  let listings = getAllListings();

  if (q) {
    const needle = q.toLowerCase();
    listings = listings.filter(
      (l) =>
        l.title.toLowerCase().includes(needle) ||
        l.excerpt.toLowerCase().includes(needle),
    );
  }

  if (category) {
    listings = listings.filter((l) => l.categories.includes(category));
  }

  if (rail) {
    const needle = rail.toLowerCase();
    listings = listings.filter((l) =>
      l.paymentRails.some((r) => r.toLowerCase().includes(needle)),
    );
  }

  if (friction) {
    listings = listings.filter((l) => l.onboardingFriction === friction);
  }

  if (welcomed) {
    const want = welcomed === "true";
    listings = listings.filter((l) => l.agentWelcomed === want);
  }

  if (allowed) {
    listings = listings.filter((l) => l.agentAllowed === allowed);
  }

  if (has_template) {
    const want = has_template === "true";
    listings = listings.filter((l) => Boolean(l.templateRepo) === want);
  }

  const total = listings.length;
  const page = listings.slice(offset, offset + limit).map(toSummary);

  return jsonResponse({
    count: total,
    limit,
    offset,
    results: page,
  });
}
