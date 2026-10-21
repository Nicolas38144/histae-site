import Link from "next/link";
import { getCommercialValues } from "../lib/plans";
import { getTranslations } from "next-intl/server";
import { localizedHref, type InformationPageName, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { SourceCodeSection } from "./source-code-section";
import { AppScreenshot, type ScreenKind } from "./app-screenshot";

export async function InformationPage({ locale, pageName }: {
  locale: Locale; pageName: InformationPageName;
}) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const page = messages.pages[pageName];
  const values = getCommercialValues(locale);
  const blocks = Object.fromEntries(Object.entries(page.blocks).map(([id, block]) => [id, {
    ...block, text: t(`pages.${pageName}.blocks.${id}.text`, values),
  }]));
  function passage(id: string, heading = true) {
    const block = blocks[id];
    return <div className="story-passage" key={id}>
      {heading ? <h3>{block.title}</h3> : null}<p>{block.text}</p>
    </div>;
  }
  function details(ids: string[]) {
    return <div className="story-details">{ids.map(id => <details key={id}>
      <summary>{blocks[id].title}<span aria-hidden="true">+</span></summary>
      <p>{blocks[id].text}</p>
    </details>)}</div>;
  }
  function story(screen: ScreenKind, main: string, supporting: string[], more: string[] = [], reverse = false) {
    return <section className={`shell app-story${reverse ? " app-story-reverse" : ""}`} aria-labelledby={`story-${main}`} key={main}>
      <div className="story-copy">
        <p className="eyebrow">{messages.home.screens[`${screen}Label`]}</p>
        <h2 id={`story-${main}`}>{blocks[main].title}</h2>
        <p className="story-lead">{blocks[main].text}</p>
        {supporting.map(id => passage(id))}
        {more.length ? details(more) : null}
      </div>
      <AppScreenshot locale={locale} screen={screen} />
    </section>;
  }
  return (
    <main id="main-content" className="information-page illustrated-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{page.eyebrow}</p><h1 id="page-title">{page.title}</h1><p>{page.intro}</p>
      </section>
      {pageName === "feature" ? <>
        {story("feed", "profile", ["preferences"], ["discovery", "location", "stableDecisions"])}
        {story("chat", "conversationWindow", ["reciprocity", "photoReveal"], ["continuationWindow", "messaging"], true)}
        <section className="shell credits-invitation">
          <p className="eyebrow">{messages.home.screens.creditsLabel}</p>
          <h2>{blocks.continuationCredits.title}</h2>
          <p>{t("pricing.credits.intro")}</p>
          {details(["continuationCredits"])}
          <Link className="text-link" href={localizedHref(locale, "pricing")}>{t("pricing.cta")}<span aria-hidden="true"> →</span></Link>
        </section>
      </> : null}
      {pageName === "safety" ? <>
        {story("privacy", "consents", ["consentWithdrawal"], [], true)}
        <section className="shell editorial-pair">{passage("passwordless")}{passage("rights")}</section>
      </> : null}
      {pageName === "about" ? <>
        <section className="shell editorial-statement"><h2>{blocks.promise.title}</h2><p>{blocks.promise.text}</p></section>
        {story("profile", "product", ["community"], ["privacy"], true)}
      </> : null}
      {pageName === "download" ? <>
        <section className="shell launch-gallery" aria-label={page.title}>
          <AppScreenshot locale={locale} screen="feed" priority />
          <AppScreenshot locale={locale} screen="chat" />
          <AppScreenshot locale={locale} screen="profile" />
        </section>
        <section className="shell launch-note"><h2>{blocks.availability.title}</h2><p>{blocks.availability.text}</p><p>{blocks.finalization.text}</p>{details(["officialLinks"])}</section>
      </> : null}
      {pageName === "safety" || pageName === "about" ? <SourceCodeSection locale={locale} /> : null}
      <section className="shell page-closing">
        {pageName === "download" ? <p>{messages.pages.download.footerNote}</p> : null}
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
