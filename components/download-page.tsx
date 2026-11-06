import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { localizedHref, storeLinks, supportEmail, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { AppScreenshot } from "./app-screenshot";

export async function DownloadPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const page = getMessagesForLocale(locale).pages.download;
  return (
    <main id="main-content" className="information-page availability-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{page.eyebrow}</p>
        <h1 id="page-title">{page.title}</h1>
        <p>{page.intro}</p>
      </section>
      <section className="shell availability-platforms" aria-labelledby="platforms-title">
        <h2 id="platforms-title" className="visually-hidden">{page.platformsTitle}</h2>
        <article className="availability-platform availability-android" aria-labelledby="android-title">
          <p className="eyebrow">{page.android.label}</p>
          <h2 id="android-title">{page.android.status}</h2>
          <p>{page.android.text}</p>
          <p className="availability-access">{page.android.access}</p>
          <a className="text-link" href={storeLinks.androidTest}>
            {page.android.action}<span aria-hidden="true"> →</span>
          </a>
        </article>
        <article className="availability-platform" aria-labelledby="ios-title">
          <p className="eyebrow">{page.ios.label}</p>
          <h2 id="ios-title">{page.ios.status}</h2>
          <p>{page.ios.text}</p>
        </article>
      </section>
      <section className="shell availability-feedback" aria-labelledby="feedback-title">
        <div>
          <h2 id="feedback-title">{page.feedbackTitle}</h2>
          <p>{page.feedbackText}</p>
        </div>
        <a className="text-link" href={`mailto:${supportEmail}?subject=${encodeURIComponent(page.feedbackSubject)}`}>
          {page.feedbackLink}<span aria-hidden="true"> →</span>
        </a>
      </section>
      <section className="shell availability-previews" aria-labelledby="previews-title">
        <h2 id="previews-title">{page.previewTitle}</h2>
        <div className="launch-gallery">
          <AppScreenshot locale={locale} screen="feed" />
          <AppScreenshot locale={locale} screen="chat" />
          <AppScreenshot locale={locale} screen="profile" />
        </div>
      </section>
      <section className="shell page-closing">
        <p>{page.footerNote}</p>
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
