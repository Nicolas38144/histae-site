import { expect, test, type Page } from "@playwright/test";

const user = "11111111-1111-4111-8111-111111111111";
const requestId = "22222222-2222-4222-8222-222222222222";
const deletionToken = `${user}:${"a".repeat(43)}`;
async function simulateApi(page: Page, authenticated = false) {
  const state = { authenticated, categories: [] as string[], deleted: 0, tokens: 0, loseDeletion: false, expire: false };
  await page.route("**/api/web/**", async route => {
    const path = new URL(route.request().url()).pathname;
    const method = route.request().method();
    if (path === "/api/web/account/session") {
      if (method === "DELETE") { state.authenticated = false; return route.fulfill({ status: 204 }); }
      return route.fulfill(state.authenticated
        ? { json: { user_id: user, onboarding_complete: false } }
        : { status: 401, json: { error: { code: "web_authentication_failed" } } });
    }
    if (path === "/api/web/account/otp/send") {
      expect(route.request().postDataJSON()).toEqual({ user_id: user, phone_number: "+33612345678" });
      expect(route.request().headers()["idempotency-key"]).toMatch(/^[a-f0-9-]{36}$/);
      return route.fulfill({ status: 202, json: { challenge_id: user } });
    }
    if (path === "/api/web/account/otp/verify") {
      expect(route.request().postDataJSON()).toEqual({ challenge_id: user, phone_number: "+33612345678", otp: "123456" });
      state.authenticated = true; return route.fulfill({ status: 204 });
    }
    expect(state.authenticated).toBe(true);
    if (state.expire) return route.fulfill({ status: 401, json: { error: { code: "web_authentication_failed" } } });
    if (path === "/api/web/privacy/data" && method === "DELETE") {
      const body = route.request().postDataJSON();
      expect(Object.keys(body)).toEqual(["category"]);
      state.categories.push(body.category); return route.fulfill({ status: 204 });
    }
    if (path === "/api/web/privacy/deletion-token" && method === "POST") {
      state.tokens++; return route.fulfill({ status: 201, json: { confirmation_token: deletionToken } });
    }
    if (path === "/api/web/privacy/account" && method === "DELETE") {
      expect(route.request().postDataJSON()).toEqual({ confirmation_token: deletionToken });
      state.deleted++; state.authenticated = false;
      if (state.loseDeletion) return route.abort("failed");
      return route.fulfill({ status: 202, json: { request_id: requestId, status: "in_progress" } });
    }
    throw new Error(`Unexpected website operation: ${method} ${path}`);
  });
  return state;
}

test("SMS login permits partial erasure without requiring onboarding or a subscription", async ({ page }) => {
  const state = await simulateApi(page);
  await page.goto("/fr/account/data/");
  await page.getByRole("link", { name: "Supprimer ma position", exact: true }).click();
  expect(state.categories).toEqual([]);
  await page.getByLabel("Identifiant du compte (UUID)").fill(user);
  await page.getByLabel("Numéro de téléphone").fill("+33612345678");
  await page.getByRole("button", { name: "Recevoir un code" }).click();
  await page.getByLabel("Code reçu par SMS").fill("123456");
  await page.getByRole("button", { name: "Confirmer le code" }).click();
  await page.getByRole("button", { name: "Supprimer ma position", exact: true }).click();
  await expect(page.getByRole("button", { name: "Confirmer la suppression", exact: true })).toBeDisabled();
  await page.getByLabel("Saisissez HISTAE pour confirmer").fill("HISTAE");
  await page.getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Votre position a été supprimée");
  expect(state.categories).toEqual(["location"]); expect(state.deleted).toBe(0);
  expect(page.url()).not.toContain(user);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain("+33612345678");
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page.getByRole("button", { name: "Recevoir un code", exact: true })).toBeEnabled();
  expect(state.authenticated).toBe(false);
});

test("partial deletion distinguishes photo and sensitive profile and honours cancellation", async ({ page }) => {
  const state = await simulateApi(page, true);
  await page.goto("/fr/account/data/");
  await page.getByRole("button", { name: "Supprimer ma photo", exact: true }).click();
  await page.getByRole("button", { name: "Annuler", exact: true }).click();
  expect(state.categories).toEqual([]);
  for (const action of ["Supprimer ma photo", "Supprimer ces données"]) {
    await page.getByRole("button", { name: action, exact: true }).click();
    await page.getByLabel("Saisissez HISTAE pour confirmer").fill("HISTAE");
    await page.getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
    await expect(page.getByLabel("Saisissez HISTAE pour confirmer")).toHaveCount(0);
  }
  expect(state.categories).toEqual(["photo", "sensitive_profile"]); expect(state.deleted).toBe(0);
});

test("account deletion uses a one-time token and displays acceptance rather than completed erasure", async ({ page }) => {
  const state = await simulateApi(page, true);
  await page.addInitScript(() => {
    for (const storage of ["localStorage", "sessionStorage"]) {
      Object.defineProperty(window, storage, { get() { throw new Error("Browser storage is disabled"); } });
    }
  });
  await page.goto("/fr/account/data/");
  await page.getByRole("button", { name: "Supprimer mon compte", exact: true }).click();
  expect(state.tokens).toBe(0);
  await page.getByLabel("Saisissez HISTAE pour confirmer").fill("HISTAE");
  await page.getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Votre demande a été acceptée" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText(requestId);
  await expect(page.getByRole("button", { name: "Supprimer mon compte", exact: true })).toHaveCount(0);
  expect(state.tokens).toBe(1); expect(state.deleted).toBe(1);
});

test("a lost destructive response never claims successful deletion or retries automatically", async ({ page }) => {
  const state = await simulateApi(page, true); state.loseDeletion = true;
  await page.goto("/fr/account/data/");
  await page.getByRole("button", { name: "Supprimer mon compte", exact: true }).click();
  await page.getByLabel("Saisissez HISTAE pour confirmer").fill("HISTAE");
  await page.getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Contactez le support avant de recommencer");
  await expect(page.getByRole("heading", { name: "Votre demande a été acceptée" })).toHaveCount(0);
  expect(state.deleted).toBe(1);
});

test("an expired session stops data deletion and requires authentication again", async ({ page }) => {
  const state = await simulateApi(page, true); state.expire = true;
  await page.goto("/fr/account/data/");
  await page.getByRole("button", { name: "Supprimer ma photo", exact: true }).click();
  await page.getByLabel("Saisissez HISTAE pour confirmer").fill("HISTAE");
  await page.getByRole("button", { name: "Confirmer la suppression", exact: true }).click();
  await expect(page.getByLabel("Numéro de téléphone")).toBeVisible();
  await expect(page.locator("main").getByRole("alert")).toBeVisible();
  expect(state.categories).toEqual([]);
});
