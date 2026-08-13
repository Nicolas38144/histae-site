import { notFound } from "next/navigation";
import { PageShell } from "../../components/page-shell";
import { content, getContent, isLocale, locales } from "../../lib/site-content";
import { createLocaleMetadata } from "../../lib/metadata";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  const copy = getContent(lang);
  return createLocaleMetadata(lang, copy.home.title, copy.home.intro);
}

export default async function LocaleLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <PageShell locale={lang} copy={content[lang]}>{children}</PageShell>;
}
