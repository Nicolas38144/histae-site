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
  await page.keyboard.press("Enter");
  await expect(page.getByRole("main")).toBeFocused();
  expect(await page.evaluate(() => {
    const header = document.querySelector(".site-header")!.getBoundingClientRect();
    const main = document.querySelector("main")!.getBoundingClientRect();
    return main.top >= header.bottom;
  })).toBeTruthy();
  await page.keyboard.press("Tab");
  await expect(page.locator(".hero-actions a").first()).toBeFocused();
  await expect(page.locator("main h1")).toHaveCount(1);
  await expect(page.locator("main img")).toHaveCount(3);
  const images = page.locator("main img");
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBeTruthy();
    await expect.poll(() => img.evaluate((element: HTMLImageElement) => element.currentSrc)).toMatch(/-320\.webp\?/);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  await page.getByRole("button", { name: "Langue", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Langue", exact: true })).toBeFocused();
});

test.describe("mobile navigation without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: { width: 375, height: 812 } });

  test("the menu opens with the keyboard, closes with Escape and follows links", async ({ page }) => {
    await page.goto("/fr/");
    const navigation = page.getByRole("navigation", { name: "Navigation principale" });
    const trigger = navigation.getByRole("button", { name: "Menu", exact: true });
    const home = navigation.getByRole("link", { name: "Accueil", exact: true });
    const security = navigation.getByRole("link", { name: "Sécurité", exact: true });

    await trigger.focus();
    await page.keyboard.press("Enter");
    await expect(home).toHaveAttribute("aria-current", "page");
    await page.keyboard.press("Tab");
    await expect(home).toBeFocused();
    await page.keyboard.press("Escape");
    await expect(home).toBeHidden();
    await expect(trigger).toBeFocused();

    await page.keyboard.press("Enter");
    await security.click();
    await expect(page).toHaveURL(/\/fr\/security\/$/);
  });
});
