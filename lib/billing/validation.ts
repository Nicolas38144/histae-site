import type { WebSession, WebOffer } from "./models";
import { BillingFailure, object } from "./failure";
export function parseSession(value: unknown): WebSession {
  const session = object(value), subscription = object(session.subscription);
  if (typeof session.user_id !== "string" || typeof session.onboarding_complete !== "boolean"
    || typeof subscription.plan !== "string" || !["free", "premium"].includes(subscription.plan)
    || ![null, "stripe", "app_store", "google_play"].includes(subscription.provider as string | null)
    || typeof subscription.access_granted !== "boolean" || typeof subscription.customer_portal_available !== "boolean"
    || subscription.access_granted !== (subscription.plan === "premium")) throw new BillingFailure("invalid_response");
  if (subscription.management_url !== null && typeof subscription.management_url !== "string") throw new BillingFailure("invalid_response");
  return value as WebSession;
}
export function parseOffers(value: unknown): WebOffer[] {
  const catalog = object(value);
  if (!Array.isArray(catalog.offers)) throw new BillingFailure("invalid_response");
  return catalog.offers.filter((value) => object(value).plan_code === "premium").map((value) => {
    const row = object(value);
    if (typeof row.billing_period !== "string" || !["monthly", "annual"].includes(row.billing_period) || !Number.isSafeInteger(row.price_cents)
      || Number(row.price_cents) <= 0 || typeof row.currency !== "string" || !/^[A-Z]{3}$/.test(row.currency) || typeof row.display_name !== "string") throw new BillingFailure("invalid_response");
    return row as WebOffer;
  });
}
export function paymentUrl(value: unknown, portal: boolean): string {
  const raw = object(value).url;
  if (typeof raw !== "string") throw new BillingFailure("invalid_response");
  let url: URL;
  try { url = new URL(raw); } catch { throw new BillingFailure("invalid_response"); }
  if (url.protocol !== "https:" || url.username || url.password || url.port || url.hash
    || url.hostname !== (portal ? "billing.stripe.com" : "checkout.stripe.com")) throw new BillingFailure("invalid_response");
  return url.href;
}
export function storeManagementUrl(value: string | null): string | null {
  return ["https://apps.apple.com/account/subscriptions", "https://play.google.com/store/account/subscriptions"].includes(value ?? "") ? value : null;
}
