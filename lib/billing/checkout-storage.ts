import type { BillingPeriod } from "./models";
import { BillingFailure, object } from "./failure";
export function checkoutKey(userId: string, period: BillingPeriod): string {
  const storageKey = "histae_web_checkout";
  try {
    const existing = sessionStorage.getItem(storageKey);
    if (existing) {
      const record = object(JSON.parse(existing));
      if (record.userId === userId) {
        if (record.period !== period || typeof record.key !== "string") throw new BillingFailure("checkout_already_in_progress");
        return record.key;
      }
    }
    const key = crypto.randomUUID();
    const serialized = JSON.stringify({ userId, period, key });
    sessionStorage.setItem(storageKey, serialized);
    if (sessionStorage.getItem(storageKey) !== serialized) throw new Error();
    return key;
  } catch (error) {
    if (error instanceof BillingFailure) throw error;
    throw new BillingFailure("storage_unavailable");
  }
}

export function clearCheckoutKey(): void {
  try { sessionStorage.removeItem("histae_web_checkout"); }
  catch { throw new BillingFailure("storage_unavailable"); }
}
