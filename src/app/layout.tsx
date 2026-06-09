import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "AgentOps Brief — Practical AI automation for small business",
  description:
    "A weekly B2B newsletter teaching small businesses practical AI automation workflows. No hype — just playbooks you can run this week.",
  openGraph: {
    title: "AgentOps Brief — Practical AI automation for small business",
    description:
      "Weekly automation playbooks for small businesses. Subscribe for free.",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "AgentOps Brief" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AgentOps Brief",
    description: "Practical AI automation playbooks for small business.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
