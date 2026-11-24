# Development

[Documentation](../README.md#documentation)

## Project structure

| Path | Responsibility |
| --- | --- |
| `app/` | Localized product, legal and account pages and layouts |
| `components/` | Presentation and interactive UI boundaries |
| `hooks/` | Browser state and user actions |
| `lib/` | Typed configuration, metadata, mobile plan descriptions, legal content and account helpers |
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
API for a release. Reference Premium prices in EUR are stored in cents in `config/site.json` under
`plans.premium.monthlyPriceCents` and `annualPriceCents`. Keep them aligned with the API catalogue
seed in `db/002_insert_postgres.sql`; do not use synthetic app test fixtures as price sources.
`lib/pricing.ts` builds static card content, rendered by `PricingCards` without client-side requests.
Cards show the reference amounts with localized billing periods and link to app availability.
The App Store or Google Play shows the applicable purchase prices and terms
before an in-app purchase. Structured data includes only the static free offer.

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

The converter writes 320 px and 780 px WebP versions and hashes each file in
`config/app-screenshots.json`. `AppScreenshot` uses `srcset` and `sizes` so the browser can choose
a suitable resolution. Keep `sizes` aligned with the screenshot widths in `app/globals.css`.

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

Account transport tests use synthetic responses and do not require a browser:

```bash
pnpm exec playwright test tests/web-client.spec.ts tests/security.spec.ts
```

For browser scenarios, install Chromium once and run the relevant cases:

```bash
pnpm exec playwright install chromium
pnpm exec playwright test tests/marketing.spec.ts
pnpm exec playwright test tests/account-data.spec.ts
```

Set `PLAYWRIGHT_CHANNEL=msedge` to use an already installed Edge instead of Playwright Chromium.
Playwright starts a dedicated local development server. Account fixtures simulate the API without
sending SMS or deleting real accounts. Add regression tests for important behavior, rather than testing
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

The twenty localized WebP screenshots were refreshed from the current app on 2026-11-06.
Lazy loading is retained except for the hero. Keep each capture below 100 KiB when refreshing
them, and check the actual page request mix after layout or dependency changes. Local asset
sizes do not establish hosted Core Web Vitals or performance on a slow mobile connection.

Manual screen-reader, 200% zoom, touch/device and cross-browser review remain release checks.
Verify deployed account authentication, API origin checks and headers in the intended environment;
browser fixtures never establish those outcomes. Store purchase checks belong to the mobile release.

Next.js 16.4.1's generated development validator imports unused route-handler types even when
there are no route handlers. Only `.next/dev/types/validator.ts` is excluded from standalone
TypeScript checks for that reason. The build validator in `.next/types/` and the strict checks
on application/test source remain enabled; do not disable noUnusedLocals globally.

## Discovery and self-service help

The features page includes a fictional interactive profile, conversation and mutual-photo-consent
demonstration, followed by a profile-writing guide. Home links directly to the demo. State stays
in component memory; the demo sends no account, message or consent requests. The FAQ searches
localized answers and combines search with topic filters. Pricing and FAQ include a channel
selector for Google Play and Apple subscription help. Copy lives in discovery.json in
all four locales. Run `pnpm exec playwright test tests/discovery.spec.ts` for these interactions.


### Discovery feature boundaries

The server pages compose localized content. `lib/faq.ts` owns FAQ metadata and filtering; `FaqExplorer` owns input state and renders results. Subscription guidance uses explicit store IDs and `lib/store-subscriptions.ts` for destinations, rather than parallel translation arrays. The product demo separates its local journey state (`use-product-demo.ts`) from its controlled presentation panels (`demo-panels.tsx`). None of these modules makes account or payment requests.

## Product availability

`DownloadPage` owns the platform status and invited-tester store link. Its copy lives in
`pages.download` in all four locales. Android testing is invitation-only; do not publish a
public download badge or infer an enrolment URL from the package name. The owner-provided
Google Play listing is stored in `config/site.json` under `storeLinks.androidTest` and displayed
with an invited-tester label. Opening it does not grant test access. iOS remains in preparation.
When access changes, update availability, home, footer, FAQ and SEO together. Keep test access
distinct from a free Premium trial. `tests/availability.spec.ts` checks the Google Play listing,
invitation wording and absence of an App Store link on the French mobile page.

The product copy now covers reading controls, saved message/answer drafts, unread counts,
profile access from chats, withdrawal/replacement of shared photos and the continuation action
inside the composer. Notification copy describes implemented events, not proof of deployment
or real-device delivery; those checks remain in the app/API release checklist.

## Content ownership and regression scope

`FeaturePage` and `SecurityPage` own their typed translation blocks and page composition.
The unified Security page includes the project rationale, consent controls, account access, data
rights and source-code section. The former About page is removed and returns 404; it has no redirect or fallback document.
`InformationPage` supplies only the shared frame; `AppStory`, `StoryPassage` and `StoryDetails`
render provided content without selecting blocks by unchecked strings. Only credit text needs
commercial interpolation. Availability remains in `DownloadPage`.

Import account transport from `lib/web-client.ts` and account response validation from `lib/account-data.ts`.
Branding owns the real social image and its dimensions; the export check verifies the image exists.

Keep security, account authentication, privacy and retired-route regression tests.
Regression tests assert behavior and asset loading. They no longer write manual screenshots on
each run; use a deliberate browser capture when reviewing a design. Availability checks protect
invited access and store destinations without comparing the page to its own translation files.
