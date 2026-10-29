import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../config/site.json", import.meta.url), "utf8"));
const locales: string[] = Object.keys(config.locales);
const supportEmail: string = config.supportEmail;
const childSafetyHref = (locale: string) => `/${locale}/${config.policyPages.childSafety.path}/`;
type StandardsCopy = { title: string; footer: string; sections: Record<string, { title: string }> };
const copyFor = (locale: string): StandardsCopy => JSON.parse(
  readFileSync(new URL(`../messages/${locale}/child-safety.json`, import.meta.url), "utf8"),
).childSafety;

for (const locale of locales) {
  test(`${locale}: child-safety standards are public HTML without JavaScript or authentication`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    try {
      const page = await context.newPage();
      const apiRequests: string[] = [];
      page.on("request", request => { if (new URL(request.url()).pathname.startsWith("/api/")) apiRequests.push(request.url()); });
      const response = await page.goto(childSafetyHref(locale));
      expect(response?.status()).toBe(200);
      const copy = copyFor(locale);
      await expect(page.getByRole("heading", { level: 1, name: copy.title })).toBeVisible();
      const policy = page.locator("article");
      await expect(policy).toContainText("Histae");
      await expect(policy).toContainText("18");
      await expect(policy).toContainText("CSAE");
      await expect(policy).toContainText("CSAM");
      for (const section of Object.values(copy.sections)) {
        await expect(policy.getByRole("heading", { level: 2, name: section.title })).toBeVisible();
      }
      await expect(policy.getByRole("link", { name: supportEmail, exact: true })).toHaveAttribute("href", /^mailto:support\.histae@gmail\.com\?subject=/);
      await expect(page.locator("footer").getByRole("link", { name: copy.footer, exact: true })).toHaveAttribute("href", childSafetyHref(locale));
      expect(apiRequests).toEqual([]);
      await page.setViewportSize({ width: 375, height: 812 });
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
      if (locale === "fr") await page.screenshot({ path: "test-results/child-safety-mobile.png", fullPage: true });
      await page.setViewportSize({ width: 1440, height: 1000 });
      if (locale === "fr") await page.screenshot({ path: "test-results/child-safety-desktop.png", fullPage: true });
    } finally {
      await context.close();
    }
  });
}
