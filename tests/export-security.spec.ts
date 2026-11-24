import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

type AuditWindow = Window & { blocked: string[]; injected?: boolean };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as AuditWindow).blocked = [];
    document.addEventListener("securitypolicyviolation", event => (window as unknown as AuditWindow).blocked.push(event.violatedDirective));
  });
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

test("public pages and account sign-in work under the production CSP", async ({ page }) => {
  for (const path of ["/fr/", "/fr/pricing/", "/fr/account/data/"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-security-policy"]).toContain("sha256-");
    if (path === "/fr/") {
      await page.locator(".language-trigger").click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
    }
    if (path === "/fr/account/data/") await expect(page.locator("#data-login form button").first()).toBeEnabled();
    expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
  }
});

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

test("public plan links guide visitors to app availability under the production CSP", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Tarifs", exact: true }).click();
  await page.locator(".pricing-card").nth(1).getByRole("link").click();
  await expect(page).toHaveURL(/\/fr\/download\/$/);
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});

test("the footer opens data management without breaking the document security policy", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Gérer mes données", exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/account\/data\/$/);
  await expect(page.getByRole("button", { name: "Recevoir un code", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});

test("retired addresses return 404 without redirecting", async ({ request }) => {
  const retiredPaths = ["about", "about/", "about/index.html",
    ...["subscribe", "success", "cancel", "return"].flatMap(kind =>
      [`billing/${kind}`, `billing/${kind}/`, `billing/${kind}/index.html`]),
    "legal/conditions-utilisation/", "legal/politique-confidentialite/",
    "legal/consentement-donnees-sensibles/", "legal/consentement-localisation/"];
  const paths = ["/about", "/about/", ...retiredPaths.filter(path => path.startsWith("billing/")).map(path => `/${path}`), ...["fr", "en", "es", "it"].flatMap(locale =>
    retiredPaths.map(path => `/${locale}/${path}`))];
  for (const path of paths) {
    const response = await request.get(path, { maxRedirects: 0 });
    expect(response.status(), path).toBe(404);
  }
});
