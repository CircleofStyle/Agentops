import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { isLocale, localeHtmlLang, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { getSiteUrl } from "@/lib/resend";

import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

type LayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
  const { locale: raw } = await params;
  if (!isLocale(raw)) return {};
  const dict = await getDictionary(raw);

  return {
    metadataBase: new URL(getSiteUrl()),
    title: dict.meta.siteTitle,
    description: dict.meta.siteDescription,
    openGraph: {
      title: dict.meta.siteTitle,
      description: dict.meta.ogDescription,
      type: "website",
      images: [{ url: "/og.svg", width: 1200, height: 630, alt: dict.common.brandName }],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.common.brandName,
      description: dict.meta.twitterDescription,
      images: ["/og.svg"],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "de" }];
}

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = await getDictionary(locale);

  return (
    <html lang={localeHtmlLang[locale]} className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <I18nProvider locale={locale} dict={dict}>
          <LocaleSwitcher />
          <div className="flex-1">{children}</div>
          <SiteFooter />
          <CookieConsentBanner />
          <GoogleAnalytics />
        </I18nProvider>
      </body>
    </html>
  );
}
