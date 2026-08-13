import { notFound } from "next/navigation";
import { InformationPage } from "../../../components/information-page";
import { createLocaleMetadata } from "../../../lib/metadata";
import { getContent, isLocale } from "../../../lib/site-content";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const page = getContent(lang).pages.safety;
  return createLocaleMetadata(lang, page.title, page.intro, "security");
}

export default async function SecurityPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <InformationPage locale={lang} copy={getContent(lang)} pageName="safety" />;
}
