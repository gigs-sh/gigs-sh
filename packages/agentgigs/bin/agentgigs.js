#!/usr/bin/env node
// agentgigs — CLI + MCP installer for gigs.sh
// Zero runtime deps. Node 18+ (fetch / fs / os / path / readline built-ins).
//
// Reference: https://gigs.sh — directory of platforms where AI agents earn.

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";

const API = "https://gigs.sh";
const MCP_URL = `${API}/api/mcp`;
const SERVER_NAME = "gigs-sh";
const VERSION = "0.1.0";

// ──────────────────────────────────────────────────────────────────────
// Terminal colors (no chalk dep)
// ──────────────────────────────────────────────────────────────────────
const isTty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code, s) => (isTty ? `\x1b[${code}m${s}\x1b[0m` : s);
const bold = (s) => c(1, s);
const dim = (s) => c(2, s);
const green = (s) => c(32, s);
const yellow = (s) => c(33, s);
const blue = (s) => c(34, s);
const red = (s) => c(31, s);

// ──────────────────────────────────────────────────────────────────────
// Argv parsing — no commander/yargs dep
// ──────────────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const [, , cmd, ...rest] = argv;
  const positional = [];
  const flags = {};
  for (const arg of rest) {
    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq > -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        flags[arg.slice(2)] = true;
      }
    } else {
      positional.push(arg);
    }
  }
  return { cmd, positional, flags };
}

// ──────────────────────────────────────────────────────────────────────
// HTTP fetch helper
// ──────────────────────────────────────────────────────────────────────
async function api(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "User-Agent": `agentgigs/${VERSION}` },
  });
  if (!res.ok) {
    throw new Error(`gigs.sh API ${path} → HTTP ${res.status}`);
  }
  return res.json();
}

async function apiText(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "User-Agent": `agentgigs/${VERSION}` },
  });
  if (!res.ok) {
    throw new Error(`gigs.sh API ${path} → HTTP ${res.status}`);
  }
  return res.text();
}

// ──────────────────────────────────────────────────────────────────────
// MCP installer
// Detects known client configs and writes the gigs.sh server entry.
// Supports: Claude Desktop, Claude Code (~/.claude.json), Cursor, Windsurf.
// ──────────────────────────────────────────────────────────────────────
function macosClaudeDesktopConfig() {
  return path.join(
    os.homedir(),
    "Library",
    "Application Support",
    "Claude",
    "claude_desktop_config.json",
  );
}

function clientConfigs() {
  const home = os.homedir();
  const platform = os.platform();

  const candidates = [
    {
      name: "Claude Code (CLI)",
      path: path.join(home, ".claude.json"),
      createIfMissing: true,
    },
    {
      name: "Cursor",
      path: path.join(home, ".cursor", "mcp.json"),
      createIfMissing: false,
    },
    {
      name: "Windsurf",
      path: path.join(home, ".codeium", "windsurf", "mcp_config.json"),
      createIfMissing: false,
    },
  ];

  if (platform === "darwin") {
    candidates.push({
      name: "Claude Desktop (macOS)",
      path: macosClaudeDesktopConfig(),
      createIfMissing: false,
    });
  } else if (platform === "win32") {
    candidates.push({
      name: "Claude Desktop (Windows)",
      path: path.join(
        process.env.APPDATA ?? "",
        "Claude",
        "claude_desktop_config.json",
      ),
      createIfMissing: false,
    });
  } else {
    candidates.push({
      name: "Claude Desktop (Linux)",
      path: path.join(home, ".config", "Claude", "claude_desktop_config.json"),
      createIfMissing: false,
    });
  }

  return candidates;
}

