import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, type Locale } from "../lib/site-config";
import { PricingCards } from "./pricing-cards";
import { StructuredData } from "./structured-data";
import { AppScreenshot } from "./app-screenshot";

export async function HomePage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
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
      <section className="shell reading-note" aria-labelledby="reading-title">
        <h2 id="reading-title">{t("home.readingTitle")}</h2>
        <div><p>{t("home.readingText")}</p><p>{t("home.readingAfterthought")}</p></div>
      </section>
      <section className="shell conversation-story" aria-labelledby="conversation-title">
        <AppScreenshot locale={locale} screen="chat" />
        <div className="story-copy">
          <h2 id="conversation-title">{t("home.conversationTitle")}</h2>
          <p className="story-lead">{t("home.conversationText")}</p>
          <aside className="conversation-aside"><h3>{t("home.pauseTitle")}</h3><p>{t("home.pauseText")}</p></aside>
          <Link className="text-link" href={localizedHref(locale, "feature")}>{t("home.conversationLink")}<span aria-hidden="true"> →</span></Link>
        </div>
      </section>
      <section className="shell app-story profile-story" aria-labelledby="profile-title">
        <div className="story-copy">
          <h2 id="profile-title">{t("home.profileTitle")}</h2>
          <p className="story-lead">{t("home.profileText")}</p>
          <p className="story-lead">{t("home.profilePrompt")}</p>
        </div>
        <AppScreenshot locale={locale} screen="profile" />
      </section>
      <section className="shell privacy-note" aria-labelledby="safety-title">
        <h2 id="safety-title">{t("home.safetyTitle")}</h2>
        <p>{t("home.safetyText")}</p>
        <Link className="text-link" href={localizedHref(locale, "safety")}>{t("home.safetyLink")}<span aria-hidden="true"> →</span></Link>
      </section>
      <section className="pricing-section" aria-labelledby="pricing-title">
        <div className="shell">
          <div className="section-heading"><h2 id="pricing-title">{t("pricing.title")}</h2><p>{t("pricing.intro")}</p></div>
          <PricingCards locale={locale} compact />
          <div className="pricing-footer"><p>{t("pricing.notice")}</p><Link className="text-link" href={localizedHref(locale, "pricing")}>{t("pricing.cta")}<span aria-hidden="true"> →</span></Link></div>
        </div>
      </section>
      <section className="shell closing-section" aria-labelledby="closing-title">
        <h2 id="closing-title">{t("home.closingTitle")}</h2><p>{t("home.closingText")}</p>
        <Link className="button button-primary" href={localizedHref(locale, "download")}>{t("home.primary")}</Link>
      </section>
    </main>
  );
}
