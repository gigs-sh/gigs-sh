// gigs.sh MCP server (Streamable HTTP transport).
//
// Anonymous, read-only. Exposes the 7 directory tools defined in PRD §6 F5
// (see `_tools.ts`). Mounted at `/api/mcp` and served via Vercel's
// `mcp-handler` package, which wraps `@modelcontextprotocol/sdk`.
//
// Long-lived streaming connections need `maxDuration = 60` so Vercel's Fluid
// Compute runtime keeps the function warm long enough.
//
// GET branch: when a browser (or `curl` without flags) hits this URL we serve
// a friendly HTML landing page instead of the generic "Method not allowed"
// JSON-RPC error the MCP handler would otherwise emit. Detection rule: a real
// MCP client establishing a Streamable HTTP session sends
// `Accept: text/event-stream`; anything else is treated as a browser visit.

import { createMcpHandler } from "mcp-handler";

import { registerTools } from "./_tools";

export const maxDuration = 60;

const mcpHandler = createMcpHandler(
  (server) => {
    registerTools(server);
  },
  {
    serverInfo: {
      name: "gigs.sh",
      version: "0.1.0",
    },
  },
  {
    // basePath="/api" + the [transport] segment being "mcp" means the
    // streamable-HTTP endpoint resolves to `/api/mcp`, matching this route.
    basePath: "/api",
    maxDuration: 60,
    // SSE is deprecated per the 2025-03-26 MCP spec and we don't need it.
    disableSse: true,
  }
);

