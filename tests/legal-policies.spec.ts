import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { AppMessages } from "../messages";
import type { Locale } from "../lib/site-config";

const config: typeof import("../config/site.json") = JSON.parse(
  readFileSync(new URL("../config/site.json", import.meta.url), "utf8"),
);
const locales = Object.keys(config.locales) as Locale[];
const { publicUrl, supportEmail } = config;

test.use({ javaScriptEnabled: false });

const stripeDocuments = ["terms-of-use", "acceptable-use-policy", "law-enforcement-policy"] as const;
const documents = [...stripeDocuments, "privacy-policy", "sensitive-data-consent", "location-consent"] as const;
const pending = {
  fr: "En cours de validation",
  en: "Validation in progress",
  es: "En proceso de validación",
  it: "In corso di validazione",
};

for (const locale of locales) {
  test(`${locale}: legal documents are public, localized and disclose current API limits`, async ({ page }) => {
    const messages: Pick<AppMessages, "footer"> = JSON.parse(
      readFileSync(new URL(`../messages/${locale}/common.json`, import.meta.url), "utf8"),
    );

    for (const document of documents) {
      const href = `/${locale}/legal/${document}/`;
      const response = await page.goto(href);
      expect(response?.status()).toBe(200);
      const article = page.locator("main .legal-document");
      await expect(article).toHaveAttribute("lang", locale);
      await expect(article.getByRole("heading", { level: 1 })).toHaveCount(1);
      await expect(article).toContainText("Histae");
      await expect(article).toContainText(pending[locale]);
      await expect(article.locator(`a[href="mailto:${supportEmail}"]`).first()).toBeVisible();
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${publicUrl}${href}`);

      const navigation = page.getByRole("navigation", { name: messages.footer.legalTitle });
      for (const policy of documents) {
        await expect(navigation.getByRole("link", { name: messages.footer.legalLinks[policy], exact: true }))
          .toHaveAttribute("href", `/${locale}/legal/${policy}/`);
      }

      if (document === "terms-of-use") {
        for (const policy of stripeDocuments.slice(1)) {
          await expect(article.locator(`a[href="/${locale}/legal/${policy}/"]`).first()).toBeVisible();
        }
        await expect(article).toContainText("SMS");
        await expect(article).toContainText("18");
        await expect(article).toContainText("48");
        await expect(article).toContainText("60");
      } else if (document === "acceptable-use-policy" || document === "law-enforcement-policy") {
        await expect(article.locator(`a[href="/${locale}/child-safety/"]`)).toBeVisible();
        await expect(article.locator(`a[href="/${locale}/legal/privacy-policy/"]`)).toBeVisible();
      }
      if (document === "privacy-policy" || document === "location-consent") {
        await expect(article).toContainText("5 km");
        await expect(article).toContainText("24");
      }
    }

    await page.goto(`/${locale}/legal/privacy-policy/`);
    await expect(page.locator(`main a[href="/${locale}/legal/law-enforcement-policy/"]`)).toBeVisible();
  });
}
