import { test, expect } from "@playwright/test";

type AuditWindow = Window & { blocked: string[]; injected?: boolean };

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as AuditWindow).blocked = [];
    document.addEventListener("securitypolicyviolation", event => (window as unknown as AuditWindow).blocked.push(event.violatedDirective));
  });
  await page.route("**/api/web/account/**", route => route.fulfill({ status: 401, json: { error: { code: "web_authentication_failed" } } }));
});

test("injected inline scripts and event handlers are blocked", async ({ page }) => {
  const response = await page.goto("/fr/");
  expect(response?.status()).toBe(200);
  expect(response?.headers()["content-security-policy"]).toContain("sha256-");
  await page.locator(".language-trigger").click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
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

test("the footer opens data management without breaking the document security policy", async ({ page }) => {
  await page.goto("/fr/");
  await page.getByRole("contentinfo").getByRole("link", { name: "Gérer mes données", exact: true }).click();
  await expect(page).toHaveURL(/\/fr\/account\/data\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Gérer mes données Histae");
  await expect(page.locator("#data-help a[href^='mailto:']")).toBeVisible();
  await expect(page.getByRole("button", { name: "Recevoir un code", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => (window as unknown as AuditWindow).blocked)).toEqual([]);
});
