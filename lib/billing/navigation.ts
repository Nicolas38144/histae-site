import type { Locale } from "../site-config";
import type { BillingPeriod } from "./models";

export function subscriptionHref(locale: Locale, period?: BillingPeriod): string {
  const href = `/${locale}/billing/subscribe/`;
  return period ? `${href}?${new URLSearchParams({ period })}` : href;
}

export function requestedBillingPeriod(search: string): BillingPeriod | undefined {
  const period = new URLSearchParams(search).get("period");
  return period === "monthly" || period === "annual" ? period : undefined;
}
