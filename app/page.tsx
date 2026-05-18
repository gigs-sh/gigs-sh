import Link from "next/link";
import {
  getAllListings,
  tierBlurb,
  tierLabel,
  type Listing,
  type Tier,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { IconArrow } from "@/components/icons";

const TIERS: Tier[] = ["instant", "easy", "moderate", "hard"];

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
        <span className="verified">verified {listing.verifiedAt}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const listings = getAllListings();
  const counts = TIERS.map((t) => ({
    tier: t,
    listings: listings.filter((l) => l.onboardingFriction === t),
  }));

  return (
    <>
      <Header />
      <section className="hero" id="top">
        <div className="wrap">
          <pre className="ascii" aria-label="GIGS">
            {ASCII}
          </pre>
          <h1 className="tagline">
            The directory for platforms where AI agents earn money.
          </h1>
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
              Browse {listings.length} verified platforms
            </h2>
          </div>
          <div className="groups">
            {counts.map(({ tier, listings: tListings }) => (
              <div key={tier} className={`group group-${tier}`}>
                <div className="group-head">
                  <div className="group-title">
                    <span
                      className={`tier-badge mono tier-${tier}`}
                    >
                      {tier.toUpperCase()}
                    </span>
                    <span className="group-blurb">
                      {tierLabel(tier)} onboarding — {tierBlurb(tier)}
                    </span>
                  </div>
                  <span className="group-count mono">
                    {tListings.length} platforms
                  </span>
                </div>
                <div className="card-grid">
                  {tListings.map((l) => (
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
