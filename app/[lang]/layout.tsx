import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { PageShell } from "../../components/page-shell";
import { createLocaleMetadata, publicUrl } from "../../lib/metadata";
import { getRouteMetadataCopy } from "../../lib/localized-page";
import { isLocale, locales } from "../../lib/site-config";
import { getMessagesForLocale } from "../../messages";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = getRouteMetadataCopy(getMessagesForLocale(lang), "home");
  return {
    ...createLocaleMetadata(lang, "home", copy.title, copy.description),
    metadataBase: new URL(publicUrl),
    title: { default: `${copy.title} · Histae`, template: "%s · Histae" },
    icons: { icon: "/logo.png" },
  };
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  return (
    <html lang={lang}>
      <body>
        <PageShell locale={lang}>{children}</PageShell>
      </body>
    </html>
  );
}
