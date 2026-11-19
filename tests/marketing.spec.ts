import { test, expect } from "@playwright/test";

for (const [locale, account, monthlyPrice, annualPrice, monthlyPeriod, annualPeriod] of [
  ["fr", "Mon compte", "5 €", "48 €", "par mois", "par an"],
  ["en", "My account", "€5", "€48", "per month", "per year"],
  ["es", "Mi cuenta", "5 €", "48 €", "al mes", "al año"],
  ["it", "Il mio account", "5 €", "48 €", "al mese", "all’anno"],
]) {
  test(`${locale}: public plans guide visitors to the app without contacting an API`, async ({ page }) => {
    const requests: string[] = [];
    await page.route("**/api/**", route => {
      requests.push(route.request().url());
      return route.abort();
    });
    await page.goto(`/${locale}/pricing/`);
    const cards = page.locator(".pricing-card");
    await expect(cards).toHaveCount(3);
    await expect(cards.nth(1).locator(".plan-price strong")).toHaveText(monthlyPrice);
    await expect(cards.nth(1).locator(".plan-price span")).toHaveText(monthlyPeriod);
    await expect(cards.nth(2).locator(".plan-price strong")).toHaveText(annualPrice);
    await expect(cards.nth(2).locator(".plan-price span")).toHaveText(annualPeriod);
    for (const card of await cards.all()) {
      await expect(card.getByRole("link")).toHaveAttribute("href", `/${locale}/download/`);
    }
    await expect(page.locator("#site-navigation").getByRole("link", { name: account, exact: true }))
      .toHaveAttribute("href", `/${locale}/account/data/`);
    await expect(page.locator('a[href*="/billing/"]')).toHaveCount(0);
    expect(requests).toEqual([]);
    await page.setViewportSize({ width: 375, height: 812 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}

test("mobile reading, screenshots, skip link and language dialog work with a keyboard", async ({ page }) => {
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
});
