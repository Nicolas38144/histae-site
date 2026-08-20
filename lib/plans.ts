import siteConfig from "../config/site.json";
import type { Locale } from "./site-config";

export const planCatalog = siteConfig.plans;
export type PlanId = keyof typeof planCatalog;

export const planIds: PlanId[] = ["free", "premium"];

export const planFeatureIds = [
  "messaging",
  "photoReveal",
  "limitedContinuations",
  "unlimitedContinuations",
] as const;

export type PlanFeatureId = (typeof planFeatureIds)[number];

function isPlanFeatureId(value: string): value is PlanFeatureId {
  return planFeatureIds.some((featureId) => featureId === value);
}

export function getPlanFeatureIds(planId: PlanId): PlanFeatureId[] {
  const features = planCatalog[planId].features;
  if (!features.every(isPlanFeatureId)) throw new Error(`Unknown feature in ${planId} plan`);
  return features.filter(isPlanFeatureId);
}

export function formatEuro(cents: number, locale: Locale): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function priceAmount(cents: number): string {
  return String(cents / 100);
}

export function getCommercialValues(locale: Locale) {
  return {
    freeContinuations: planCatalog.free.successfulContinuationsPerWeek,
    monthlyPrice: formatEuro(planCatalog.premium.monthlyPriceCents, locale),
    annualPrice: formatEuro(planCatalog.premium.annualPriceCents, locale),
    trialDays: planCatalog.premium.trialDays,
  };
}
