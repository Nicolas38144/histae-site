import type { WebOffer } from "./billing/models";

// Savings are meaningful only when both offers use the same currency and annual is cheaper.
export function annualComparison(offers: WebOffer[]) {
  const monthly = offers.find(offer => offer.billing_period === "monthly");
  const annual = offers.find(offer => offer.billing_period === "annual");
  if (!monthly || !annual || monthly.currency !== annual.currency) return null;
  const saving = monthly.price_cents * 12 - annual.price_cents;
  return {
    monthlyEquivalent: annual.price_cents / 12,
    saving: Math.max(0, saving),
    percent: Math.max(0, Math.round(saving / (monthly.price_cents * 12) * 100)),
  };
}

export function formatOfferPrice(cents: number, currency: string, locale: string) {
  return new Intl.NumberFormat(locale, { style: "currency", currency, maximumFractionDigits: 2 }).format(cents / 100);
}
