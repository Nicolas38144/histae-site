import type { getTranslations } from "next-intl/server";
import type { AppMessages } from "../messages";
import { formatEuro, getPlanFeatureIds, planCatalog, planIds, type PlanFeatureId, type PlanId } from "./plans";
import type { Locale } from "./site-config";

type PricingTranslations = Awaited<ReturnType<typeof getTranslations<"pricing">>>;

export type PricingCardModel = {
  id: PlanId;
  name: string;
  description: string;
  featured: boolean;
  price: string;
  period: string;
  annual: string;
  trial?: string;
  features: { id: PlanFeatureId; label: string }[];
};

export function getPricingCards(
  locale: Locale,
  pricing: AppMessages["pricing"],
  t: PricingTranslations,
): PricingCardModel[] {
  const featureLabels: Record<PlanFeatureId, string> = {
    messaging: t("features.messaging"),
    photoReveal: t("features.photoReveal"),
    limitedContinuations: t("features.limitedContinuations", {
      count: planCatalog.free.weeklyIncludedCredits,
    }),
    unlimitedContinuations: t("features.unlimitedContinuations"),
    rewardedCredits: t("features.rewardedCredits", {
      stock: planCatalog.free.advertisingCreditStockLimit,
    }),
    weeklyLimit: t("features.weeklyLimit", {
      count: planCatalog.free.successfulContinuationsPerWeek,
    }),
    noAds: t("features.noAds"),
  };

  return planIds.map((planId) => {
    const common = {
      id: planId,
      ...pricing.plans[planId],
      featured: planCatalog[planId].featured,
      features: getPlanFeatureIds(planId).map((id) => ({ id, label: featureLabels[id] })),
    };
    if (planId === "free") {
      return {
        ...common,
        price: formatEuro(planCatalog.free.priceCents, locale),
        period: t("billing.freePeriod"),
        annual: t("billing.noSubscription"),
      };
    }
    return {
      ...common,
      price: formatEuro(planCatalog.premium.monthlyPriceCents, locale),
      period: t("billing.monthlyPeriod"),
      annual: t("billing.annualPeriod", {
        price: formatEuro(planCatalog.premium.annualPriceCents, locale),
      }),
      trial: t("billing.trial", { days: planCatalog.premium.trialDays }),
    };
  });
}
