import { test, expect } from "@playwright/test";
import { serializeJsonLd } from "../lib/json-ld";
import { billingRequest } from "../lib/billing/client";

test("JSON-LD cannot introduce another HTML element", () => {
  const input = { description: '</script><img src=x onerror="window.injected=true">' };
  const output = serializeJsonLd(input);
  expect(output).not.toContain("<");
  expect(JSON.parse(output)).toEqual(input);
});

test("request deadline remains active alongside caller cancellation", async () => {
  const originalFetch = globalThis.fetch;
  const originalTimeout = AbortSignal.timeout;
  try {
    AbortSignal.timeout = () => originalTimeout(10);
    globalThis.fetch = async (_input, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
    const controller = new AbortController();
    await expect(billingRequest("session", "fr", { signal: controller.signal })).rejects.toMatchObject({ code: "network_error" });
    expect(controller.signal.aborted).toBe(false);
  } finally { globalThis.fetch = originalFetch; AbortSignal.timeout = originalTimeout; }
});

test("caller cancellation still interrupts a request with its own deadline", async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (_input, options) => new Promise((_resolve, reject) => {
      options!.signal!.addEventListener("abort", () => reject(new Error("aborted")), { once: true });
    });
    const controller = new AbortController();
    const request = billingRequest("session", "fr", { signal: controller.signal });
    controller.abort();
    await expect(request).rejects.toMatchObject({ code: "network_error" });
  } finally { globalThis.fetch = originalFetch; }
});
