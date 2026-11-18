import { getTranslations } from "next-intl/server";
import { getPricingCards } from "../lib/pricing";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingCard } from "./pricing-card";

export async function PricingCards({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const { pricing } = getMessagesForLocale(locale);
  const plans = getPricingCards(locale, pricing, t);
  return <>
    <div className="pricing-grid">
      {plans.map(plan => <PricingCard key={plan.id} plan={plan} compact={compact}
        action={{ href: localizedHref(locale, "download"), label: t("appCta") }} />)}
    </div>
    <p className="pricing-source">{t("storePrices")}</p>
  </>;
}
