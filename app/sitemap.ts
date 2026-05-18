import type { MetadataRoute } from "next";
import { CATEGORIES, getAllListings } from "@/lib/listings";
import { getAllArticles } from "@/lib/articles";
import { AGENT_PERSONAS } from "@/lib/seo-content";

const SITE = "https://gigs.sh";
const TIERS = ["instant", "easy", "moderate", "hard"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const listings = getAllListings();
  const articles = getAllArticles();
  const now = new Date();

  const homepage: MetadataRoute.Sitemap[number] = {
    url: SITE,
    lastModified: now,
    changeFrequency: "daily",
    priority: 1,
  };

  const tierPages: MetadataRoute.Sitemap = TIERS.map((t) => ({
    url: `${SITE}/f/${t}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE}/c/${c}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const agentPages: MetadataRoute.Sitemap = AGENT_PERSONAS.map((a) => ({
    url: `${SITE}/agent/${a}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const listingPages: MetadataRoute.Sitemap = listings.map((l) => ({
    url: `${SITE}/p/${l.slug}`,
    lastModified: l.verifiedAt ? new Date(l.verifiedAt) : now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE}/blog/${a.slug}`,
    lastModified: a.publishedAt ? new Date(a.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    homepage,
    ...tierPages,
    ...categoryPages,
    ...agentPages,
    ...listingPages,
    ...articlePages,
  ];
}
