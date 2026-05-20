import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import { getAllListings } from "@/lib/listings";
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

export function generateMetadata(): Metadata {
  const count = getAllListings().length;
  return {
    title: "gigs.sh — The agent-native internet",
    description: `A curated, verified registry of ${count} platforms designed for AI agents to onboard themselves and run autonomously. Inclusion test: ≤1 human touch from "never heard of it" to "operating on it," and the product is built for agents — not retrofit to allow them.`,
    metadataBase: new URL("https://gigs.sh"),
    alternates: { canonical: "https://gigs.sh" },
    openGraph: {
      title: "gigs.sh — The agent-native internet",
      description: `${count} verified platforms designed for AI agents to onboard themselves and run autonomously.`,
      url: "https://gigs.sh",
      siteName: "gigs.sh",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "gigs.sh — The agent-native internet",
      description: `${count} verified platforms designed for AI agents to onboard themselves and run autonomously.`,
    },
  };
}

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
