import { test, expect } from "@playwright/test";
import { annualComparison } from "../lib/pricing-offers";
import type { WebOffer } from "../lib/billing/models";

const offers = [
  { plan_code: "premium", billing_period: "monthly", price_cents: 750, currency: "EUR", display_name: "Premium" },
  { plan_code: "premium", billing_period: "annual", price_cents: 7200, currency: "EUR", display_name: "Premium" },
];

test("annual comparisons never promise a saving for a more expensive or different-currency offer", () => {
  expect(annualComparison(offers as WebOffer[])).toEqual({ monthlyEquivalent: 600, saving: 1800, percent: 20 });
  expect(annualComparison([offers[0], { ...offers[1], currency: "USD" }] as WebOffer[])).toBeNull();
  expect(annualComparison([offers[0]] as WebOffer[])).toBeNull();
  expect(annualComparison([offers[0], { ...offers[1], price_cents: 10000 }] as WebOffer[])?.saving).toBe(0);
});

for (const locale of ["fr", "en", "es", "it"]) {
  test(`${locale}: public prices use current offers, without a session or payment request`, async ({ page }) => {
    const requests: string[] = [];
    await page.route("**/api/web/billing/**", route => {
      requests.push(route.request().url().split("/api/web/billing/")[1]);
      return route.fulfill({ json: { offers } });
    });
    await page.goto(`/${locale}/pricing/`);
    const cards = page.locator(".pricing-card");
    await expect(cards.nth(1).locator(".plan-price strong")).toContainText(/7[,.]50/);
    await expect(cards.nth(2).locator(".plan-price strong")).toContainText(/72/);
    await expect(cards.nth(2).locator(".plan-saving")).toContainText(/18/);
    expect(requests).toEqual(["plans"]);
    await expect(cards.nth(2).getByRole("link")).toHaveAttribute("href", `/${locale}/billing/subscribe/?period=annual`);
    await page.setViewportSize({ width: 375, height: 812 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("an unavailable or ambiguous catalogue never falls back to stale Premium prices", async ({ page }) => {
  for (const response of [{ status: 503, body: "{}" }, { json: { offers: [offers[0], offers[0]] } }]) {
    await page.route("**/api/web/billing/plans", route => route.fulfill(response));
    await page.goto("/fr/pricing/");
    await expect(page.locator(".pricing-source")).toContainText("ne sont pas disponibles");
    await expect(page.locator(".pricing-card").nth(1).locator(".plan-price")).toHaveText("Voir le prix");
    await expect(page.locator(".plan-saving")).toHaveCount(0);
    await expect(page.locator(".pricing-card").nth(2).getByRole("link")).toBeVisible();
    await page.unroute("**/api/web/billing/plans");
  }
});

test("mobile reading, screenshots, skip link and language dialog work with a keyboard", async ({ page }) => {
  await page.route("**/api/web/billing/plans", route => route.fulfill({ json: { offers } }));
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fr/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Aller au contenu" })).toBeFocused();
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("main img")).toHaveCount(3);
  const images = page.locator("main img");
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("button", { name: "Langue", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Langue", exact: true })).toBeFocused();
  await page.screenshot({ path: "test-results/home-mobile.png", fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: "test-results/home-desktop.png", fullPage: true });
});
