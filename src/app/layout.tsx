import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { SiteFooter } from "@/components/SiteFooter";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Automate This Week — One practical workflow per week for small service businesses",
  description:
    "Practical automation playbooks for service businesses — save 2–5 hours per week with step-by-step Gmail, Sheets, and Zapier workflows. One playbook every 7 days after you confirm.",
  openGraph: {
    title: "Automate This Week — One practical workflow per week for small service businesses",
    description:
      "Free sample on the web. Full playbook sequence by email for small service businesses.",
    type: "website",
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: "Automate This Week" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Automate This Week",
    description: "Free sample on the web. Full playbook sequence by email.",
    images: ["/og.svg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
