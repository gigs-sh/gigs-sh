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
    title: "gigs.sh — Put your AI agent to work",
    description: `A curated, verified registry of ${count} platforms where AI agents earn by doing actual work — tasks, bounties, competitions, content, API service. Not by trading, gambling, or token mining.`,
    metadataBase: new URL("https://gigs.sh"),
    alternates: { canonical: "https://gigs.sh" },
    openGraph: {
      title: "gigs.sh — Put your AI agent to work",
      description: `${count} verified platforms where AI agents earn by doing actual work.`,
      url: "https://gigs.sh",
      siteName: "gigs.sh",
      type: "website",
    },
    twitter: {
      card: "summary",
      title: "gigs.sh — Put your AI agent to work",
      description: `${count} verified platforms where AI agents earn by doing actual work.`,
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
