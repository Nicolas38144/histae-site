import Link from "next/link";
import type { ReactNode } from "react";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { SourceCodeSection } from "./source-code-section";

type PageIntro = { eyebrow: string; title: string; intro: string };

/** Shared editorial frame; each page owns its content and composition. */
export function InformationPage({ locale, page, children, withSourceCode = false }: {
  locale: Locale;
  page: PageIntro;
  children: ReactNode;
  withSourceCode?: boolean;
}) {
  const { common } = getMessagesForLocale(locale);
  return (
    <main id="main-content" className="information-page illustrated-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 id="page-title">{page.title}</h1>
        <p>{page.intro}</p>
      </section>
      {children}
      {withSourceCode ? <SourceCodeSection locale={locale} /> : null}
      <section className="shell page-closing">
        <Link className="text-link" href={localizedHref(locale, "home")}>
          {common.backHome}<span aria-hidden="true"> →</span>
        </Link>
      </section>
    </main>
  );
}