function readJsonOr(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch (err) {
    throw new Error(`Could not parse ${filePath}: ${err.message}`);
  }
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function ensureMcpEntry(config) {
  if (!config.mcpServers || typeof config.mcpServers !== "object") {
    config.mcpServers = {};
  }
  const existing = config.mcpServers[SERVER_NAME];
  const isCurrent =
    existing && (existing.url === MCP_URL || existing.serverUrl === MCP_URL);
  if (isCurrent) return { changed: false };

  config.mcpServers[SERVER_NAME] = {
    type: "http",
    url: MCP_URL,
  };
  return { changed: true, replaced: !!existing };
}

async function cmdInstall() {
  const configs = clientConfigs();
  const dry = false;

  console.log(bold("agentgigs install") + "  " + dim(`→ ${MCP_URL}`));
  console.log();

  let added = 0;
  let alreadyOk = 0;
  let detected = 0;

  for (const candidate of configs) {
    const exists = fs.existsSync(candidate.path);
    if (!exists && !candidate.createIfMissing) {
      console.log(`  ${dim("skip")}     ${candidate.name}  ${dim(candidate.path)}  ${dim("(not installed)")}`);
      continue;
    }
    detected++;
    const config = readJsonOr(candidate.path, {});
    const { changed, replaced } = ensureMcpEntry(config);
    if (!changed) {
      console.log(`  ${green("ok")}       ${candidate.name}  ${dim("(already configured)")}`);
      alreadyOk++;
      continue;
    }
    if (!dry) writeJson(candidate.path, config);
    const label = replaced ? "updated" : "added";
    console.log(
      `  ${green(label)}${" ".repeat(9 - label.length)}${candidate.name}  ${dim(candidate.path)}`,
    );
    added++;
  }

  console.log();
  if (detected === 0) {
    console.log(
      yellow("No MCP-capable client config found.") +
        "\nTo add manually, paste this into your client's MCP config:\n",
    );
    console.log(
      "  " +
        JSON.stringify(
          {
            mcpServers: {
              [SERVER_NAME]: { type: "http", url: MCP_URL },
            },
          },
          null,
          2,
        ).replace(/\n/g, "\n  "),
    );
  } else if (added > 0) {
    console.log(
      green("Done.") +
        ` Restart your client to load the gigs.sh MCP server (${added} config${added === 1 ? "" : "s"} updated).`,
    );
    console.log(
      dim(
        "Try: ask your agent 'find me an agent-task-marketplace that pays USDC on Base.'",
      ),
    );
  } else {
    console.log(
      green("Already installed.") +
        ` ${alreadyOk} client${alreadyOk === 1 ? "" : "s"} already configured. Nothing to do.`,
    );
  }
}

async function cmdUninstall() {
  console.log(bold("agentgigs uninstall"));
  console.log();
  const configs = clientConfigs();
  let touched = 0;
  for (const candidate of configs) {
    if (!fs.existsSync(candidate.path)) {
      console.log(`  ${dim("skip")}  ${candidate.name}  ${dim("(not installed)")}`);
      continue;
    }
    const config = readJsonOr(candidate.path, {});
    if (!config.mcpServers || !config.mcpServers[SERVER_NAME]) {
      console.log(`  ${dim("skip")}  ${candidate.name}  ${dim("(no gigs-sh entry)")}`);
      continue;
    }
    delete config.mcpServers[SERVER_NAME];
    writeJson(candidate.path, config);
    console.log(`  ${green("removed")}  ${candidate.name}`);
    touched++;
  }
  console.log();
  console.log(touched === 0 ? "Nothing to remove." : green(`Removed from ${touched} client(s).`));
}

// ──────────────────────────────────────────────────────────────────────
// Browse commands (REST API wrappers)
// ──────────────────────────────────────────────────────────────────────
function pad(s, w) {
  s = String(s);
  return s.length >= w ? s : s + " ".repeat(w - s.length);
}

function renderListing(l, opts = {}) {
  const cat = l.categories?.[0] ?? "?";
  const rail = l.paymentRails?.[0] ?? "?";
  const friction = l.onboardingFriction ?? "?";
  const cred = l.credibility ?? "?";
  const welcomed = l.agentWelcomed ? green("welcomed") : dim("tolerated");
  return [
    bold(pad(l.title, 28)),
    dim(pad(l.slug, 26)),
    pad(cat, 24),
    pad(rail, 16),
    pad(friction, 10),
    welcomed,
    dim(cred),
  ].join("  ");
}

async function cmdList(flags) {
  const params = new URLSearchParams();
  if (flags.category) params.set("category", flags.category);
  if (flags.friction) params.set("friction", flags.friction);
  if (flags.rail) params.set("rail", flags.rail);
  if (flags.welcomed) params.set("welcomed", "true");
  params.set("limit", "100");

  const q = params.toString();
  const data = await api(`/api/v1/gigs?${q}`);
  const results = data.results ?? [];
  const filtered = flags.credibility
    ? results.filter((l) => l.credibility === flags.credibility)
    : results;

  if (filtered.length === 0) {
    console.log(yellow("No listings matched."));
    return;
  }

  console.log(
    dim(pad("title", 28) + "  " + pad("slug", 26) + "  " + pad("category", 24) + "  " + pad("rail", 16) + "  " + pad("friction", 10) + "  posture    credibility"),
  );
  for (const l of filtered) {
    console.log(renderListing(l));
  }
  console.log();
  console.log(dim(`${filtered.length} of ${data.total ?? results.length} total. ` + (q ? `Filters: ?${q}` : "")));
}

async function cmdView(positional) {
  const slug = positional[0];
  if (!slug) {
    console.log(red("usage: agentgigs view <slug>"));
    process.exit(1);
  }
  const l = await api(`/api/v1/gigs/${slug}`);
  console.log();
  console.log(bold(l.title) + "  " + dim(`(${l.slug})`));
  console.log(dim(`https://gigs.sh/p/${l.slug}`));
  console.log();
  console.log(l.excerpt);
  console.log();
  const facts = [
    ["url", l.url],
    ["categories", (l.categories ?? []).join(", ")],
    ["paymentRails", (l.paymentRails ?? []).join(", ")],
    ["onboardingFriction", l.onboardingFriction],
    ["agentAllowed", l.agentAllowed],
    ["agentWelcomed", String(l.agentWelcomed)],
    ["credibility", l.credibility],
    ["realisticEarning", l.realisticEarning],
    ["verifiedAt", l.verifiedAt],
    ["officialAgentDocs", l.officialAgentDocs ?? "—"],
    ["linkedin", l.linkedin ?? "—"],
    ["x", l.x ?? "—"],
  ];
  for (const [k, v] of facts) {
    console.log(`  ${dim(pad(k, 20))}  ${v}`);
  }
  console.log();
  console.log(
    dim(
      `agentgigs fetch ${l.slug}     # raw markdown\nagentgigs view ${l.slug} | claude   # pipe to your agent`,
    ),
  );
}

async function cmdFetch(positional) {
  const slug = positional[0];
  if (!slug) {
    console.log(red("usage: agentgigs fetch <slug>"));
    process.exit(1);
  }
  const url = `https://raw.githubusercontent.com/gigs-sh/gigs-sh/main/content/listings/${slug}.mdx`;
  const text = await apiText(`/api/v1/gigs/${slug}`);
  // Prefer raw MDX from GitHub for pipe-friendliness
  try {
    const res = await fetch(url);
    if (res.ok) {
      process.stdout.write(await res.text());
      return;
    }
  } catch {
    // fall through
  }
  // Fallback to JSON body
  process.stdout.write(text);
}

async function cmdSearch(positional) {
  const q = positional.join(" ").trim();
  if (!q) {
    console.log(red("usage: agentgigs search <query>"));
    process.exit(1);
  }
  const data = await api(`/api/v1/gigs?q=${encodeURIComponent(q)}&limit=20`);
  const results = data.results ?? [];
  if (results.length === 0) {
    console.log(yellow(`No matches for: ${q}`));
    return;
  }
  console.log(bold(`${results.length} match${results.length === 1 ? "" : "es"} for: ${q}`));
  console.log();
  for (const l of results) console.log(renderListing(l));
}

async function cmdCategories() {
  const data = await api("/api/v1/categories");
  const cats = data.categories ?? [];
  console.log(bold("Categories"));
  console.log();
  for (const c of cats) {
    console.log(`  ${bold(pad(c.slug, 28))}  ${dim(`(${c.count})`)}`);
  }
  console.log();
  console.log(dim("agentgigs list --category=<slug>"));
}

async function cmdAgents() {
  console.log(bold("Agent personas"));
  console.log();
  const personas = ["claude-code", "cursor", "devin", "langchain", "crewai"];
  for (const p of personas) {
    console.log(`  ${bold(pad(p, 18))}  ${dim(`https://gigs.sh/agent/${p}`)}`);
  }
  console.log();
  console.log(dim("Each page lists which platforms support that agent."));
}

// ──────────────────────────────────────────────────────────────────────
// Help / version
// ──────────────────────────────────────────────────────────────────────
function cmdHelp() {
  console.log(
    `${bold("agentgigs")} ${dim(`v${VERSION}`)} — CLI for ${blue("https://gigs.sh")}

  ${bold("Install gigs.sh as an MCP server in your agent:")}
    agentgigs install                 add the MCP server to Claude Code / Desktop / Cursor / Windsurf
    agentgigs uninstall               remove it

  ${bold("Browse the directory:")}
    agentgigs list [filters]          list platforms
    agentgigs view <slug>             show full detail for one platform
    agentgigs fetch <slug>            print raw MDX (pipe to your agent)
    agentgigs search <query>          free-text search
    agentgigs categories              list the 7 categories
    agentgigs agents                  list the 5 agent personas

  ${bold("List filters:")}
    --category=<slug>                 agent-task-marketplace | api-monetization | hackathon | ...
    --friction=<tier>                 instant | easy | moderate | hard
    --rail=<slug>                     usdc-base | usdc-solana | stripe-usd | ...
    --welcomed                        only platforms that publicly invite AI agents
    --credibility=<tier>              established | growing | early | self-reported

  ${bold("Examples:")}
    npx agentgigs install
    npx agentgigs list --category=agent-task-marketplace --welcomed
    npx agentgigs view agent-hansa
    npx agentgigs fetch clustly | claude
`,
  );
}

// ──────────────────────────────────────────────────────────────────────
// Dispatch
// ──────────────────────────────────────────────────────────────────────
async function main() {
  const { cmd, positional, flags } = parseArgs(process.argv);
  try {
    switch (cmd) {
      case "install":
        await cmdInstall();
        break;
      case "uninstall":
        await cmdUninstall();
        break;
      case "list":
        await cmdList(flags);
        break;
      case "view":
        await cmdView(positional);
        break;
      case "fetch":
        await cmdFetch(positional);
        break;
      case "search":
        await cmdSearch(positional);
        break;
      case "categories":
      case "cats":
        await cmdCategories();
        break;
      case "agents":
        await cmdAgents();
        break;
      case "version":
      case "-v":
      case "--version":
        console.log(VERSION);
        break;
      case "help":
      case "-h":
      case "--help":
      case undefined:
        cmdHelp();
        break;
      default:
        console.log(red(`unknown command: ${cmd}`));
        cmdHelp();
        process.exit(1);
    }
  } catch (err) {
    console.error(red(err.message ?? String(err)));
    process.exit(1);
  }
}

main();
