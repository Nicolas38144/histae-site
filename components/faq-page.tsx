import { faqTopics } from "../lib/faq";
import { FaqExplorer } from "./faq-explorer";
import { SubscriptionHelp } from "./subscription-help";
import Link from "next/link";
import { AppScreenshot } from "./app-screenshot";
import { getTranslations } from "next-intl/server";
import { getCommercialValues } from "../lib/plans";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";

export async function FaqPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const commercialValues = getCommercialValues();

  return (
    <main id="main-content" className="information-page faq-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{messages.faq.eyebrow}</p>
        <h1 id="page-title">{messages.faq.title}</h1>
        <p>{messages.faq.intro}</p>
      </section>

      <section className="shell faq-illustrated" aria-label={messages.faq.title}>
        <FaqExplorer copy={messages.discovery} entries={faqTopics.map(({ id, category, route }) => ({
          id, category,
          ...messages.faq.items[id],
          answer: id === "pricing" ? t("faq.items.pricing.answer",commercialValues) : messages.faq.items[id].answer,
          href: localizedHref(locale,route),
        }))} />
        <AppScreenshot locale={locale} screen="chat" />
      </section>

      <SubscriptionHelp locale={locale} copy={messages.discovery} />
      <section className="shell page-closing faq-closing">
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
