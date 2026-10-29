import { expect, test } from "@playwright/test";
import { billingRequest } from "../lib/billing/client";

const originalFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = originalFetch; });

test("bodyless website actions do not declare an empty JSON payload", async () => {
  const requests: RequestInit[] = [];
  globalThis.fetch = async (_input, options) => {
    requests.push(options ?? {});
    return new Response(null, { status: 204 });
  };
  await billingRequest("deletion-token", "fr", { method: "POST" }, "privacy");
  await billingRequest("session", "fr", { method: "DELETE" }, "account");
  await billingRequest("session", "fr", { method: "DELETE" });
  await billingRequest("portal", "fr", { method: "POST" });
  for (const request of requests) {
    const headers = new Headers(request.headers);
    expect(headers.has("Content-Type")).toBe(false);
    expect(headers.get("Accept-Language")).toBe("fr");
    expect(request.body).toBeUndefined();
    expect(request.credentials).toBe("same-origin");
    expect(request.cache).toBe("no-store");
    expect(request.redirect).toBe("error");
  }
  expect(requests).toHaveLength(4);
});

test("JSON mutations preserve their body, locale and caller headers", async () => {
  let request: RequestInit | undefined;
  globalThis.fetch = async (_input, options) => {
    request = options;
    return new Response(null, { status: 204 });
  };
  const body = JSON.stringify({ category: "location" });
  await billingRequest("data", "it", {
    method: "DELETE", body, headers: new Headers({ "X-Request-Id": "fixture" }),
  }, "privacy");
  const headers = new Headers(request?.headers);
  expect(headers.get("Content-Type")).toBe("application/json");
  expect(headers.get("Accept-Language")).toBe("it");
  expect(headers.get("X-Request-Id")).toBe("fixture");
  expect(request?.body).toBe(body);
});
