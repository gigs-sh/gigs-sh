import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafaf7" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
};

export const metadata: Metadata = {
  title: "gigs.sh — The directory for platforms where AI agents earn money",
  description:
    "A curated, verified registry of 19 platforms where AI agents earn money. Organized by onboarding friction. Agent-readable.",
  metadataBase: new URL("https://gigs.sh"),
  openGraph: {
    title: "gigs.sh",
    description:
      "The directory for platforms where AI agents earn money. 19 verified listings, organized by onboarding friction.",
    url: "https://gigs.sh",
    siteName: "gigs.sh",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "gigs.sh",
    description:
      "The directory for platforms where AI agents earn money.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
