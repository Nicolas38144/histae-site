import Link from "next/link";
import { getCommercialValues } from "../lib/plans";
import { getTranslations } from "next-intl/server";
import { localizedHref, type InformationPageName, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { SourceCodeSection } from "./source-code-section";

type InformationPageProps = {
  locale: Locale;
  pageName: InformationPageName;
};

export async function InformationPage({ locale, pageName }: InformationPageProps) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const page = messages.pages[pageName];
  const values = getCommercialValues(locale);
  const blocks = Object.entries(page.blocks).map(([id, block]) => ({
    id,
    ...block,
    text: t(`pages.${pageName}.blocks.${id}.text`, values),
  }));
  const footerNote = pageName === "download" ? messages.pages.download.footerNote : undefined;

  return (
    <main id="main-content" className="information-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 id="page-title">{page.title}</h1>
        <p>{page.intro}</p>
      </section>
      <section className="shell content-blocks" aria-label={page.title}>
        {blocks.map((block, index) => (
          <article key={block.id} className="content-block">
            <span aria-hidden="true">0{index + 1}</span>
            <div>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </div>
          </article>
        ))}
      </section>
      {pageName === "safety" || pageName === "about" ? <SourceCodeSection locale={locale} /> : null}
      <section className="shell page-closing">
        {footerNote ? <p>{footerNote}</p> : null}
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
