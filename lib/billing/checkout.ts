import type { Locale } from "../site-config";
import type { BillingPeriod } from "./models";
import { BillingFailure } from "./failure";
import { billingRequest } from "./client";
import { parseSession } from "./validation";
import { checkoutKey, clearCheckoutKey } from "./checkout-storage";

export async function requestCheckout(userId: string, period: BillingPeriod, locale: Locale): Promise<unknown> {
  // Returning to a formula whose session was replaced consumes its old key.
  // Renew it only after the API confirms that it cannot create another charge.
  for (let attempt = 0; attempt < 2; attempt++) {
    const key = checkoutKey(userId, period);
    try {
      return await billingRequest("checkout", locale, {
        method: "POST",
        headers: { "Idempotency-Key": key },
        body: JSON.stringify({ billing_period: period }),
      });
    } catch (error) {
      if (!(error instanceof BillingFailure) || error.code !== "idempotency_key_consumed") throw error;
      const current = parseSession(await billingRequest("session", locale));
      if (current.subscription.access_granted) throw new BillingFailure("subscription_already_active", 409);
      clearCheckoutKey(period);
      if (attempt === 1) throw error;
    }
  }
  throw new BillingFailure("request_failed");
}
