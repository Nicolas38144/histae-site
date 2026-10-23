import { getTranslations } from "next-intl/server";
import siteConfig from "../config/site.json";
import type { Locale } from "../lib/site-config";

export async function SourceCodeSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "transparency" });

  return (
    <section id="source-code" className="shell source-section" aria-labelledby="source-code-title">
      <div className="section-heading">
        <p className="eyebrow">{t("eyebrow")}</p>
        <h2 id="source-code-title">{t("title")}</h2>
        <p>{t("intro")}</p>
      </div>
      <details className="source-reveal">
      <summary>{t("viewCode")}</summary>
      <div className="source-grid">
        {(Object.keys(siteConfig.repositories) as (keyof typeof siteConfig.repositories)[]).map(id => (
          <article className="source-card" key={id}>
            <h3>{t(`repositories.${id}.title`)}</h3>
            <p>{t(`repositories.${id}.description`)}</p>
            <a className="text-link" href={siteConfig.repositories[id]}>
              {t("viewCode")}<span className="visually-hidden"> — {t(`repositories.${id}.title`)}</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          </article>
        ))}
      </div>
      <p className="source-policy">{t("policy")}</p>
      </details>
    </section>
  );
}
