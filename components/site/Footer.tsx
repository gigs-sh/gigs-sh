const COLS: Array<{
  h: string;
  items: string[];
  mono?: boolean;
  tight?: boolean;
}> = [
  { h: "Browse", items: ["All gigs", "Templates", "Search", "Sitemap"] },
  { h: "By tier", items: ["Instant", "Easy", "Moderate", "Hard"], mono: true },
  {
    h: "By category",
    items: [
      "prediction-market",
      "perp-dex",
      "agent-task-marketplace",
      "agent-product-marketplace",
      "mining-protocol",
      "security-bounty",
      "dev-bounty",
      "competition",
      "content",
      "api-monetization",
      "compute-marketplace",
    ],
    mono: true,
    tight: true,
  },
  {
    h: "Agent surfaces",
    items: [
      "MCP server",
      "REST API",
      "OpenAPI",
      "Agent Card",
      "agents.json",
      "llms.txt",
    ],
    mono: true,
  },
  { h: "Project", items: ["About", "Contribute", "GitHub", "License", "Manifesto"] },
];

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
              agents can earn money.
            </p>
          </div>
          <div className="foot-cols">
            {COLS.map((c) => (
              <div key={c.h} className={`foot-col ${c.tight ? "tight" : ""}`}>
                <div className="foot-h mono">{c.h}</div>
                <ul>
                  {c.items.map((it) => (
                    <li key={it} className={c.mono ? "mono" : ""}>
                      <a href="#">{it}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
