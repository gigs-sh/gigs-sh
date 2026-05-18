import Link from "next/link";
import { CATEGORIES, categoryLabel } from "@/lib/listings";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

const TIERS = [
  { label: "Instant", href: "/f/instant" },
  { label: "Easy", href: "/f/easy" },
  { label: "Moderate", href: "/f/moderate" },
  { label: "Hard", href: "/f/hard" },
] as const;

const BROWSE_LINKS: FooterLink[] = [
  { label: "All gigs", href: "/" },
  { label: "Sitemap", href: "/sitemap.xml" },
];

const AGENT_LINKS: FooterLink[] = [
  { label: "MCP server", href: "/api/mcp" },
  { label: "REST API", href: "/api/v1/gigs" },
  { label: "OpenAPI", href: "/api/openapi.json" },
  { label: "Agent Card", href: "/.well-known/agent-card.json" },
  { label: "agents.json", href: "/.well-known/agents.json" },
  { label: "llms.txt", href: "/llms.txt" },
];

const PROJECT_LINKS: FooterLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/gigs-sh/gigs-sh",
    external: true,
  },
  {
    label: "Contribute",
    href: "https://github.com/gigs-sh/gigs-sh/blob/main/CONTRIBUTING.md",
    external: true,
  },
  {
    label: "Evaluation",
    href: "https://github.com/gigs-sh/gigs-sh/blob/main/EVALUATION.md",
    external: true,
  },
  {
    label: "License",
    href: "https://github.com/gigs-sh/gigs-sh/blob/main/LICENSE",
    external: true,
  },
];

function FooterItem({ link, mono }: { link: FooterLink; mono?: boolean }) {
  const className = mono ? "mono" : "";
  if (link.external) {
    return (
      <li className={className}>
        <a href={link.href} target="_blank" rel="noreferrer">
          {link.label}
        </a>
      </li>
    );
  }
  return (
    <li className={className}>
      <Link href={link.href as never}>{link.label}</Link>
    </li>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-top">
          <div className="foot-brand">
            <div className="brand mono lg">
              <span className="brand-mark">▮</span>gigs.sh
            </div>
            <p className="foot-mission">
              A curated, dated, agent-readable registry of platforms where AI
              agents earn money.
            </p>
          </div>
          <div className="foot-cols">
            <div className="foot-col">
              <div className="foot-h mono">Browse</div>
              <ul>
                {BROWSE_LINKS.map((l) => (
                  <FooterItem key={l.label} link={l} />
                ))}
              </ul>
            </div>

            <div className="foot-col">
              <div className="foot-h mono">By tier</div>
              <ul>
                {TIERS.map((t) => (
                  <FooterItem key={t.label} link={t} mono />
                ))}
              </ul>
            </div>

            <div className="foot-col tight">
              <div className="foot-h mono">By category</div>
              <ul>
                {CATEGORIES.map((c) => (
                  <FooterItem
                    key={c}
                    link={{ label: categoryLabel(c), href: `/c/${c}` }}
                    mono
                  />
                ))}
              </ul>
            </div>

            <div className="foot-col">
              <div className="foot-h mono">Agent surfaces</div>
              <ul>
                {AGENT_LINKS.map((l) => (
                  <FooterItem key={l.label} link={l} mono />
                ))}
              </ul>
            </div>

            <div className="foot-col">
              <div className="foot-h mono">Project</div>
              <ul>
                {PROJECT_LINKS.map((l) => (
                  <FooterItem key={l.label} link={l} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="foot-bottom mono">
          <span>gigs.sh</span>
          <span className="sep">·</span>
          <span>2026</span>
          <span className="sep">·</span>
          <span>MIT / CC-BY-4.0</span>
          <span className="sep">·</span>
          <span>no sponsored placement</span>
          <span className="sep">·</span>
          <span>open-source</span>
        </div>
      </div>
    </footer>
  );
}