const LANDING_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>MCP endpoint — gigs.sh</title>
<meta name="description" content="JSON-RPC endpoint for AI agents. Not a browser page. Use the curl example or one of the install paths below." />
<meta name="robots" content="noindex" />
<style>
:root { color-scheme: light dark; }
*, *::before, *::after { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: ui-monospace, "SF Mono", Menlo, "JetBrains Mono", "Roboto Mono", monospace;
  background: #fafafa;
  color: #111;
  padding: 48px 24px 96px;
  line-height: 1.55;
  font-size: 14px;
}
main { max-width: 720px; margin: 0 auto; }
.pill {
  display: inline-block; padding: 3px 9px;
  border: 1px solid #ccc; border-radius: 999px;
  font-size: 10.5px; text-transform: uppercase; letter-spacing: 0.07em;
  color: #555; margin-bottom: 18px;
}
h1 { font-size: 19px; font-weight: 600; margin: 0 0 12px; letter-spacing: -0.015em; line-height: 1.35; }
h2 { font-size: 13.5px; font-weight: 600; margin: 32px 0 10px; letter-spacing: -0.005em; text-transform: uppercase; color: #444; letter-spacing: 0.04em; }
p { margin: 10px 0; }
.muted { color: #666; font-size: 12.5px; }
code {
  font-family: inherit; font-size: 12.5px;
  background: #ececec; border: 1px solid #e0e0e0;
  border-radius: 4px; padding: 1px 5px;
}
pre {
  font-family: inherit; font-size: 12px;
  background: #f1f1f1; border: 1px solid #e0e0e0;
  border-radius: 6px; padding: 13px 15px;
  overflow-x: auto; line-height: 1.5;
  white-space: pre; margin: 8px 0;
}
pre code { background: none; border: none; padding: 0; font-size: inherit; }
ul.tools { list-style: none; padding: 0; margin: 4px 0; columns: 2; column-gap: 20px; }
ul.tools li { margin: 4px 0; break-inside: avoid; }
ul.tools li::before { content: "→ "; color: #999; }
a { color: #1a4fa3; text-decoration: none; border-bottom: 1px solid rgba(26, 79, 163, 0.3); }
a:hover { border-bottom-color: currentColor; }
.links { margin-top: 36px; padding-top: 18px; border-top: 1px dashed #ddd; font-size: 12.5px; }
.links a { margin-right: 16px; display: inline-block; margin-bottom: 4px; }
.callout {
  background: #fff8e1; border: 1px solid #f0d877;
  padding: 10px 14px; border-radius: 6px; font-size: 12.5px;
  margin: 12px 0;
}
@media (prefers-color-scheme: dark) {
  body { background: #0d0d0d; color: #e5e5e5; }
  .pill { border-color: #333; color: #aaa; }
  h2 { color: #bbb; }
  code, pre { background: #181818; border-color: #2a2a2a; color: #eaeaea; }
  a { color: #8ab4f8; border-bottom-color: rgba(138, 180, 248, 0.4); }
  .links { border-top-color: #2a2a2a; }
  .callout { background: #2a2410; border-color: #574a16; color: #f5e3a1; }
  .muted { color: #888; }
}
</style>
</head>
<body>
<main>
  <span class="pill">MCP endpoint</span>
  <h1>This URL is a JSON-RPC endpoint for AI agents, not a page.</h1>
  <p>
    You probably reached this URL because you clicked or opened
    <code>https://gigs.sh/api/mcp</code> from a browser. The MCP Streamable
    HTTP transport only responds to POST requests carrying a JSON-RPC body —
    opening the URL directly returns a generic <code>Method not allowed</code>
    error, which is technically correct but unhelpful.
  </p>
  <p>Here's how to actually use it.</p>

  <h2>1. One-click install for Claude Desktop</h2>
  <p>
    <a href="claude://mcp/add?url=https://gigs.sh/api/mcp">Add gigs.sh to Claude Desktop</a>
    — opens Claude Desktop and adds the MCP server to your config.
  </p>

  <h2>2. Install for any MCP client (Claude Code / Cursor / Windsurf)</h2>
  <pre><code>npx agentgigs install</code></pre>
  <p class="muted">Zero deps, Node 18+, idempotent. Restart your client after running.</p>

  <h2>3. Call it directly from a script</h2>
  <pre><code>curl -s -X POST https://gigs.sh/api/mcp \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'</code></pre>

  <h2>Tools exposed</h2>
  <ul class="tools">
    <li><code>search_gigs</code></li>
    <li><code>get_gig</code></li>
    <li><code>list_categories</code></li>
    <li><code>find_by_payment_rail</code></li>
    <li><code>find_by_onboarding_friction</code></li>
    <li><code>find_by_agent_welcomed</code></li>
    <li><code>find_by_agent_allowed</code></li>
  </ul>

  <h2>Prefer plain REST?</h2>
  <p>
    Everything the MCP server exposes is also a plain REST API — no client
    setup required.
  </p>
  <pre><code>curl -s "https://gigs.sh/api/v1/gigs?friction=instant&amp;welcomed=true"</code></pre>
  <p class="muted">
    OpenAPI spec at <a href="/api/openapi.json">/api/openapi.json</a>.
  </p>

  <div class="callout">
    <strong>What is gigs.sh?</strong> A curated directory of 46 platforms where
    AI agents earn money by doing actual work — tasks, bounties, competitions,
    content, API service. Not gambling, not token mining.
  </div>

  <div class="links">
    <a href="/">← gigs.sh</a>
    <a href="/llms.txt">llms.txt</a>
    <a href="/.well-known/agent-card.json">agent-card.json</a>
    <a href="/.well-known/agents.json">agents.json</a>
    <a href="/api/openapi.json">openapi.json</a>
    <a href="https://github.com/gigs-sh/gigs-sh">GitHub</a>
  </div>
</main>
</body>
</html>`;

export async function GET(req: Request) {
  const accept = req.headers.get("accept") ?? "";
  // Real MCP clients establishing a Streamable HTTP session announce
  // `text/event-stream` in Accept. Browsers / curl-without-flags send
  // `text/html` or `*/*`. Only divert the browser case to the landing page;
  // anything that smells like an MCP client falls through to the handler.
  if (accept.includes("text/event-stream")) {
    return mcpHandler(req);
  }
  return new Response(LANDING_HTML, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}

export { mcpHandler as POST, mcpHandler as DELETE };
