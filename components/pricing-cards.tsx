import { NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import { getPricingCards } from "../lib/pricing";
import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { PricingGrid } from "./pricing-grid";

export async function PricingCards({ locale, compact = false }: { locale: Locale; compact?: boolean }) {
  const [t, checkout] = await Promise.all([
    getTranslations({ locale, namespace: "pricing" }),
    getTranslations({ locale, namespace: "billingCheckout" }),
  ]);
  const { pricing } = getMessagesForLocale(locale);
  const plans = getPricingCards(locale, pricing, t);
  const actions = Object.fromEntries(plans.map(plan => [plan.id, checkout("choosePlan", { plan: plan.name })]));
  return <NextIntlClientProvider locale={locale} messages={{ pricing: { billing: pricing.billing } }}>
    <PricingGrid locale={locale} plans={plans} compact={compact} actions={actions} />
  </NextIntlClientProvider>;
}
