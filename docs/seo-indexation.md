# SEO and indexation

[Documentation](../README.md#documentation) · [Deployment](deployment.md)

## URL and indexing policy

Use `https://www.histae.com` for canonical URLs, metadata, structured data, robots and sitemap entries.
Every localized route should declare its canonical URL, supported language alternates and French
`x-default`. The language selector should retain the current page or legal document.

Product routes in `config/site.json` are indexable. Legal pages and account pages currently use
`noindex, follow` and remain outside the sitemap. Removing a legal draft banner does not change
indexing policy or establish legal approval. See the [legal workflow](legal/README.md).

The non-www host must redirect to www without losing the path or query. Language redirects must
preserve HTTPS; no intermediate `http://` destination should be introduced by the proxy.

## Build verification

```bash
pnpm build
```

The postbuild script, `scripts/fix-static-seo.mjs`, normalizes alternate-link attributes and checks
the configured localized product, legal and account routes. It checks document language,
canonical and alternate links, titles, descriptions, robots directives, a single main heading,
navigation and legal links. It also checks sitemap membership, robots.txt and the absence of
retired payment pages. Account routes retain their privacy-related markup. This is a defined
set of checks rather than a full crawler or accessibility audit.

## Hosted verification

After deployment, confirm successful responses for representative localized pages and a 404 for an
unknown path. Inspect canonical URLs, reciprocal alternates and robots directives in the delivered
HTML, and check for conflicting HTTP headers or CDN cache rules.

For account pages, additionally verify `no-referrer` and `no-store` through redirects and the edge.
The local export cannot verify live certificates, headers, redirects or search-engine decisions.

Submit [the sitemap](https://www.histae.com/sitemap.xml) through the project's Search Console account.
Inspect the localized homepages and compare declared and selected canonicals. Search Console access
and actual indexation are separate from build checks; record a live finding only after verifying it.

Existing reference material:

- [Google: localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions)
- [Google: sitemap overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Google: canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
