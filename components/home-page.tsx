import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingCards } from "./pricing-cards";
import { StructuredData } from "./structured-data";

export async function HomePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const principles = Object.values(messages.home.principles);
  const steps = Object.values(messages.home.steps);
  const features = Object.values(messages.home.features);

  return (
    <main id="main-content">
      <StructuredData locale={locale} />
      <section className="hero shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1 id="hero-title">{t("home.title")}</h1>
          <p className="hero-intro">{t("home.intro")}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={localizedHref(locale, "download")}>{t("home.primary")}</Link>
            <Link className="text-link" href={localizedHref(locale, "feature")}>{t("home.secondary")}<span aria-hidden="true"> →</span></Link>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="art-glow art-glow-left" />
          <span className="art-glow art-glow-right" />
          <span className="art-orbit art-orbit-one" />
          <span className="art-orbit art-orbit-two" />
          <span className="art-thread art-thread-left" />
          <span className="art-thread art-thread-right" />
          <span className="art-point" />
        </div>
      </section>

      <section className="shell section" aria-labelledby="principles-title">
        <div className="section-heading">
          <p className="eyebrow">Histae</p>
          <h2 id="principles-title">{t("home.principlesTitle")}</h2>
        </div>
        <div className="principles-grid">
          {principles.map((principle, index) => (
            <article className="principle-card" key={principle.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rhythm-section">
        <div className="shell rhythm-layout">
          <div className="section-heading">
            <p className="eyebrow">{t("home.rhythmEyebrow")}</p>
            <h2>{t("home.rhythmTitle")}</h2>
            <p>{t("home.rhythmIntro")}</p>
          </div>
          <ol className="steps-list">
            {steps.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="shell section features-section" aria-labelledby="features-title">
        <div className="section-heading">
          <p className="eyebrow">{t("home.featuresEyebrow")}</p>
          <h2 id="features-title">{t("home.featuresTitle")}</h2>
          <p>{t("home.featuresIntro")}</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" aria-labelledby="pricing-title">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">{t("pricing.eyebrow")}</p>
            <h2 id="pricing-title">{t("pricing.title")}</h2>
            <p>{t("pricing.intro")}</p>
          </div>
          <PricingCards locale={locale} />
          <div className="pricing-footer">
            <p>{t("pricing.notice")}</p>
            <Link className="text-link" href={localizedHref(locale, "pricing")}>{t("pricing.cta")}<span aria-hidden="true"> →</span></Link>
          </div>
        </div>
      </section>

      <section className="shell safety-teaser" aria-labelledby="safety-title">
        <div>
          <p className="eyebrow">{t("home.safetyEyebrow")}</p>
          <h2 id="safety-title">{t("home.safetyTitle")}</h2>
        </div>
        <div>
          <p>{t("home.safetyText")}</p>
          <Link className="text-link" href={localizedHref(locale, "safety")}>{t("home.safetyLink")}<span aria-hidden="true"> →</span></Link>
        </div>
      </section>

      <section className="shell closing-section" aria-labelledby="closing-title">
        <p className="eyebrow">Histae</p>
        <h2 id="closing-title">{t("home.closingTitle")}</h2>
        <p>{t("home.closingText")}</p>
        <Link className="button button-primary" href={localizedHref(locale, "download")}>{t("home.primary")}</Link>
      </section>
    </main>
  );
}
