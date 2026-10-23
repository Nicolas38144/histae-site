import type { WebOffer } from "./models";
import { parseOffers } from "./validation";

const pending = new Map<string, Promise<WebOffer[]>>();

export function publicOffers(locale: string): Promise<WebOffer[]> {
  const existing = pending.get(locale);
  if (existing) return existing;
  // Share only concurrent reads, including React's development remount. Do not cache prices.
  const request = fetch("/api/web/billing/plans", {
    credentials: "omit", cache: "no-store", redirect: "error",
    headers: { "Accept-Language": locale }, signal: AbortSignal.timeout(8000),
  }).then(async response => {
    if (!response.ok) throw new Error("Catalogue unavailable");
    const offers = parseOffers(await response.json());
    if (new Set(offers.map(offer => offer.billing_period)).size !== offers.length) throw new Error("Duplicate offers");
    return offers;
  }).finally(() => pending.delete(locale));
  pending.set(locale, request);
  return request;
}
