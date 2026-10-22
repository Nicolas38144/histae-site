import { test, expect } from "@playwright/test";
import { checkoutKey, clearCheckoutKey } from "../lib/billing/checkout-storage";
import { BillingFailure } from "../lib/billing/failure";

const user = "11111111-1111-4111-8111-111111111111";
const storageKey = "histae_web_checkout";
const oldKey = "22222222-2222-4222-8222-222222222222";

function withStorage(action: (values: Map<string, string>) => void): void {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  });
  try { action(values); }
  finally {
    if (previous) Object.defineProperty(globalThis, "sessionStorage", previous);
    else Reflect.deleteProperty(globalThis, "sessionStorage");
  }
}

test("checkout storage permits formula changes and preserves retry keys", () => {
  withStorage(() => {
    const monthly = checkoutKey(user, "monthly");
    const annual = checkoutKey(user, "annual");
    expect(annual).not.toBe(monthly);
    expect(checkoutKey(user, "monthly")).toBe(monthly);
    expect(checkoutKey(user, "annual")).toBe(annual);
  });
});

test("checkout storage migrates an earlier attempt without losing its retry key", () => {
  withStorage((values) => {
    values.set(storageKey, JSON.stringify({ userId: user, period: "annual", key: oldKey }));
    expect(checkoutKey(user, "monthly")).not.toBe(oldKey);
    expect(checkoutKey(user, "annual")).toBe(oldKey);
  });
});

test("checkout storage clears only a consumed formula and clears all on logout", () => {
  withStorage((values) => {
    const annual = checkoutKey(user, "annual");
    const monthly = checkoutKey(user, "monthly");
    clearCheckoutKey("monthly");
    expect(checkoutKey(user, "annual")).toBe(annual);
    expect(checkoutKey(user, "monthly")).not.toBe(monthly);
    clearCheckoutKey();
    expect(values.has(storageKey)).toBe(false);
  });
});

test("checkout storage stops before purchase when stored state is unreadable", () => {
  withStorage((values) => {
    values.set(storageKey, "invalid JSON");
    expect(() => checkoutKey(user, "monthly")).toThrow(BillingFailure);
    try { checkoutKey(user, "monthly"); }
    catch (error) { expect(error).toMatchObject({ code: "storage_unavailable" }); }
    expect(values.get(storageKey)).toBe("invalid JSON");
  });
});
