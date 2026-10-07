import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  isLegalDocumentId,
  legalDocumentHref,
  legalDocumentIds,
  legalDocuments,
  readLegalDocument,
} from "../../../../lib/legal-documents";
import { defaultLocale, isLocale, localeConfig, locales, localizedHref, publicUrl } from "../../../../lib/site-config";

type LegalPageProps = { params: Promise<{ lang: string; document: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return legalDocumentIds.map((document) => ({ document }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { lang, document } = await params;
  if (!isLocale(lang) || !isLegalDocumentId(document)) return {};
  const [source, t] = await Promise.all([
    readLegalDocument(document, lang),
    getTranslations({ locale: lang }),
  ]);
  const title = source.match(/^# (.+)/)?.[1] ?? legalDocuments[document].title;
  const description = `${t("footer.legalTitle")} — ${t(`footer.legalLinks.${legalDocuments[document].labelKey}`)}. Histae.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${publicUrl}${legalDocumentHref(lang, document)}`,
      languages: Object.fromEntries([
        ...locales.map((locale) => [locale, `${publicUrl}${legalDocumentHref(locale, document)}`]),
        ["x-default", `${publicUrl}${legalDocumentHref(defaultLocale, document)}`],
      ]),
    },
    openGraph: {
      title,
      description,
      locale: localeConfig[lang].openGraph,
      alternateLocale: locales.filter((locale) => locale !== lang).map((locale) => localeConfig[locale].openGraph),
    },
    twitter: { title, description },
    robots: { index: false, follow: true },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { lang, document } = await params;
  if (!isLocale(lang) || !isLegalDocumentId(document)) notFound();
  setRequestLocale(lang);
  const [source, t] = await Promise.all([
    readLegalDocument(document, lang),
    getTranslations({ locale: lang }),
  ]);

  return (
    <main id="main-content" className="information-page legal-page">
      <div className="shell legal-content">
        <p className="eyebrow">{t("footer.legalTitle")}</p>
        <article className="legal-document" lang={lang}>
          <Markdown remarkPlugins={[remarkGfm]} components={{
            table: ({ children }) => (
              <div className="legal-table-scroll" role="region" aria-label={t("footer.legalLinks.privacy")} tabIndex={0}>
                <table>{children}</table>
              </div>
            ),
          }}>{source}</Markdown>
        </article>
      </div>
      <section className="shell page-closing">
        <Link className="text-link" href={localizedHref(lang, "home")}>
          {t("common.backHome")}<span aria-hidden="true"> →</span>
        </Link>
      </section>
    </main>
  );
}
