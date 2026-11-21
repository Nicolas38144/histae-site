import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import type { Locale } from "../lib/site-config";

const config: typeof import("../config/site.json") = JSON.parse(
  readFileSync(new URL("../config/site.json", import.meta.url), "utf8"),
);
const locales = Object.keys(config.locales) as Locale[];
const { supportEmail } = config;

test.use({ javaScriptEnabled: false });

const safetyDocuments = ["terms-of-use", "acceptable-use-policy", "law-enforcement-policy"] as const;
const documents = [...safetyDocuments, "privacy-policy", "sensitive-data-consent", "location-consent"] as const;
const pending = {
  fr: "En cours de validation",
  en: "Validation in progress",
  es: "En proceso de validación",
  it: "In corso di validazione",
};

for (const locale of locales) {
  test(`${locale}: legal content and support links are available without signing in or running JavaScript`, async ({ page }) => {
    for (const document of documents) {
      const href = `/${locale}/legal/${document}/`;
      const response = await page.goto(href);
      expect(response?.status()).toBe(200);
      const article = page.locator("main .legal-document");
      await expect(article).toContainText("Histae");
      await expect(article).toContainText(pending[locale]);
      await expect(article.locator(`a[href="mailto:${supportEmail}"]`).first()).toBeVisible();

      if (document === "terms-of-use") {
        for (const policy of safetyDocuments.slice(1)) {
          await expect(article.locator(`a[href="/${locale}/legal/${policy}/"]`).first()).toBeVisible();
        }
        await expect(article).toContainText("SMS");
        await expect(article).toContainText("18");
        await expect(article).toContainText("48");
        await expect(article).toContainText("60");
      } else if (document === "acceptable-use-policy" || document === "law-enforcement-policy") {
        await expect(article.locator(`a[href="/${locale}/child-safety/"]`)).toBeVisible();
        await expect(article.locator(`a[href="/${locale}/legal/privacy-policy/"]`)).toBeVisible();
      } else if (document === "privacy-policy") {
        await expect(article.locator(`a[href="/${locale}/legal/law-enforcement-policy/"]`)).toBeVisible();
      }
      if (document === "privacy-policy" || document === "location-consent") {
        await expect(article).toContainText("5 km");
        await expect(article).toContainText("24");
      }
    }
  });
}
