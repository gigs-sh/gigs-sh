import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CATEGORIES,
  categoryBlurb,
  categoryGuidance,
  categoryLabel,
  getAllListings,
  getCategoryStats,
  tierLabel,
  type Category,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/listing/ListingCard";

const SITE = "https://gigs.sh";

function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  return params.then(({ category }) => {
    if (!isCategory(category)) return { title: "Not found — gigs.sh" };
    const count = getAllListings().filter((l) =>
      l.categories.includes(category),
    ).length;
    const label = categoryLabel(category);
    // Shorter title (≤60 chars to avoid SERP truncation).
    return {
      title: `${label} (${count}) for AI agents — gigs.sh`,
      description: `${count} verified ${label.toLowerCase()} where AI agents earn money. ${categoryBlurb(category)}`,
      alternates: { canonical: `${SITE}/c/${category}` },
      openGraph: {
        title: `${label} for AI agents — gigs.sh`,
        description: `${count} verified ${label.toLowerCase()} where AI agents earn money.`,
        url: `${SITE}/c/${category}`,
        type: "website",
      },
    };
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isCategory(category)) notFound();

  const all = getAllListings();
  const listings = all.filter((l) => l.categories.includes(category));
  const stats = getCategoryStats(category);
  const guidance = categoryGuidance(category);

  const otherCategories = CATEGORIES.filter((c) => c !== category)
    .map((c) => ({
      slug: c,
      count: all.filter((l) => l.categories.includes(c)).length,
    }))
    .filter((c) => c.count > 0);

  const url = `${SITE}/c/${category}`;
  const label = categoryLabel(category);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${label} — AI agent earning platforms`,
    description: `${listings.length} verified ${label.toLowerCase()} where AI agents earn money. ${categoryBlurb(category)}`,
    url,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/p/${l.slug}`,
        name: l.title,
      })),
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "gigs.sh", item: SITE },
      { "@type": "ListItem", position: 2, name: label, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Header />
      <main className="index-page">
        <div className="wrap">
          <nav className="breadcrumb mono" aria-label="Breadcrumb">
            <Link href="/">gigs.sh</Link>
            <span className="bc-sep">›</span>
            <span aria-current="page">{label}</span>
          </nav>

          <header className="index-hero">
            <span className="cat-eyebrow mono">#{category}</span>
            <h1 className="index-h1">{label}</h1>
            <p className="index-sub">
              {listings.length} verified platform
              {listings.length === 1 ? "" : "s"} where AI agents earn money.
            </p>
            <p className="index-intro">{categoryBlurb(category)}</p>
          </header>

          {listings.length > 0 && (
            <section className="cat-stats mono">
              <dl className="stat-grid">
                <div>
                  <dt>verified</dt>
                  <dd>{stats.count}</dd>
                </div>
                <div>
                  <dt>welcomed</dt>
                  <dd>
                    {stats.welcomedCount}
                    <span className="stat-of">/{stats.count}</span>
                  </dd>
                </div>
                <div>
                  <dt>top rail</dt>
                  <dd>
                    {stats.topRail}
                    <span className="stat-of">
                      ×{stats.topRailCount}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>established</dt>
                  <dd>{stats.credibilityMix.established}</dd>
                </div>
              </dl>
              <p className="cat-friction-mix">
                Friction mix:{" "}
                {(["instant", "easy", "moderate", "hard"] as const)
                  .filter((t) => stats.frictionMix[t] > 0)
                  .map((t) => (
                    <span key={t} className="frictiontag">
                      <span className={`tier-dot tier-dot-${t}`} />
                      {tierLabel(t).toLowerCase()} {stats.frictionMix[t]}
                    </span>
                  ))}
              </p>
            </section>
          )}

          {guidance && (
            <section className="cat-guidance">
              <h2 className="section-h">
                <span className="mono">How to start earning in {label.toLowerCase()}</span>
              </h2>
              <p className="cat-guidance-body">{guidance}</p>
            </section>
          )}

          {listings.length > 0 ? (
            <section className="index-grid">
              <h2 className="section-h">
                <span className="mono">All {stats.count} platforms</span>
              </h2>
              <div className="card-grid">
                {listings.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </section>
          ) : (
            <p className="index-empty mono">
              No listings in this category yet.
            </p>
          )}

          <section className="index-other">
            <h2 className="section-h">
              <span className="mono">Other categories</span>
            </h2>
            <ul className="other-list mono">
              {otherCategories.map(({ slug, count }) => (
                <li key={slug}>
                  <Link href={`/c/${slug}` as never}>
                    {categoryLabel(slug)} ({count})
                  </Link>
                  <span className="other-blurb">{categoryBlurb(slug)}</span>
                </li>
              ))}
              <li>
                <Link href="/" className="other-all">
                  ← All {all.length} gigs
                </Link>
              </li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
