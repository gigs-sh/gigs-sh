import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllListings,
  getListing,
  getRelated,
  tierLabel,
  type Listing,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { CodeBlock } from "@/components/listing/CodeBlock";
import {
  IconAlert,
  IconArrow,
  IconCheck,
  IconCircleDot,
  IconExternal,
  IconGit,
  IconRailway,
  IconTerminal,
  IconZap,
} from "@/components/icons";

export async function generateStaticParams() {
  return getAllListings().map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const l = getListing(slug);
  if (!l) return { title: "Not found — gigs.sh" };
  return {
    title: `${l.title} — AI Agent Earning Guide | gigs.sh`,
    description: l.excerpt,
    alternates: { canonical: `https://gigs.sh/p/${l.slug}` },
  };
}

function WelcomedGlyph({ status }: { status: Listing["status"] }) {
  if (status === "welcomed") {
    return (
      <span className="welcomed-pill is-welcomed mono">
        <IconCheck size={12} stroke={2.2} /> Agents welcomed
      </span>
    );
  }
  if (status === "tolerated") {
    return (
      <span className="welcomed-pill is-tolerated mono">
        <IconAlert size={12} /> Tolerated
      </span>
    );
  }
  return (
    <span className="welcomed-pill is-allowed mono">
      <IconCircleDot size={11} /> Allowed
    </span>
  );
}

function Breadcrumb({ listing }: { listing: Listing }) {
  return (
    <nav className="breadcrumb mono" aria-label="Breadcrumb">
      <Link href="/">gigs.sh</Link>
      <span className="bc-sep">›</span>
      <span>{tierLabel(listing.onboardingFriction)} onboarding</span>
      <span className="bc-sep">›</span>
      <span aria-current="page">{listing.title}</span>
    </nav>
  );
}

function DetailHero({ listing }: { listing: Listing }) {
  return (
    <header className="detail-hero">
      <h1 className="detail-h1">{listing.title}</h1>
      <div className="quick-check mono">
        <span
          className={`tier-badge tier-badge-lg mono tier-${listing.onboardingFriction}`}
        >
          {listing.onboardingFriction.toUpperCase()}
        </span>
        <span className="qc-sep">·</span>
        <WelcomedGlyph status={listing.status} />
        <span className="qc-sep">·</span>
        <span className="qc-rail">{listing.rail}</span>
        <span className="qc-sep">·</span>
        <span className="qc-verified">Verified {listing.verifiedAt}</span>
        {listing.templateRepo && (
          <>
            <span className="qc-sep">·</span>
            <span className="qc-has-starter">
              <IconTerminal size={12} /> Has starter
            </span>
          </>
        )}
      </div>
      <p className="detail-claim">{listing.tagline}</p>
    </header>
  );
}

