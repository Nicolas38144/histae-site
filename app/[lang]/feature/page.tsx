import { notFound } from "next/navigation";
import { InformationPage } from "../../../components/information-page";
import { createLocaleMetadata } from "../../../lib/metadata";
import { getContent, isLocale } from "../../../lib/site-content";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const page = getContent(lang).pages.feature;
  return createLocaleMetadata(lang, page.title, page.intro, "feature");
}

export default async function FeaturePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <InformationPage locale={lang} copy={getContent(lang)} pageName="feature" />;
}
