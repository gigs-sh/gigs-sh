import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AGENT_PERSONAS,
  agentGuidance,
  agentLabel,
  agentTagline,
  getAgentListings,
  isAgentPersona,
} from "@/lib/seo-content";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/listing/ListingCard";

const SITE = "https://gigs.sh";

export function generateStaticParams() {
  return AGENT_PERSONAS.map((agent) => ({ agent }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ agent: string }>;
}): Promise<Metadata> {
  return params.then(({ agent }) => {
    if (!isAgentPersona(agent)) return { title: "Not found — gigs.sh" };
    const label = agentLabel(agent);
    const count = getAgentListings(agent).length;
    const url = `${SITE}/agent/${agent}`;
    return {
      title: `Gigs for ${label} agents (${count}) — gigs.sh`,
      description: `${count} verified platforms where a ${label} agent can earn — explicitly named in the platform's docs or compatible via MCP/REST.`,
      alternates: { canonical: url },
      openGraph: {
        title: `${label} agent earning platforms — gigs.sh`,
        description: `${count} verified gigs for ${label} operators.`,
        url,
        type: "website",
      },
    };
  });
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agent: string }>;
}) {
  const { agent } = await params;
  if (!isAgentPersona(agent)) notFound();

  const label = agentLabel(agent);
  const tagline = agentTagline(agent);
  const guidance = agentGuidance(agent);
  const listings = getAgentListings(agent);

  const url = `${SITE}/agent/${agent}`;

  const otherAgents = AGENT_PERSONAS.filter((a) => a !== agent).map((a) => ({
    slug: a,
    label: agentLabel(a),
    count: getAgentListings(a).length,
  }));

  const pageLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Gigs for ${label} agents`,
    description: `${listings.length} verified platforms where a ${label} agent can earn.`,
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
        name: `${label} agents`,
        item: url,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageLd) }}
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
            <span aria-current="page">{label} agents</span>
          </nav>

          <header className="index-hero">
            <span className="cat-eyebrow mono">#agent / {agent}</span>
            <h1 className="index-h1">Gigs for {label} agents</h1>
            <p className="index-sub">
              {listings.length} verified platform
              {listings.length === 1 ? "" : "s"} where a {label} agent can
              earn.
            </p>
            <p className="index-intro">{tagline}</p>
          </header>

          {guidance && (
            <section className="cat-guidance">
              <h2 className="section-h">
                <span className="mono">How {label} agents earn here</span>
              </h2>
              <p className="cat-guidance-body">{guidance}</p>
            </section>
          )}

          {listings.length > 0 ? (
            <section className="index-grid">
              <h2 className="section-h">
                <span className="mono">
                  Platforms supporting {label} ({listings.length})
                </span>
              </h2>
              <div className="card-grid">
                {listings.map((l) => (
                  <ListingCard key={l.slug} listing={l} />
                ))}
              </div>
            </section>
          ) : (
            <p className="index-empty mono">
              No listings explicitly tagged for {label} yet — but any
              listing with an MCP server or REST API will work via the
              generic integration pattern.
            </p>
          )}

          <section className="index-other">
            <h2 className="section-h">
              <span className="mono">Other agents</span>
            </h2>
            <ul className="other-list mono">
              {otherAgents.map(({ slug, label: oLabel, count }) => (
                <li key={slug}>
                  <Link href={`/agent/${slug}` as never}>
                    {oLabel} ({count})
                  </Link>
                  <span className="other-blurb">
                    {agentTagline(slug).slice(0, 90)}…
                  </span>
                </li>
              ))}
              <li>
                <Link href="/" className="other-all">
                  ← All 23 gigs
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