function KeyFactsTable({ listing }: { listing: Listing }) {
  const facts: { label: string; value: React.ReactNode; mono?: boolean }[] = [
    {
      label: "Onboarding friction",
      value: tierLabel(listing.onboardingFriction).toLowerCase(),
      mono: true,
    },
    {
      label: "Agent welcomed",
      value: listing.agentWelcomed ? "yes" : "no",
      mono: true,
    },
    { label: "Agent allowed", value: listing.agentAllowed, mono: true },
    { label: "Payment rail", value: listing.rail, mono: true },
    { label: "Payout latency", value: listing.payoutLatency, mono: true },
    {
      label: "Minimum payout",
      value: listing.minPayout != null ? `$${listing.minPayout}` : "none",
      mono: true,
    },
    { label: "Verified at", value: listing.verifiedAt, mono: true },
    {
      label: "Category",
      value: listing.categories.join(", "),
      mono: true,
    },
    {
      label: "Official agent docs",
      value: listing.officialAgentDocs ? (
        <a
          href={listing.officialAgentDocs}
          target="_blank"
          rel="noreferrer"
        >
          {listing.officialAgentDocs.replace(/^https?:\/\//, "")}{" "}
          <IconExternal size={11} />
        </a>
      ) : (
        "none"
      ),
      mono: true,
    },
    {
      label: "Realistic earning",
      value: listing.realisticEarning,
    },
    {
      label: "Links",
      value: (
        <>
          <a href={listing.url} target="_blank" rel="noreferrer">
            website <IconExternal size={11} />
          </a>
          {listing.linkedin && (
            <>
              {" · "}
              <a href={listing.linkedin} target="_blank" rel="noreferrer">
                linkedin <IconExternal size={11} />
              </a>
            </>
          )}
          {listing.x && (
            <>
              {" · "}
              <a href={listing.x} target="_blank" rel="noreferrer">
                x <IconExternal size={11} />
              </a>
            </>
          )}
        </>
      ),
      mono: true,
    },
  ];
  return (
    <section className="kft-wrap">
      <h2 className="section-h">
        <span className="mono">Key facts</span>
      </h2>
      <table className="kft">
        <tbody>
          {facts.map((f) => (
            <tr key={f.label}>
              <th scope="row">{f.label}</th>
              <td className={f.mono ? "mono" : ""}>{f.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

function AgentQuickstart({ listing }: { listing: Listing }) {
  const qs = listing.agentQuickstart;
  if (!qs) return null;
  return (
    <section className="quickstart-detail">
      <h2 className="section-h">
        <span className="mono">Agent quickstart (official)</span>
      </h2>
      {qs.source ? (
        <p className="qs-attribution mono">
          From{" "}
          <a href={qs.sourceUrl ?? "#"} target="_blank" rel="noreferrer">
            {qs.source} <IconExternal size={11} />
          </a>
          :
        </p>
      ) : (
        <p className="qs-attribution qs-warn mono">
          <IconAlert size={12} /> No published agent docs. Reconstructed
          quickstart:
        </p>
      )}
      <CodeBlock code={qs.code} language={qs.language} />
      {listing.templateRepo && (
        <div className="qs-or-starter">
          <span className="qs-or mono">— or —</span>
          <a href="#template" className="btn btn-ghost">
            <IconTerminal size={14} /> Use the runnable starter
            <IconArrow size={11} />
          </a>
        </div>
      )}
    </section>
  );
}

function Editorial({ html }: { html: string }) {
  return (
    <section className="editorial">
      <h2 className="section-h">
        <span className="mono">The full read</span>
      </h2>
      <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
    </section>
  );
}

function TemplateSection({ listing }: { listing: Listing }) {
  if (!listing.templateRepo) return null;
  const installCode = `git clone https://github.com/gigs-sh/gigs-sh
cd ${listing.templateRepo}
# follow the README to set env vars
python run.py`;
  return (
    <section className="tpl-section" id="template">
      <div className="tpl-card">
        <div className="tpl-eyebrow mono">
          <IconZap size={12} /> Runnable starter
        </div>
        <h2 className="tpl-title">
          Run an agent on {listing.title} in five minutes.
        </h2>
        <p className="tpl-sub">
          A short Python script with a baseline strategy, MIT-licensed.
          Replace the strategy with your edge; ship it on your own infra.
        </p>
        <div className="tpl-ctas">
          <a href="#" className="btn btn-primary">
            <IconRailway size={15} /> Deploy to Railway
          </a>
          <a
            href={`https://github.com/gigs-sh/gigs-sh/tree/main/${listing.templateRepo}`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-ghost"
          >
            <IconGit size={15} /> View on GitHub <IconExternal size={11} />
          </a>
        </div>
        <CodeBlock code={installCode} language="bash" />
      </div>
    </section>
  );
}

function RelatedSection({ listing }: { listing: Listing }) {
  const { sameTier, sameCategory } = getRelated(listing);
  if (!sameTier.length && !sameCategory.length) return null;
  return (
    <section className="related">
      <h2 className="section-h">
        <span className="mono">Related</span>
      </h2>
      <div className="rel-cols">
        {!!sameTier.length && (
          <div className="rel-col">
            <div className="rel-col-h mono">Same friction tier</div>
            <div className="rel-col-list">
              {sameTier.map((l) => (
                <CompactCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        )}
        {!!sameCategory.length && (
          <div className="rel-col">
            <div className="rel-col-h mono">Same category</div>
            <div className="rel-col-list">
              {sameCategory.map((l) => (
                <CompactCard key={l.slug} listing={l} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CompactCard({ listing }: { listing: Listing }) {
  return (
    <Link className="card-compact" href={`/p/${listing.slug}` as never}>
      <div className="cc-head">
        <span
          className={`tier-dot tier-dot-${listing.onboardingFriction}`}
        />
        <h4>{listing.title}</h4>
        <IconArrow size={12} className="cc-arrow" />
      </div>
      <p>{listing.excerpt}</p>
      <div className="cc-foot mono">
        <span>#{listing.categories[0]}</span>
      </div>
    </Link>
  );
}

export default async function ListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = getListing(slug);
  if (!listing) notFound();

  return (
    <>
      <Header />
      <main className="detail">
        <div className="wrap detail-wrap">
          <Breadcrumb listing={listing} />
          <DetailHero listing={listing} />
          <KeyFactsTable listing={listing} />
          <AgentQuickstart listing={listing} />
          <Editorial html={listing.editorialHtml} />
          <TemplateSection listing={listing} />
          <RelatedSection listing={listing} />
        </div>
      </main>
      <Footer />
    </>
  );
}
