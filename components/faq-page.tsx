import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getCommercialValues } from "../lib/plans";
import { localizedHref, type Locale, type SiteRouteId } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";

const faqItemIds = [
  "availability",
  "account",
  "discovery",
  "match",
  "photos",
  "pricing",
  "location",
  "moderation",
  "privacy",
] as const;

type FaqItemId = (typeof faqItemIds)[number];

const faqItemRoutes: Record<FaqItemId, SiteRouteId> = {
  availability: "download",
  account: "safety",
  discovery: "feature",
  match: "feature",
  photos: "feature",
  pricing: "pricing",
  location: "safety",
  moderation: "safety",
  privacy: "safety",
};

export async function FaqPage({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const commercialValues = getCommercialValues(locale);

  return (
    <main id="main-content" className="information-page faq-page">
      <section className="shell page-intro" aria-labelledby="page-title">
        <p className="eyebrow">{messages.faq.eyebrow}</p>
        <h1 id="page-title">{messages.faq.title}</h1>
        <p>{messages.faq.intro}</p>
      </section>

      <section className="shell faq-list" aria-label={messages.faq.title}>
        {faqItemIds.map((itemId, index) => {
          const item = messages.faq.items[itemId];
          const answer = itemId === "pricing"
            ? t("faq.items.pricing.answer", commercialValues)
            : item.answer;

          return (
            <details className="faq-item" key={itemId} open={index === 0}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-toggle" aria-hidden="true">+</span>
              </summary>
              <div className="faq-answer">
                <p>{answer}</p>
                <Link className="text-link" href={localizedHref(locale, faqItemRoutes[itemId])}>
                  {item.linkLabel}<span aria-hidden="true"> →</span>
                </Link>
              </div>
            </details>
          );
        })}
      </section>

      <section className="shell page-closing faq-closing">
        <Link className="text-link" href={localizedHref(locale, "home")}>{t("common.backHome")}<span aria-hidden="true"> →</span></Link>
      </section>
    </main>
  );
}
