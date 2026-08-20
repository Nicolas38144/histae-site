import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale } from "../lib/site-config";
import { PricingCards } from "./pricing-cards";

export async function PricingPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });

  return (
    <main id="main-content" className="information-page pricing-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{t("pricing.eyebrow")}</p>
        <h1 id="page-title">{t("pricing.title")}</h1>
        <p>{t("pricing.intro")}</p>
      </section>
      <section className="shell pricing-page-content" aria-label={t("pricing.title")}>
        <PricingCards locale={locale} />
        <p className="pricing-notice">{t("pricing.notice")}</p>
      </section>
      <section className="shell page-closing">
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
