import type { BillingPeriod } from "./models";
import { BillingFailure, object } from "./failure";

const storageKey = "histae_web_checkout";
const periods: BillingPeriod[] = ["monthly", "annual"];
type CheckoutKeys = Partial<Record<BillingPeriod, string>>;

function storedKeys(userId: string): CheckoutKeys {
  const existing = sessionStorage.getItem(storageKey);
  if (!existing) return {};
  const record = object(JSON.parse(existing));
  if (record.userId !== userId) return {};

  // Preserve attempts from the previous single-period storage format.
  if (!("keys" in record)) {
    if ((record.period !== "monthly" && record.period !== "annual") || typeof record.key !== "string") throw new Error();
    return { [record.period]: record.key };
  }

  const stored = object(record.keys);
  const keys: CheckoutKeys = {};
  for (const period of periods) {
    const key = stored[period];
    if (key !== undefined && typeof key !== "string") throw new Error();
    if (typeof key === "string") keys[period] = key;
  }
  return keys;
}

function saveKeys(userId: string, keys: CheckoutKeys): void {
  const serialized = JSON.stringify({ userId, keys });
  sessionStorage.setItem(storageKey, serialized);
  if (sessionStorage.getItem(storageKey) !== serialized) throw new Error();
}

export function checkoutKey(userId: string, period: BillingPeriod): string {
  try {
    const keys = storedKeys(userId);
    const key = keys[period] ?? crypto.randomUUID();
    keys[period] = key;
    // A formula change must reach the API, which guards against concurrent
    // purchases. Keep both keys so a lost response can still be retried safely.
    saveKeys(userId, keys);
    return key;
  } catch {
    throw new BillingFailure("storage_unavailable");
  }
}

export function clearCheckoutKey(period?: BillingPeriod): void {
  try {
    if (!period) {
      sessionStorage.removeItem(storageKey);
      return;
    }
    const existing = sessionStorage.getItem(storageKey);
    if (!existing) return;
    const record = object(JSON.parse(existing));
    if (typeof record.userId !== "string") throw new Error();
    const keys = storedKeys(record.userId);
    delete keys[period];
    saveKeys(record.userId, keys);
  } catch {
    throw new BillingFailure("storage_unavailable");
  }
}
