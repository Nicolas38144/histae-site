import { test, expect } from "@playwright/test";

test("app availability shows invitation-only Google Play access on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/fr/download/");
  const android = page.locator(".availability-android");
  await expect(android).toContainText(/réservé aux personnes invitées/i);
  await expect(android.getByRole("link")).toHaveAttribute("href",
    "https://play.google.com/store/apps/details?id=com.histae.histae_app");
  await expect(page.locator('main a[href*="apps.apple.com"]')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
});
