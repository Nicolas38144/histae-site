import { test, expect } from "@playwright/test";
import { requestCheckout } from "../lib/billing/checkout";
import { checkoutKey } from "../lib/billing/checkout-storage";

const user = "11111111-1111-4111-8111-111111111111";
const free = { user_id: user, onboarding_complete: true, subscription: { plan: "free", provider: null, access_granted: false, customer_portal_available: false, management_url: null } };
const session = { url: "https://checkout.stripe.com/c/pay/cs_test_synthetic#fidSynthetic" };
let previousStorage: PropertyDescriptor | undefined;
let previousFetch: typeof fetch;

test.beforeEach(() => {
  previousStorage = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  previousFetch = globalThis.fetch;
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "sessionStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  });
});
test.afterEach(() => {
  globalThis.fetch = previousFetch;
  if (previousStorage) Object.defineProperty(globalThis, "sessionStorage", previousStorage);
  else Reflect.deleteProperty(globalThis, "sessionStorage");
});

test("returning to a replaced formula renews only its consumed key", async () => {
  const annual = checkoutKey(user, "annual");
  const original = checkoutKey(user, "monthly");
  const keys: string[] = [];
  globalThis.fetch = async (input, init) => {
    if (String(input).endsWith("/session")) return Response.json(free);
    keys.push(new Headers(init?.headers).get("Idempotency-Key") ?? "");
    expect(JSON.parse(String(init?.body))).toEqual({ billing_period: "monthly" });
    return keys.length === 1
      ? Response.json({ error: { code: "idempotency_key_consumed" } }, { status: 409 })
      : Response.json(session, { status: 201 });
  };
  expect(await requestCheckout(user, "monthly", "fr")).toEqual(session);
  expect(keys[0]).toBe(original);
  expect(keys[1]).not.toBe(original);
  expect(checkoutKey(user, "monthly")).toBe(keys[1]);
  expect(checkoutKey(user, "annual")).toBe(annual);
});

test("an uncertain network failure keeps the key for the next manual retry", async () => {
  const original = checkoutKey(user, "monthly");
  let calls = 0;
  globalThis.fetch = async () => { calls++; throw new TypeError("synthetic network failure"); };
  await expect(requestCheckout(user, "monthly", "fr")).rejects.toMatchObject({ code: "network_error" });
  expect(calls).toBe(1);
  expect(checkoutKey(user, "monthly")).toBe(original);
});

test("an active purchase conflict never renews the key or retries automatically", async () => {
  const original = checkoutKey(user, "monthly");
  let calls = 0;
  globalThis.fetch = async () => {
    calls++;
    return Response.json({ error: { code: "checkout_already_in_progress" } }, { status: 409 });
  };
  await expect(requestCheckout(user, "monthly", "fr")).rejects.toMatchObject({ code: "checkout_already_in_progress" });
  expect(calls).toBe(1);
  expect(checkoutKey(user, "monthly")).toBe(original);
});

test("consumed-key renewal is bounded to one retry", async () => {
  let calls = 0;
  globalThis.fetch = async (input) => {
    if (String(input).endsWith("/session")) return Response.json(free);
    calls++;
    return Response.json({ error: { code: "idempotency_key_consumed" } }, { status: 409 });
  };
  await expect(requestCheckout(user, "monthly", "fr")).rejects.toMatchObject({ code: "idempotency_key_consumed" });
  expect(calls).toBe(2);
});

test("confirmed Premium rights stop renewal of a consumed checkout", async () => {
  const original = checkoutKey(user, "monthly");
  let purchases = 0;
  globalThis.fetch = async (input) => {
    if (String(input).endsWith("/session")) return Response.json({ ...free, subscription: { ...free.subscription, plan: "premium", provider: "stripe", access_granted: true } });
    purchases++;
    return Response.json({ error: { code: "idempotency_key_consumed" } }, { status: 409 });
  };
  await expect(requestCheckout(user, "monthly", "fr")).rejects.toMatchObject({ code: "subscription_already_active" });
  expect(purchases).toBe(1);
  expect(checkoutKey(user, "monthly")).toBe(original);
});
