export type BillingPeriod = "monthly" | "annual";
type WebSubscription = {
  plan: "free" | "premium";
  provider: "stripe" | "app_store" | "google_play" | null;
  access_granted: boolean;
  customer_portal_available: boolean;
  management_url: string | null;
};
export type WebSession = { user_id: string; onboarding_complete: boolean; subscription: WebSubscription };
export type WebOffer = { billing_period: BillingPeriod; price_cents: number; currency: string; display_name: string };
