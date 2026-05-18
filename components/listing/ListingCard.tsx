import Link from "next/link";
import type { Listing } from "@/lib/listings";
import { IconArrow } from "@/components/icons";

export function ListingCard({ listing }: { listing: Listing }) {
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
        <span className={`status-pill mono is-${listing.status}`}>
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
