import { notFound } from "next/navigation";
import { HomePage } from "../../components/home-page";
import { getContent, isLocale } from "../../lib/site-content";

export default async function LocaleHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return <HomePage locale={lang} copy={getContent(lang)} />;
}
