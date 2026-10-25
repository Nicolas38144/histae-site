# Development

[Documentation](../README.md#documentation)

## Project structure

| Path | Responsibility |
| --- | --- |
| `app/` | Localized pages, layouts and static billing return entry points |
| `components/` | Presentation and interactive UI boundaries |
| `hooks/` | Browser state and user actions |
| `lib/` | Typed configuration, metadata, pricing, legal content and billing helpers |
| `config/site.json` | Locales, routes, repositories, marketing values and legal mappings |
| `messages/{locale}/` | Translation files grouped by domain |
| `i18n/` | next-intl routing and request configuration |
| `public/` | Local fonts, branding and screenshots |
| `docs/legal/` | Markdown sources rendered as public legal pages |
| `scripts/` | Static SEO checks and screenshot conversion |
| `tests/` | Focused protocol and browser tests |

Pages and presentation components remain Server Components unless state, events or browser APIs
require a client boundary. Keep transport, parsing and storage out of presentation components.
Read any project instructions and the relevant installed Next.js guide before changing framework
behavior. Automatic `AGENTS.md` generation is disabled with `agentRules: false` in `next.config.ts`.
On the next development-server startup, Next.js removes its managed block and deletes the file
if it contains nothing else; handwritten project instructions are preserved.

## Content and translations

Support `fr`, `en`, `es` and `it`, with French as the fallback. Add visible copy to the appropriate
translation domain in every locale. `messages/index.ts` assembles the domains and checks their
TypeScript shape. Do not use translated labels as React keys.

Credit limits and feature identifiers come from `config/site.json`; reconcile those rules with the
API for a release. Premium amounts are not stored in the site configuration or translations.
The public cards request `/api/web/billing/plans` once per mounted grid, without cookies or a session
lookup, and use the same offer parser as Checkout. A timeout, malformed/duplicate or unavailable
catalogue leaves a localized price link, never a stale fallback amount. Without JavaScript the
same links remain usable. Annual savings require two offers in the same currency and a positive
saving. Structured data only includes the static free offer, not invented Premium prices.

`lib/pricing.ts` builds static card content. `lib/billing/public-offers.ts` owns the public request
and deduplicates concurrent reads only. `hooks/use-public-offers.ts` owns its view state;
`lib/pricing-offers.ts` owns amount formatting/comparison; `components/pricing-grid.tsx` combines them.
The API and payment provider remain authoritative for purchases and access rights.

Keep route and legal source identifiers stable. Public legal text has a separate
[publication workflow](legal/README.md); its language is independent of the English developer docs.

## Brand and writing

Use the existing dark palette, typography and shared button styles. Write concrete, welcoming
copy with short paragraphs rather than repeated numbered feature lists. Explain something a visitor
can do or see before making a broad promise. Avoid repeated three-part slogans, invented founder
stories, testimonials, community counts or claims that public source code has already been audited.
Keep timing, consent, credit and launch limitations accurate. Adapt the wording naturally in each
locale rather than reproducing every French sentence word for word. Long profile biographies
are intentional: the product encourages discovering people through their words.

The logo is the open book. The name is an optional accompanying signature:

- `public/branding/histae-logo.svg`: standalone symbol;
- `public/branding/histae-signature.svg`: symbol with outlined lettering;
- `lib/branding.ts`: shared favicon and Apple touch icon metadata.

The manifest uses explicit PNG icon sizes. Keep native app icons and site assets consistent.
The narrow mobile header uses the standalone book. Keep fonts and brand assets local.

## App screenshots

Screenshots come from real Flutter widgets with fictional profiles and conversations. Keep the
fictional-content captions and localized alt text. Preserve full screen proportions; load the hero
eagerly and other captures lazily.

From the adjacent `histae-app` repository, with its Flutter dependencies installed and `FLUTTER_ROOT`
pointing to the SDK:

```bash
flutter test tool/preview_website_test.dart
```

Then, from this repository:

```bash
node scripts/export-app-screenshots.mjs
```

The converter also writes content hashes to `config/app-screenshots.json`; image URLs use these
versions so a new capture is not hidden by an old browser cache.

The converter reads `../histae-app/build/previews/website` by default and writes localized WebP files
to `public/images/app/{locale}/`. An optional first argument selects another input directory.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

`pnpm build` exports `out/` and runs `scripts/fix-static-seo.mjs` through the postbuild script.
If invoking Next.js directly, run that postbuild script separately. See [SEO](seo-indexation.md)
for its coverage and production checks. The same postbuild also generates the per-page CSP map
in `.generated/`; keep it with the matching HTML when deploying or rolling back.

Billing storage and request tests use synthetic responses and do not require a browser:

```bash
pnpm exec playwright test tests/checkout-storage.spec.ts tests/checkout-request.spec.ts
```

For browser scenarios, install Chromium once and run the relevant cases:

```bash
pnpm exec playwright install chromium
pnpm exec playwright test tests/marketing.spec.ts tests/billing.spec.ts
```

Set `PLAYWRIGHT_CHANNEL=msedge` to use an already installed Edge instead of Playwright Chromium.
Playwright starts a dedicated local development server. Billing fixtures simulate the API without
sending SMS or taking payments. Add regression tests for important behavior, rather than testing
every presentation change. Report what ran; do not treat fixture tests as production verification.

For CSP and synthetic injection checks against the built export, run `pnpm build` followed by
`pnpm exec playwright test --config=playwright.export.config.ts`. See [Security](security.md)
for the separate runtime validation and outstanding dependency finding.

Generated `.next/`, `out/`, `.generated/` and TypeScript build caches are not source files. Dependencies and the
lockfile should stay aligned with the package manager declared in `package.json`.

## Accessibility and weight of the current export

The local export was checked on 2026-10-23 with Edge and axe-core 4.13.0: ten representative
routes, desktop and 375 px mobile, using the WCAG 2 A/AA and 2.1 AA rule sets. No automated
violations or horizontal overflow were reported in those twenty views. The focused browser
tests also exercise the keyboard skip link, language dialog focus/closing, reduced motion
and loading of the three home screenshots. This does not establish full WCAG conformance.

The twenty current WebP screenshots total 1,291,250 bytes; the largest is 86,716 bytes.
Lazy loading is retained except for the hero. Keep each capture below 100 KiB when refreshing
them, and check the actual page request mix after layout or dependency changes. Local asset
sizes do not establish hosted Core Web Vitals or performance on a slow mobile connection.

Manual screen-reader, 200% zoom, touch/device and cross-browser review remain release checks.
Verify real Stripe/store payments, delayed webhooks and deployed headers in the intended
provider environment; browser fixtures never establish those outcomes.

Next.js 16.4.1's generated development validator imports unused route-handler types even when
there are no route handlers. Only `.next/dev/types/validator.ts` is excluded from standalone
TypeScript checks for that reason. The build validator in `.next/types/` and the strict checks
on application/test source remain enabled; do not disable noUnusedLocals globally.

## Discovery and self-service help

The features page includes a fictional interactive profile, conversation and mutual-photo-consent
demonstration, followed by a profile-writing guide. Home links directly to the demo. State stays
in component memory; the demo sends no account, message or consent requests. The FAQ searches
localized answers and combines search with topic filters. Pricing and FAQ include a channel
selector for Stripe, Google Play and Apple subscription help. Copy lives in discovery.json in
all four locales. Run `pnpm exec playwright test tests/discovery.spec.ts` for these interactions.


### Discovery feature boundaries

The server pages compose localized content. `lib/faq.ts` owns FAQ metadata and filtering; `FaqExplorer` owns input state and renders results. Subscription guidance uses explicit channel IDs and `lib/billing/subscription-channels.ts` for destinations, rather than parallel translation arrays. The product demo separates its local journey state (`use-product-demo.ts`) from its controlled presentation panels (`demo-panels.tsx`). None of these modules makes account or payment requests.
