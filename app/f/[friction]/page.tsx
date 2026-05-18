import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllListings,
  tierBlurb,
  tierLabel,
  type Tier,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/listing/ListingCard";

const SITE = "https://gigs.sh";
const TIERS: Tier[] = ["instant", "easy", "moderate", "hard"];

const TIER_INTRO: Record<Tier, string> = {
  instant:
    "Single API call or one-page signup; first earnings in minutes. The lowest friction lane on gigs.sh — best fit for an agent operator with zero patience for KYC or human-in-the-loop review.",
  easy: "Signup plus wallet or account, under 30 minutes to first earnings. Some require a Stripe Connect or wallet setup at the start, but no review, no waiting, no approval gate.",
  moderate:
    "KYC, review, or non-trivial setup required to start earning. The platform may welcome agents, but you can't skip the human-fronted steps — usually identity verification, tax forms, or platform onboarding review.",
  hard: "Application, partnership, or deep technical work needed to begin. Hardware, capital, or domain expertise gates the entry. Highest upside for those who clear the bar.",
};

export function generateStaticParams() {
  return TIERS.map((friction) => ({ friction }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ friction: string }>;
}): Promise<Metadata> {
  return params.then(({ friction }) => {
    if (!TIERS.includes(friction as Tier)) {
      return { title: "Not found — gigs.sh" };
    }
    const tier = friction as Tier;
    const count = getAllListings().filter(
      (l) => l.onboardingFriction === tier,
    ).length;
    const label = tierLabel(tier);
    return {
      title: `${label} onboarding gigs (${count}) — gigs.sh`,
      description: `${count} verified platforms with ${tier} onboarding friction. ${tierBlurb(tier)}. AI-agent earning, organized by setup effort.`,
      alternates: { canonical: `${SITE}/f/${tier}` },
    };
  });
}

export default async function FrictionPage({
  params,
}: {
  params: Promise<{ friction: string }>;
}) {
  const { friction } = await params;
  if (!TIERS.includes(friction as Tier)) notFound();
  const tier = friction as Tier;

  const all = getAllListings();
  const listings = all.filter((l) => l.onboardingFriction === tier);

  const otherTiers = TIERS.filter((t) => t !== tier);
  const url = `${SITE}/f/${tier}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${tierLabel(tier)} onboarding gigs`,
    description: `${listings.length} verified platforms where AI agents earn money — ${tierBlurb(tier)}.`,
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
      {
        "@type": "ListItem",
        position: 2,
        name: `${tierLabel(tier)} onboarding`,
        item: url,
      },
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
            <span aria-current="page">{tierLabel(tier)} onboarding</span>
          </nav>

          <header className="index-hero">
            <span
              className={`tier-badge tier-badge-lg mono tier-${tier}`}
            >
              {tier.toUpperCase()}
            </span>
            <h1 className="index-h1">
              {tierLabel(tier)} onboarding gigs
            </h1>
            <p className="index-sub">
              {listings.length} verified platform
              {listings.length === 1 ? "" : "s"} — {tierBlurb(tier)}.
            </p>
            <p className="index-intro">{TIER_INTRO[tier]}</p>
          </header>

          {listings.length > 0 ? (
            <section className="index-grid">
              <div className="card-grid">
                {listings.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </section>
          ) : (
            <p className="index-empty mono">
              No listings in this tier yet.
            </p>
          )}

          <section className="index-other">
            <h2 className="section-h">
              <span className="mono">Other onboarding tiers</span>
            </h2>
            <ul className="other-list mono">
              {otherTiers.map((t) => {
                const tCount = all.filter(
                  (l) => l.onboardingFriction === t,
                ).length;
                return (
                  <li key={t}>
                    <Link href={`/f/${t}` as never}>
                      <span className={`tier-badge mono tier-${t}`}>
                        {t.toUpperCase()}
                      </span>{" "}
                      {tierLabel(t)} ({tCount})
                    </Link>
                    <span className="other-blurb">{tierBlurb(t)}</span>
                  </li>
                );
              })}
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
