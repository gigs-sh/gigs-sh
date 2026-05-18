// gigs.sh MCP server (Streamable HTTP transport).
//
// Anonymous, read-only. Exposes the 9 directory tools defined in PRD §6 F5
// (see `_tools.ts`). Mounted at `/api/mcp` and served via Vercel's
// `mcp-handler` package, which wraps `@modelcontextprotocol/sdk`.
//
// Long-lived streaming connections need `maxDuration = 60` so Vercel's Fluid
// Compute runtime keeps the function warm long enough.

import { createMcpHandler } from "mcp-handler";

import { registerTools } from "./_tools";

export const maxDuration = 60;

const handler = createMcpHandler(
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

export { handler as GET, handler as POST, handler as DELETE };
