import { getTranslations } from "next-intl/server";
import { getPricingCards } from "../lib/pricing";
import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingCard } from "./pricing-card";

type PricingCardsProps = { locale: Locale };

export async function PricingCards({ locale }: PricingCardsProps) {
  const t = await getTranslations({ locale, namespace: "pricing" });
  const { pricing } = getMessagesForLocale(locale);
  const plans = getPricingCards(locale, pricing, t);

  return (
    <div className="pricing-grid">
      {plans.map((plan) => <PricingCard key={plan.id} plan={plan} premiumBadge={pricing.premiumBadge} />)}
    </div>
  );
}
