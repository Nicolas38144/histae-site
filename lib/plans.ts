import siteConfig from "../config/site.json";
import type { Locale } from "./site-config";

export const planCatalog = siteConfig.plans;
export type PlanId = keyof typeof planCatalog;

export const planFeatureIds = [
  "messaging",
  "photoReveal",
  "limitedContinuations",
  "unlimitedContinuations",
  "rewardedCredits",
  "weeklyLimit",
  "noAds",
] as const;

export type PlanFeatureId = (typeof planFeatureIds)[number];

function isPlanFeatureId(value: string): value is PlanFeatureId {
  return planFeatureIds.some((featureId) => featureId === value);
}

export function getPlanFeatureIds(planId: PlanId): PlanFeatureId[] {
  const features = planCatalog[planId].features;
  return features.map((feature) => {
    if (!isPlanFeatureId(feature)) throw new Error(`Unknown feature in ${planId} plan: ${feature}`);
    return feature;
  });
}

export function formatEuro(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function getCommercialValues() {
  return {
    freeContinuations: planCatalog.free.successfulContinuationsPerWeek,
    freeCredits: planCatalog.free.weeklyIncludedCredits,
    advertisingStock: planCatalog.free.advertisingCreditStockLimit,
    weeklyMaximum: planCatalog.free.successfulContinuationsPerWeek,
  };
}
