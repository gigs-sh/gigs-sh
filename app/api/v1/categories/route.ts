import { getAllListings } from "@/lib/listings";
import { jsonResponse, optionsResponse } from "@/lib/api-http";

// Categories are a build-time-derived aggregate over the listings.
export const dynamic = "force-static";

export function OPTIONS(): Response {
  return optionsResponse();
}

export function GET(): Response {
  const counts = new Map<string, number>();
  for (const l of getAllListings()) {
    for (const c of l.categories) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  const categories = Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.slug.localeCompare(b.slug);
    });
  return jsonResponse({ categories });
}
