import type { getTranslations } from "next-intl/server";
import type { AppMessages } from "../messages";
import { formatEuro, getCommercialValues, getPlanFeatureIds, planCatalog, type PlanFeatureId, type PlanId } from "./plans";
import type { Locale } from "./site-config";

type PricingTranslations = Awaited<ReturnType<typeof getTranslations<"pricing">>>;

export type PricingCardModel = {
  id: "free" | "monthly" | "annual";
  name: string;
  description: string;
  featured: boolean;
  price: string;
  period: string;
  billing: string;
  equivalent?: string;
  saving?: string;
  badge?: string;
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

  const features = (planId: PlanId) => getPlanFeatureIds(planId)
    .map((id) => ({ id, label: featureLabels[id] }));
  const values = getCommercialValues(locale);

  return [
    {
      id: "free",
      ...pricing.plans.free,
      featured: false,
      price: formatEuro(planCatalog.free.priceCents, locale),
      period: t("billing.freePeriod"),
      billing: t("billing.noSubscription"),
      features: features("free"),
    },
    {
      id: "monthly",
      ...pricing.plans.monthly,
      featured: false,
      price: values.monthlyPrice,
      period: t("billing.monthlyPeriod"),
      billing: t("billing.monthlyBilling"),
      features: features("premium"),
    },
    {
      id: "annual",
      ...pricing.plans.annual,
      featured: planCatalog.premium.featured,
      price: values.annualPrice,
      period: t("billing.annualPeriod"),
      billing: t("billing.annualBilling"),
      equivalent: t("billing.monthlyEquivalent", { price: values.annualMonthlyPrice }),
      saving: t("billing.annualSaving", { amount: values.annualSaving }),
      badge: t("billing.annualBadge", { percent: values.annualSavingPercent }),
      features: features("premium"),
    },
  ];
}
