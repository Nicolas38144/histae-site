"use client";

import { useTranslations } from "next-intl";
import { usePublicOffers } from "../hooks/use-public-offers";
import { subscriptionHref } from "../lib/billing/navigation";
import { annualComparison, formatOfferPrice } from "../lib/pricing-offers";
import type { PricingCardModel } from "../lib/pricing";
import type { Locale } from "../lib/site-config";
import { PricingCard } from "./pricing-card";

export function PricingGrid({ locale, plans, compact, actions }: {
  locale: Locale; plans: PricingCardModel[]; compact: boolean; actions: Record<string, string>;
}) {
  const { offers, status } = usePublicOffers(locale);
  const t = useTranslations("pricing.billing");
  const comparison = annualComparison(offers);
  return <>
    <div className="pricing-grid">
      {plans.map(plan => {
        const offer = offers.find(offer => offer.billing_period === plan.id);
        const current = offer ? {
          ...plan,
          price: formatOfferPrice(offer.price_cents, offer.currency, locale),
          period: t(plan.id === "annual" ? "annualPeriod" : "monthlyPeriod"),
          ...(plan.id === "annual" && comparison ? {
            equivalent: t("monthlyEquivalent", { price: formatOfferPrice(comparison.monthlyEquivalent, offer.currency, locale) }),
            ...(comparison.saving > 0 ? {
              saving: t("annualSaving", { amount: formatOfferPrice(comparison.saving, offer.currency, locale) }),
              ...(comparison.percent > 0 ? { badge: t("annualBadge", { percent: comparison.percent }) } : {}),
            } : {}),
          } : {}),
        } : plan;
        return <PricingCard key={plan.id} plan={current} compact={compact}
          action={plan.id === "free" ? undefined : { href: subscriptionHref(locale, plan.id), label: actions[plan.id] }} />;
      })}
    </div>
    <p className="pricing-source" role="status">{t(status === "ready" ? "pricesLive" : status === "loading" ? "pricesLoading" : "pricesUnavailable")}</p>
  </>;
}
