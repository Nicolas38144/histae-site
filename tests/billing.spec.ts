import { test, expect } from "@playwright/test";
import { parseSession, parseOffers, paymentUrl, storeManagementUrl, BillingFailure } from "../lib/web-billing";
import { requestedBillingPeriod, subscriptionHref } from "../lib/billing/navigation";
const user = "11111111-1111-4111-8111-111111111111";
const free = { user_id: user, onboarding_complete: true, subscription: { plan: "free", provider: null, access_granted: false, customer_portal_available: false, management_url: null } };
const plans = { offers: [{ plan_code: "premium", billing_period: "monthly", price_cents: 500, currency: "EUR", display_name: "Premium" }, { plan_code: "premium", billing_period: "annual", price_cents: 4800, currency: "EUR", display_name: "Premium" }] };
test("rejects untrusted payment URLs and inconsistent entitlement DTOs", () => {
  expect(requestedBillingPeriod("?period=annual")).toBe("annual");
  expect(requestedBillingPeriod("?period=monthly")).toBe("monthly");
  expect(requestedBillingPeriod("?period=unexpected")).toBeUndefined();
  expect(requestedBillingPeriod("")).toBeUndefined();
  expect(subscriptionHref("fr", "annual")).toBe("/fr/billing/subscribe/?period=annual");
  expect(subscriptionHref("es")).toBe("/es/billing/subscribe/");
  for (const url of ["http://checkout.stripe.com/x", "https://checkout.stripe.com.evil.test/x", "https://user@checkout.stripe.com/x", "https://checkout.stripe.com:444/x"]) expect(() => paymentUrl({ url }, false)).toThrow();
  expect(paymentUrl({ url: "https://checkout.stripe.com/c/pay/synthetic" },false)).toContain("checkout.stripe.com");
  expect(() => parseSession({ ...free, subscription: { ...free.subscription, access_granted: true } })).toThrow();
  expect(storeManagementUrl("https://evil.test")).toBeNull();
  expect(() => parseSession({ ...free, subscription: { ...free.subscription, plan: { toString: {} } } })).toThrow(BillingFailure);
  expect(() => parseOffers({ offers: [{ ...plans.offers[0], billing_period: { toString: {} } }] })).toThrow(BillingFailure);
  expect(() => paymentUrl({ url: { toString: {} } }, false)).toThrow(BillingFailure);
});
test("preserves Stripe Checkout fragments while rejecting untrusted destinations", () => {
  const url = "https://checkout.stripe.com/c/pay/cs_test_synthetic#fidSynthetic%2Fvalue%3D";
  expect(paymentUrl({ session_id: "cs_test_synthetic", url, expires_at: "2030-01-01T00:00:00Z" }, false)).toBe(url);
  for (const invalid of [
    "https://checkout.stripe.com.evil.test/c/pay/synthetic#fidSynthetic",
    "https://checkout.stripe.com@evil.test/c/pay/synthetic#fidSynthetic",
    "http://checkout.stripe.com/c/pay/synthetic#fidSynthetic",
    "https://checkout.stripe.com:444/c/pay/synthetic#fidSynthetic",
    "https://billing.stripe.com/p/session/synthetic#fidSynthetic",
  ]) expect(() => paymentUrl({ url: invalid }, false)).toThrow(BillingFailure);
  expect(() => paymentUrl({ url }, true)).toThrow(BillingFailure);
  expect(paymentUrl({ url: "https://billing.stripe.com/p/session/synthetic" }, true)).toBe("https://billing.stripe.com/p/session/synthetic");
});

