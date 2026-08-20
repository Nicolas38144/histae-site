import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type InformationPageName, type Locale } from "../lib/site-config";
import { getMessagesForLocale, type AppMessages } from "../messages";

function getPageBlockEntries(messages: AppMessages, pageName: InformationPageName) {
  switch (pageName) {
    case "feature": return Object.entries(messages.pages.feature.blocks);
    case "safety": return Object.entries(messages.pages.safety.blocks);
    case "about": return Object.entries(messages.pages.about.blocks);
    case "download": return Object.entries(messages.pages.download.blocks);
  }
}

export async function InformationPage({ locale, pageName }: { locale: Locale; pageName: InformationPageName }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const page = messages.pages[pageName];
  const blocks = getPageBlockEntries(messages, pageName).map(([, block]) => block);
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
          <article key={block.title} className="content-block">
            <span aria-hidden="true">0{index + 1}</span>
            <div>
              <h2>{block.title}</h2>
              <p>{block.text}</p>
            </div>
          </article>
        ))}
      </section>
      <section className="shell page-closing">
        {footerNote ? <p>{footerNote}</p> : null}
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
