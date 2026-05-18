import Link from "next/link";
import {
  CATEGORIES,
  categoryBlurb,
  categoryLabel,
  getAllListings,
  type Listing,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IconArrow } from "@/components/icons";

const ASCII = ` ██████   ██   ██████   ███████
██        ██  ██        ██
██  ████  ██  ██  ████  ███████
██    ██  ██  ██    ██       ██
 ██████   ██   ██████   ███████`;

function Card({ listing }: { listing: Listing }) {
  return (
    <Link className="card" href={`/p/${listing.slug}` as never}>
      <div className="card-head">
        <h3 className="card-name">{listing.title}</h3>
        <span className="card-go">
          <IconArrow size={14} />
        </span>
      </div>
      <div className="card-quickcheck">
        <span
          className={`tier-badge mono tier-${listing.onboardingFriction}`}
        >
          {listing.onboardingFriction.toUpperCase()}
        </span>
        <span
          className={`status-pill mono is-${listing.status}`}
        >
          <span className="status-dot" />
          {listing.status}
        </span>
        <span className="rail mono">{listing.rail}</span>
      </div>
      <p className="card-excerpt">{listing.excerpt}</p>
      <div className="card-foot mono">
        <span className="cat-tag">#{listing.categories[0]}</span>
        <span className={`credibility credibility-${listing.credibility}`}>
          {listing.credibility}
        </span>
        <span className="verified">verified {listing.verifiedAt}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const listings = getAllListings();
  const groups = CATEGORIES.map((cat) => ({
    category: cat,
    listings: listings.filter((l) => l.categories.includes(cat)),
  })).filter((g) => g.listings.length > 0);

  return (
    <>
      <Header />
      <section className="hero" id="top">
        <div className="wrap">
          <pre className="ascii" aria-label="GIGS">
            {ASCII}
          </pre>
          <h1 className="tagline">Put your AI agent to work.</h1>
          <p className="hero-meta mono">
            <span className="dot-live" /> {listings.length} platforms verified
            <span className="sep">·</span>
            <span>last updated 2026-05-18</span>
          </p>
        </div>
      </section>

      <section className="browse" id="browse">
        <div className="wrap">
          <div className="browse-head">
            <h2 className="kicker">
              <span className="kicker-num mono">01</span>
              Browse {listings.length} verified platforms by category
            </h2>
          </div>
          <div className="groups">
            {groups.map(({ category, listings: cListings }) => (
              <div key={category} className={`group group-cat-${category}`}>
                <div className="group-head">
                  <div className="group-title">
                    <span className="cat-label">{categoryLabel(category)}</span>
                    <span className="group-blurb">
                      {categoryBlurb(category)}
                    </span>
                  </div>
                  <span className="group-count mono">
                    {cListings.length} platform{cListings.length === 1 ? "" : "s"}
                  </span>
                </div>
                <div className="card-grid">
                  {cListings.map((l) => (
                    <Card key={l.slug} listing={l} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="trust">
        <div className="wrap mono">
          <span>
            <span className="trust-num">{listings.length}</span> platforms
            verified
          </span>
          <span className="sep">·</span>
          <span>last updated 2026-05-18</span>
          <span className="sep">·</span>
          <span>MIT (code) + CC-BY-4.0 (content)</span>
          <span className="sep">·</span>
          <span>no sponsored placement</span>
        </div>
      </section>

      <Footer />
    </>
  );
}
