import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingCards } from "./pricing-cards";
import { StructuredData } from "./structured-data";
import { AppScreenshot } from "./app-screenshot";

export async function HomePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const { home } = getMessagesForLocale(locale);
  return (
    <main id="main-content">
      <StructuredData locale={locale} />
      <section className="hero shell screenshot-hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow">{t("home.eyebrow")}</p>
          <h1 id="hero-title">{t("home.title")}</h1>
          <p className="hero-intro">{t("home.intro")}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={localizedHref(locale, "download")}>{t("home.primary")}</Link>
            <Link className="text-link" href={localizedHref(locale, "feature")}>{t("home.secondary")}<span aria-hidden="true"> →</span></Link>
          </div>
        </div>
        <AppScreenshot locale={locale} screen="feed" priority />
      </section>
      <section className="shell principles-ribbon" aria-labelledby="principles-title">
        <h2 id="principles-title">{t("home.principlesTitle")}</h2>
        <div>{Object.values(home.principles).map(p => <article key={p.title}><h3>{p.title}</h3><p>{p.text}</p></article>)}</div>
      </section>
      <section className="shell app-story app-story-reverse" aria-labelledby="rhythm-title">
        <div className="story-copy">
          <p className="eyebrow">{t("home.rhythmEyebrow")}</p>
          <h2 id="rhythm-title">{t("home.rhythmTitle")}</h2>
          <p className="story-lead">{t("home.rhythmIntro")}</p>
          <div className="story-passage"><h3>{home.steps.conversation.title}</h3><p>{home.steps.conversation.text}</p></div>
          <div className="story-passage"><h3>{home.features.photoReveal.title}</h3><p>{home.features.photoReveal.text}</p></div>
          <Link className="text-link" href={localizedHref(locale, "feature")}>{t("home.secondary")}<span aria-hidden="true"> →</span></Link>
        </div>
        <AppScreenshot locale={locale} screen="chat" />
      </section>
      <section className="shell app-story" aria-labelledby="features-title">
        <div className="story-copy">
          <p className="eyebrow">{t("home.featuresEyebrow")}</p>
          <h2 id="features-title">{t("home.featuresTitle")}</h2>
          <p className="story-lead">{t("home.featuresIntro")}</p>
          <div className="story-passage"><h3>{home.features.profiles.title}</h3><p>{home.features.profiles.text}</p></div>
          <div className="story-passage"><h3>{home.features.preferences.title}</h3><p>{home.features.preferences.text}</p></div>
        </div>
        <AppScreenshot locale={locale} screen="profile" />
      </section>
      <section className="pricing-section" aria-labelledby="pricing-title">
        <div className="shell">
          <div className="section-heading"><p className="eyebrow">{t("pricing.eyebrow")}</p><h2 id="pricing-title">{t("pricing.title")}</h2><p>{t("pricing.intro")}</p></div>
          <PricingCards locale={locale} compact />
          <div className="pricing-footer"><p>{t("pricing.notice")}</p><Link className="text-link" href={localizedHref(locale, "pricing")}>{t("pricing.cta")}<span aria-hidden="true"> →</span></Link></div>
        </div>
      </section>
      <section className="shell app-story app-story-reverse" aria-labelledby="safety-title">
        <div className="story-copy">
          <p className="eyebrow">{t("home.safetyEyebrow")}</p><h2 id="safety-title">{t("home.safetyTitle")}</h2>
          <p className="story-lead">{t("home.safetyText")}</p>
          <Link className="text-link" href={localizedHref(locale, "safety")}>{t("home.safetyLink")}<span aria-hidden="true"> →</span></Link>
        </div>
        <AppScreenshot locale={locale} screen="privacy" />
      </section>
      <section className="shell closing-section" aria-labelledby="closing-title">
        <p className="eyebrow">Histae</p><h2 id="closing-title">{t("home.closingTitle")}</h2><p>{t("home.closingText")}</p>
        <Link className="button button-primary" href={localizedHref(locale, "download")}>{t("home.primary")}</Link>
      </section>
    </main>
  );
}
