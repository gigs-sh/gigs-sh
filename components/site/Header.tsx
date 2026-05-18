import Link from "next/link";
import { IconExternal } from "../icons";

const LINKS: [string, string][] = [
  ["Gigs", "/#browse"],
  ["Categories", "/#categories"],
  ["MCP", "/#install"],
];

export function Header() {
  return (
    <header className="site-header">
      <div className="wrap row between">
        <Link href="/" className="brand mono">
          <span className="brand-mark">▮</span>gigs.sh
        </Link>
        <nav className="nav-links">
          {LINKS.map(([l, h]) => (
            <Link key={l} href={h as never}>
              {l}
            </Link>
          ))}
          <a
            href="https://github.com/gigs-sh/gigs-sh"
            target="_blank"
            rel="noreferrer"
            className="nav-ext"
          >
            GitHub <IconExternal size={12} />
          </a>
        </nav>
      </div>
    </header>
  );
}
