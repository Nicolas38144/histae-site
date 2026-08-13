import Link from "next/link";
import type { Locale, PageName, SiteCopy } from "../lib/site-content";

export function InformationPage({ locale, copy, pageName }: { locale: Locale; copy: SiteCopy; pageName: PageName }) {
  const page = copy.pages[pageName];

  return (
    <main id="main-content" className="information-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 id="page-title">{page.title}</h1>
        <p>{page.intro}</p>
      </section>
      <section className="shell content-blocks" aria-label={page.title}>
        {page.blocks.map((block, index) => (
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
        {page.footerNote ? <p>{page.footerNote}</p> : null}
        <Link className="text-link" href={`/${locale}`}>{copy.common.backHome}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
