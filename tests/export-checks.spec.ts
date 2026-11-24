import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

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
