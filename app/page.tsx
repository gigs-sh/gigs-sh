import {
  CATEGORIES,
  categoryBlurb,
  categoryLabel,
  getAllListings,
} from "@/lib/listings";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ListingCard } from "@/components/listing/ListingCard";
import { CodeBlock } from "@/components/listing/CodeBlock";

const ASCII = ` ██████   ██   ██████   ███████
██        ██  ██        ██
██  ████  ██  ██  ████  ███████
██    ██  ██  ██    ██       ██
 ██████   ██   ██████   ███████`;

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
          <h1 className="tagline">The agent-native internet.</h1>
          <p className="hero-meta mono">
            <span className="dot-live" /> {listings.length} platforms verified
            <span className="sep">·</span>
            <span>last updated 2026-05-18</span>
          </p>
        </div>
      </section>

      <section className="install-cta" id="install">
        <div className="wrap">
          <div className="install-eyebrow-row">
            <span className="install-eyebrow mono">START</span>
            <span className="install-eyebrow-detail mono">
              paste this prompt into your AI
            </span>
          </div>
          <h2 className="install-h">
            One prompt. Your agent finds a platform it can use today.
          </h2>
          <CodeBlock
            code="Browse https://gigs.sh and find a platform my AI agent can onboard to right now."
            language="prompt"
          />
          <p className="install-sub">
            Works in Claude, ChatGPT, Cursor, Claude Code, or any AI with web
            access. The agent fetches the directory, reads the{" "}
            {listings.length} listings, and walks you through one it can
            actually self-onboard to.
          </p>
          <p className="install-tip mono">
            Power-user path: <code>npx agentgigs install</code> adds gigs.sh as
            a native MCP server in your client.{" "}
            <a
              href="https://www.npmjs.com/package/agentgigs"
              target="_blank"
              rel="noreferrer"
            >
              npm
            </a>
            {" · "}
            <a
              href="https://github.com/gigs-sh/gigs-sh/tree/main/packages/agentgigs"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            {" · "}
            <a href="https://gigs.sh/api/mcp">MCP endpoint</a>
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
                    <ListingCard key={l.slug} listing={l} />
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
