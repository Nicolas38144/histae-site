import { serializeJsonLd } from "../lib/json-ld";
import { getTranslations } from "next-intl/server";
import { absoluteLocalizedUrl } from "../lib/metadata";
import { planCatalog } from "../lib/plans";
import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";

export async function StructuredData({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const pricing = messages.pricing;
  const homeUrl = absoluteLocalizedUrl(locale, "home");

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "Histae",
        url: homeUrl,
        inLanguage: locale,
        description: t("home.intro"),
      },
      {
        "@type": "SoftwareApplication",
        name: "Histae",
        applicationCategory: "LifestyleApplication",
        operatingSystem: "iOS, Android",
        url: homeUrl,
        description: t("home.intro"),
        offers: [
          {
            "@type": "Offer",
            name: pricing.plans.free.name,
            price: String(planCatalog.free.priceCents / 100),
            priceCurrency: "EUR",
            url: absoluteLocalizedUrl(locale, "pricing"),
          },
        ],
      },
    ],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
