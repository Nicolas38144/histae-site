import { subscriptionHref } from "../lib/billing/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCommercialValues } from "../lib/plans";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { AppScreenshot } from "./app-screenshot";
import { PricingCards } from "./pricing-cards";

export async function PricingPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const { pricing } = getMessagesForLocale(locale);
  const values = getCommercialValues(locale);

  return (
    <main id="main-content" className="information-page pricing-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{t("pricing.eyebrow")}</p>
        <h1 id="page-title">{t("pricing.title")}</h1>
        <p>{t("pricing.intro")}</p>
      </section>
      <section className="shell pricing-page-content" aria-labelledby="plans-title">
        <div className="section-heading pricing-comparison-heading">
          <h2 id="plans-title">{t("pricing.comparisonTitle")}</h2>
          <p>{t("pricing.comparisonIntro")}</p>
        </div>
        <PricingCards locale={locale} />
        <p className="pricing-notice">{t("pricing.notice")}</p>
      </section>
      <section className="shell pricing-explainer" aria-labelledby="continuation-title">
        <div className="section-heading">
          <p className="eyebrow">{t("pricing.howItWorks.eyebrow")}</p>
          <h2 id="continuation-title">{t("pricing.howItWorks.title")}</h2>
          <p>{t("pricing.howItWorks.intro")}</p>
        </div>
        <div className="pricing-reading editorial-pair">
          {Object.entries(pricing.howItWorks.steps).map(([id, step]) => (
            <article className="story-passage" key={id}>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="shell app-story" aria-labelledby="credits-title">
        <div className="story-copy">
          <p className="eyebrow">{t("pricing.credits.eyebrow")}</p>
          <h2 id="credits-title">{t("pricing.credits.title")}</h2>
          <p className="story-lead">{t("pricing.credits.intro")}</p>
          <div className="story-passage"><h3>{t("pricing.credits.items.weekly.title", values)}</h3><p>{t("pricing.credits.items.weekly.text", values)}</p></div>
          <div className="story-details">
            {Object.keys(pricing.credits.items).filter(id => id !== "weekly").map(id => <details key={id}>
              <summary>{t(`pricing.credits.items.${id}.title`, values)}<span aria-hidden="true">+</span></summary>
              <p>{t(`pricing.credits.items.${id}.text`, values)}</p>
            </details>)}
          </div>
          <p className="pricing-mutual-note">{t("pricing.credits.mutualNote")}</p>
        </div>
        <AppScreenshot locale={locale} screen="credits" />
      </section>
      <section className="shell pricing-questions" aria-labelledby="billing-title">
        <div className="section-heading">
          <h2 id="billing-title">{t("pricing.questionsTitle")}</h2>
        </div>
        <div className="faq-list">
          {Object.entries(pricing.questions).map(([id, question]) => (
            <details className="faq-item" key={id}>
              <summary>
                <span>{question.title}</span>
                <span className="faq-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="faq-answer"><p>{t(`pricing.questions.${id}.text`, values)}</p></div>
            </details>
          ))}
        </div>
      </section>
      <section className="shell pricing-checkout-closing" aria-labelledby="subscription-title">
        <div className="pricing-checkout-panel">
          <div className="pricing-checkout-copy">
            <h2 id="subscription-title">{t("billingCheckout.closingTitle")}</h2>
            <p>{t("billingCheckout.closingIntro")}</p>
          </div>
          <div className="pricing-checkout-action">
            <Link className="button button-primary" href={subscriptionHref(locale)}>{t("billingCheckout.open")}</Link>
            <p>{t("billingCheckout.storePrice")}</p>
          </div>
        </div>
        <div className="pricing-help-links">
          <Link className="text-link" href={localizedHref(locale, "download")}>{t("pricing.launchCta")}<span aria-hidden="true"> →</span></Link>
          <Link className="text-link" href={localizedHref(locale, "faq")}>{t("pricing.faqCta")}<span aria-hidden="true"> →</span></Link>
        </div>
      </section>
    </main>
  );
}
