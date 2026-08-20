import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");
const configUrl = new URL("../config/site.json", import.meta.url);
const siteConfig = JSON.parse(await readFile(configUrl, "utf8"));
const locales = Object.keys(siteConfig.locales);
const routes = Object.values(siteConfig.routes);

function pageUrl(locale, route) {
  const suffix = route.path ? `${route.path}/` : "";
  return `${siteConfig.publicUrl}/${locale}/${suffix}`;
}

function pageFile(locale, route) {
  return path.join(outputDirectory, locale, route.path, "index.html");
}

function extractHead(html, file) {
  const match = html.match(/<head>([\s\S]*?)<\/head>/);
  if (!match) throw new Error(`${file}: missing head element`);
  return match[1];
}

function normalizeHeadAttributes(html, file) {
  const head = extractHead(html, file);
  const normalizedHead = head.replaceAll("hrefLang=", "hreflang=");
  return head === normalizedHead ? html : html.replace(head, normalizedHead);
}

function assertIncludes(value, expected, message) {
  if (!value.includes(expected)) throw new Error(message);
}

let localizedPageCount = 0;

for (const locale of locales) {
  for (const route of routes) {
    const file = pageFile(locale, route);
    const originalHtml = await readFile(file, "utf8");
    const html = normalizeHeadAttributes(originalHtml, file);
    const head = extractHead(html, file);
    const canonical = pageUrl(locale, route);

    const documentLanguage = html.match(/<html lang="([^"]+)"/)?.[1];
    if (documentLanguage !== locale) {
      throw new Error(`${file}: expected html lang ${locale}, received ${documentLanguage ?? "none"}`);
    }

    const alternateTags = head.match(/<link rel="alternate"[^>]+>/g) ?? [];
    for (const targetLocale of locales) {
      const expectedUrl = pageUrl(targetLocale, route);
      if (!alternateTags.some((tag) => tag.includes(`hreflang="${targetLocale}"`) && tag.includes(`href="${expectedUrl}"`))) {
        throw new Error(`${file}: missing hreflang ${targetLocale} → ${expectedUrl}`);
      }
    }

    const defaultUrl = pageUrl(siteConfig.defaultLocale, route);
    if (!alternateTags.some((tag) => tag.includes('hreflang="x-default"') && tag.includes(`href="${defaultUrl}"`))) {
      throw new Error(`${file}: missing hreflang x-default → ${defaultUrl}`);
    }

    assertIncludes(head, `<link rel="canonical" href="${canonical}"`, `${file}: invalid canonical URL`);
    assertIncludes(head, '<meta name="description"', `${file}: missing meta description`);
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) throw new Error(`${file}: expected exactly one h1`);
    if (head.includes("hrefLang=")) throw new Error(`${file}: non-normalized hrefLang attribute remains in head`);

    const languageLinks = html.match(/<a[^>]+lang="[^"]+"[^>]*>/g) ?? [];
    for (const targetLocale of locales) {
      const expectedHref = pageUrl(targetLocale, route).replace(siteConfig.publicUrl, "");
      if (!languageLinks.some((tag) => tag.includes(`lang="${targetLocale}"`) && tag.includes(`href="${expectedHref}"`))) {
        throw new Error(`${file}: language switch does not preserve the route for ${targetLocale}`);
      }
    }

    if (html !== originalHtml) await writeFile(file, html, "utf8");
    localizedPageCount += 1;
  }
}

const expectedPageCount = locales.length * routes.length;
if (localizedPageCount !== expectedPageCount) {
  throw new Error(`Expected ${expectedPageCount} localized pages, validated ${localizedPageCount}`);
}

console.log(`Validated SEO metadata for ${localizedPageCount} localized pages.`);
