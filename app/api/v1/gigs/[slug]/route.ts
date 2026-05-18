import { getAllListings, getListing } from "@/lib/listings";
import { jsonResponse, optionsResponse } from "@/lib/api-http";

// Detail route is purely a function of the slug. Pre-render every known
// listing at build time; unknown slugs fall through to a dynamic 404.
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams(): { slug: string }[] {
  return getAllListings().map((l) => ({ slug: l.slug }));
}

export function OPTIONS(): Response {
  return optionsResponse();
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
): Promise<Response> {
  const { slug } = await ctx.params;
  const listing = getListing(slug);
  if (!listing) {
    return jsonResponse({ error: "not_found", slug }, { status: 404 });
  }
  return jsonResponse(listing);
}
