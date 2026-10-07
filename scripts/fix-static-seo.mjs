import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const outputDirectory = path.resolve("out");
const configUrl = new URL("../config/site.json", import.meta.url);
const siteConfig = JSON.parse(await readFile(configUrl, "utf8"));
const locales = Object.keys(siteConfig.locales);
const legalDocuments = (await readdir(new URL("../docs/legal/", import.meta.url)))
  .filter((file) => file.endsWith(".md") && file !== "README.md")
  .map((file) => file.slice(0, -3));
const routes = [
  ...Object.values(siteConfig.routes).map((route) => ({ ...route, indexable: true })),
  ...legalDocuments.map((document) => ({ path: `legal/${document}`, indexable: false })),
];

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
    assertIncludes(head, '<title>', `${file}: missing title`);
    const robots = head.match(/<meta name="robots" content="([^"]+)"/)?.[1];
    const robotDirectives = robots?.split(/\s*,\s*/) ?? [];
    if (!robotDirectives.includes(route.indexable ? "index" : "noindex") || !robotDirectives.includes("follow")) {
      throw new Error(`${file}: unexpected robots directives ${robots ?? "none"}`);
    }
    if ((html.match(/<h1(?:\s|>)/g) ?? []).length !== 1) throw new Error(`${file}: expected exactly one h1`);
    if (head.includes("hrefLang=")) throw new Error(`${file}: non-normalized hrefLang attribute remains in head`);

    const header = html.match(/<header\b[^>]*>([\s\S]*?)<\/header>/)?.[1];
    const footer = html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)?.[1];
    if (!header || !footer) throw new Error(`${file}: missing site header or footer`);
    const faqHref = `/${locale}/${siteConfig.routes.faq.path}/`;
    const primaryNavigation = header.match(/<nav\b[^>]*id="site-navigation"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    if (!primaryNavigation) throw new Error(`${file}: missing primary navigation`);
    if (primaryNavigation.includes(`href="${faqHref}"`)) throw new Error(`${file}: FAQ remains in the menu`);
    assertIncludes(footer, `href="${faqHref}"`, `${file}: FAQ missing from footer`);
    for (const document of legalDocuments) {
      assertIncludes(footer, `href="/${locale}/legal/${document}/"`, `${file}: legal document missing from footer: ${document}`);
    }
    if (!route.indexable) {
      assertIncludes(html, `class="legal-document" lang="${locale}"`, `${file}: legal document has incorrect language`);
      if (route.path.endsWith("politique-confidentialite") && !/<table(?:\s|>)/.test(html)) {
        throw new Error(`${file}: privacy table not rendered`);
      }
    }

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

const sitemap = await readFile(path.join(outputDirectory, "sitemap.xml"), "utf8");
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const expectedSitemapUrls = locales.flatMap((locale) => routes.filter((route) => route.indexable).map((route) => pageUrl(locale, route)));
if (sitemapUrls.length !== expectedSitemapUrls.length || new Set(sitemapUrls).size !== expectedSitemapUrls.length) {
  throw new Error("Sitemap has duplicate, missing or unexpected URLs");
}
for (const url of expectedSitemapUrls) {
  if (!sitemapUrls.includes(url)) throw new Error(`Sitemap missing canonical URL: ${url}`);
}
const robotsFile = await readFile(path.join(outputDirectory, "robots.txt"), "utf8");
assertIncludes(robotsFile, `Sitemap: ${siteConfig.publicUrl}/sitemap.xml`, "robots.txt has an incorrect sitemap URL");
if (/^Disallow:\s*\/\s*$/m.test(robotsFile)) throw new Error("robots.txt blocks the entire site");

const expectedPageCount = locales.length * routes.length;
if (localizedPageCount !== expectedPageCount) {
  throw new Error(`Expected ${expectedPageCount} localized pages, validated ${localizedPageCount}`);
}

console.log(`Validated SEO, navigation and legal documents for ${localizedPageCount} localized pages; ${sitemapUrls.length} indexable sitemap URLs.`);
