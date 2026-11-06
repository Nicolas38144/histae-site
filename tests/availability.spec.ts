import { test, expect } from "@playwright/test";

const invitedAccess = {
  fr: /réservé aux personnes invitées/i,
  en: /limited to invited testers/i,
  es: /reservado a las personas invitadas/i,
  it: /riservato alle persone invitate/i,
};

for (const [locale, restriction] of Object.entries(invitedAccess)) {
  test(`${locale}: Google Play listing does not promise public or iOS test access`, async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`/${locale}/download/`);
    const android = page.locator(".availability-android");
    await expect(android).toContainText(restriction);
    await expect(android.getByRole("link")).toHaveAttribute("href",
      "https://play.google.com/store/apps/details?id=com.histae.histae_app");
    await expect(page.locator('main a[href*="apps.apple.com"]')).toHaveCount(0);
    await expect(page.locator(".availability-feedback")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
  });
}
