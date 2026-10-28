import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

const offers = [{ plan_code: "premium", billing_period: "monthly", price_cents: 500, currency: "EUR", display_name: "Premium" }];
type AuditWindow = Window & { blocked: string[]; injected?: boolean };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as AuditWindow).blocked = [];
    document.addEventListener("securitypolicyviolation", event => (window as unknown as AuditWindow).blocked.push(event.violatedDirective));
  });
  await page.route("**/api/web/billing/**", route => route.fulfill(route.request().url().endsWith("/plans")
    ? { json: { offers } } : { status: 401, json: { error: { code: "web_authentication_failed" } } }));
  await page.route("**/api/web/account/**", route => route.fulfill({ status: 401, json: { error: { code: "web_authentication_failed" } } }));
});

test("every exported page has exact inline-script hashes and a bounded header", async () => {
  const { policies } = JSON.parse(await readFile(".generated/security-headers.json", "utf8"));
  for (const [route, value] of Object.entries(policies)) {
    if (!route.endsWith(".html")) continue;
    const policy = String(value);
    const scripts = policy.split(";").find(directive => directive.trim().startsWith("script-src "))!;
    expect(scripts).not.toContain("unsafe-inline");
    expect(scripts).not.toContain("unsafe-eval");
    expect(policy).toContain("script-src-attr 'none'");
    expect(Buffer.byteLength(policy)).toBeLessThanOrEqual(7500);
    const html = await readFile(`out${route}`, "utf8");
    for (const [, attributes, body] of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (/\bsrc\s*=/.test(attributes) || !body) continue;
      expect(scripts).toContain(`'sha256-${createHash("sha256").update(body.replace(/\r\n?/g, "\n")).digest("base64")}'`);
    }
  }
});

for (const locale of ["fr", "en", "es", "it"]) {
  test(`${locale}: valid hydration and catalogue requests work under the production CSP`, async ({ page }) => {
    for (const suffix of ["", "pricing/", "billing/subscribe/", "account/data/"]) {
      const response = await page.goto(`/${locale}/${suffix}`);
      expect(response?.status()).toBe(200);
      expect(response?.headers()["content-security-policy"]).toContain("sha256-");
      await expect(page.locator("main h1")).toHaveCount(1);
      if (suffix === "pricing/") await expect(page.locator(".pricing-card").nth(1).locator(".plan-price")).toContainText(/5[,.]00/);
      if (suffix === "billing/subscribe/") await expect(page.locator("main form button").first()).toBeEnabled();
      if (suffix === "account/data/") await expect(page.locator("#data-login form button").first()).toBeEnabled();
      await page.locator(".language-trigger").click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await page.keyboard.press("Escape");
      expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
    }
  });
}

test("injected inline scripts and event handlers are blocked", async ({ page }) => {
  await page.goto("/fr/");
  await page.locator(".language-trigger").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    const script = document.createElement("script");
    script.textContent = "window.injected = true";
    document.body.append(script);
    const button = document.createElement("button");
    button.setAttribute("onclick", "window.injected = true");
    document.body.append(button);
    button.click();
  });
  await expect.poll(() => page.evaluate(() => (window as unknown as AuditWindow).blocked.length)).toBeGreaterThanOrEqual(2);
  expect(await page.evaluate(() => (window as unknown as AuditWindow).injected)).toBeUndefined();
});

test("Stripe return parameters cannot insert HTML or grant a subscription", async ({ page }) => {
  const requests: string[] = [];
  await page.route("**/api/web/billing/**", route => { requests.push(route.request().url()); return route.abort(); });
  await page.goto('/fr/billing/success/?session_id=%3Cscript%3Ewindow.injected%3Dtrue%3C%2Fscript%3E');
  await expect(page.locator("main")).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).injected)).toBeUndefined();
  expect(requests).toEqual([]);
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});

test("public navigation to billing remains usable with an existing document policy", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Tarifs", exact: true }).click();
  await expect(page.locator(".pricing-card").nth(1).locator(".plan-price")).toContainText(/5[,.]00/);
  await page.getByRole("link", { name: "Choisir Premium Mensuel", exact: true }).click();
  await expect(page.getByRole("button", { name: "Recevoir un code" })).toBeEnabled();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});

test("the footer opens data management without breaking the document security policy", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Gérer mes données", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gérer mes données Histae");
  await expect(page.getByRole("button", { name: "Recevoir un code", exact: true })).toBeEnabled();
  await expect(page.locator("#data-help a[href^='mailto:']")).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});
