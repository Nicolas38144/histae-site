import { getTranslations } from "next-intl/server";
import {
  formatEuro,
  getPlanFeatureIds,
  planCatalog,
  planIds,
  type PlanFeatureId,
} from "../lib/plans";
import type { Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";

export async function PricingCards({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale });
  const messages = getMessagesForLocale(locale);
  const pricing = messages.pricing;
  const featureLabels: Record<PlanFeatureId, string> = {
    messaging: t("pricing.features.messaging"),
    photoReveal: t("pricing.features.photoReveal"),
    limitedContinuations: t("pricing.features.limitedContinuations", {
      count: planCatalog.free.successfulContinuationsPerWeek,
    }),
    unlimitedContinuations: t("pricing.features.unlimitedContinuations"),
  };
  const plans = planIds.map((planId) => {
    const copy = pricing.plans[planId];
    if (planId === "free") {
      return {
        id: planId,
        ...copy,
        featured: planCatalog.free.featured,
        price: formatEuro(planCatalog.free.priceCents, locale),
        period: t("pricing.billing.freePeriod"),
        annual: t("pricing.billing.noSubscription"),
        trial: undefined,
        features: getPlanFeatureIds(planId).map((featureId) => featureLabels[featureId]),
      };
    }
    return {
      id: planId,
      ...copy,
      featured: planCatalog.premium.featured,
      price: formatEuro(planCatalog.premium.monthlyPriceCents, locale),
      period: t("pricing.billing.monthlyPeriod"),
      annual: t("pricing.billing.annualPeriod", {
        price: formatEuro(planCatalog.premium.annualPriceCents, locale),
      }),
      trial: t("pricing.billing.trial", { days: planCatalog.premium.trialDays }),
      features: getPlanFeatureIds(planId).map((featureId) => featureLabels[featureId]),
    };
  });

  return (
    <div className="pricing-grid">
      {plans.map((plan) => (
        <article className="pricing-card" data-featured={plan.featured} key={plan.id}>
          <div className="pricing-card-heading">
            <h3>{plan.name}</h3>
            {plan.featured ? <span className="plan-badge">{pricing.premiumBadge}</span> : null}
          </div>
          <p className="plan-price"><strong>{plan.price}</strong><span>{plan.period}</span></p>
          <p className="plan-annual">{plan.annual}</p>
          {plan.trial ? <p className="plan-trial">{plan.trial}</p> : null}
          <p className="plan-description">{plan.description}</p>
          <ul>
            {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
          </ul>
        </article>
      ))}
    </div>
  );
}