test("UUID and matching phone require OTP before Stripe; lost Checkout response reuses key", async ({ page }) => {
  let authenticated = false; const keys: string[] = []; const bodies: unknown[] = [];
  await page.route("**/api/web/billing/**", async (route) => {
    const path = new URL(route.request().url()).pathname.split("/api/web/billing/")[1];
    if (path === "plans") return route.fulfill({ json: plans });
    if (path === "session") return route.fulfill(authenticated ? { json: free } : { status: 401, json: { error: { code: "web_authentication_failed" } } });
    if (path === "otp/send") { expect(route.request().postDataJSON()).toEqual({ user_id: user, phone_number: "+33612345678" }); return route.fulfill({ status: 202, json: { challenge_id: user } }); }
    if (path === "otp/verify") { expect(route.request().postDataJSON().otp).toBe("123456"); authenticated = true; return route.fulfill({ status: 204 }); }
    if (path === "checkout") { expect(authenticated).toBeTruthy(); keys.push(route.request().headers()["idempotency-key"]); bodies.push(route.request().postDataJSON()); return route.abort("failed"); }
    throw new Error("Unexpected simulated API operation");
  });
  await page.goto("/fr/billing/subscribe/");
  await expect(page.getByRole("button", { name: "Recevoir un code" })).toBeEnabled();
  await expect(page.getByRole("button", { name: "Continuer vers le paiement" })).toHaveCount(0);
  await page.getByLabel("Identifiant du compte (UUID)").fill(user);
  await page.getByLabel("Numéro de téléphone").fill("+33612345678");
  await page.getByRole("button", { name: "Recevoir un code" }).click();
  await page.getByLabel("Code reçu par SMS").fill("123456");
  await page.getByRole("button", { name: "Confirmer le code" }).click();
  const pay = page.getByRole("button", { name: "Continuer vers le paiement" });
  await expect(pay).toBeEnabled();
  await pay.click(); await expect(page.locator('main p[role="alert"]')).toBeVisible();
  await pay.click(); await expect.poll(() => keys.length).toBe(2);
  expect(keys[0]).toMatch(/^[0-9a-f-]{36}$/); expect(keys[1]).toBe(keys[0]); expect(bodies).toEqual([{ billing_period: "monthly" }, { billing_period: "monthly" }]);
});
test("wrong OTP never reveals a payment form", async ({ page }) => {
  await page.route("**/api/web/billing/**", async (route) => {
    const path = route.request().url();
    if (path.endsWith("/plans")) return route.fulfill({ json: plans });
    if (path.endsWith("/otp/send")) return route.fulfill({ status: 202, json: { challenge_id: user } });
    return route.fulfill({ status: 401, json: { error: { code: "web_authentication_failed" } } });
  });
  await page.goto("/fr/billing/subscribe/");
  await page.getByLabel("Identifiant du compte (UUID)").fill(user); await page.getByLabel("Numéro de téléphone").fill("+33612345678");
  await page.getByRole("button", { name: "Recevoir un code" }).click(); await page.getByLabel("Code reçu par SMS").fill("000000");
  await page.getByRole("button", { name: "Confirmer le code" }).click();
  await expect(page.locator('main p[role="alert"]')).toBeVisible(); await expect(page.getByRole("button", { name: "Continuer vers le paiement" })).toHaveCount(0);
});
test("native subscribers get their store management link and no second Stripe purchase", async ({ page }) => {
  await page.route("**/api/web/billing/**", (route) => route.fulfill({ json: route.request().url().endsWith("/plans") ? plans : { ...free, subscription: { ...free.subscription, plan: "premium", provider: "app_store", access_granted: true, management_url: "https://apps.apple.com/account/subscriptions" } } }));
  await page.goto("/fr/billing/subscribe/");
  await expect(page.getByRole("link", { name: "Gérer mon abonnement" })).toHaveAttribute("href", "https://apps.apple.com/account/subscriptions");
  await expect(page.getByRole("button", { name: "Continuer vers le paiement" })).toHaveCount(0);
});

test("annual plan from pricing remains selected after authentication", async ({ page }) => {
  let authenticated = false;
  let selected: unknown;
  await page.route("**/api/web/billing/**", async (route) => {
    const path = new URL(route.request().url()).pathname.split("/api/web/billing/")[1];
    if (path === "plans") return route.fulfill({ json: plans });
    if (path === "session") return route.fulfill(authenticated ? { json: free } : { status: 401, json: { error: { code: "web_authentication_failed" } } });
    if (path === "otp/send") return route.fulfill({ status: 202, json: { challenge_id: user } });
    if (path === "otp/verify") { authenticated = true; return route.fulfill({ status: 204 }); }
    if (path === "checkout") { selected = route.request().postDataJSON(); return route.abort("failed"); }
    throw new Error("Unexpected simulated API operation");
  });
  await page.goto("/fr/pricing/");
  await page.getByRole("link", { name: "Choisir Premium Annuel", exact: true }).click();
  await expect(page).toHaveURL(/period=annual/);
  await page.getByLabel("Identifiant du compte (UUID)").fill(user);
  await page.getByLabel("Numéro de téléphone").fill("+33612345678");
  await page.getByRole("button", { name: "Recevoir un code" }).click();
  await page.getByLabel("Code reçu par SMS").fill("123456");
  await page.getByRole("button", { name: "Confirmer le code" }).click();
  await expect(page.getByRole("radio", { name: /Premium annuel/ })).toBeChecked();
  await page.getByRole("button", { name: "Continuer vers le paiement" }).click();
  await expect.poll(() => selected).toEqual({ billing_period: "annual" });
});
