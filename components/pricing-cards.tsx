import { getTranslations } from "next-intl/server";
import { subscriptionHref } from "../lib/billing/navigation";
import { getPricingCards } from "../lib/pricing";
import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingCard } from "./pricing-card";

type PricingCardsProps = { locale: Locale; compact?: boolean };

export async function PricingCards({ locale, compact = false }: PricingCardsProps) {
  const [t, checkout] = await Promise.all([
    getTranslations({ locale, namespace: "pricing" }),
    getTranslations({ locale, namespace: "billingCheckout" }),
  ]);
  const { pricing } = getMessagesForLocale(locale);
  const plans = getPricingCards(locale, pricing, t);

  return (
    <div className="pricing-grid">
      {plans.map((plan) => (
        <PricingCard
          key={plan.id}
          plan={plan}
          compact={compact}
          action={plan.id === "free" ? undefined : {
            href: subscriptionHref(locale, plan.id),
            label: checkout("choosePlan", { plan: plan.name }),
          }}
        />
      ))}
    </div>
  );
}
