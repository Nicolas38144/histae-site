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
Read `AGENTS.md` and the relevant installed Next.js guide before changing framework behavior.

## Content and translations

Support `fr`, `en`, `es` and `it`, with French as the fallback. Add visible copy to the appropriate
translation domain in every locale. `messages/index.ts` assembles the domains and checks their
TypeScript shape. Do not use translated labels as React keys.

Marketing prices, credit limits and feature identifiers come from `config/site.json`.
`lib/plans.ts` validates feature identifiers; `lib/pricing.ts` builds localized card models.
The subscription form loads its offers from the API. Keep both catalogues aligned for a release;
the API and payment provider remain authoritative for purchases and access rights.

Keep route and legal source identifiers stable. Public legal text has a separate
[publication workflow](legal/README.md); its language is independent of the English developer docs.

## Brand and writing

Use the existing dark palette, typography and shared button styles. Write concrete, welcoming
copy with short paragraphs rather than repeated numbered feature lists. Long profile biographies
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
for its coverage and production checks.

Billing storage and request tests use synthetic responses and do not require a browser:

```bash
pnpm exec playwright test tests/checkout-storage.spec.ts tests/checkout-request.spec.ts
```

For browser scenarios, install Chromium once and run the relevant cases:

```bash
pnpm exec playwright install chromium
pnpm exec playwright test tests/billing.spec.ts
```

Playwright starts a dedicated local development server. Billing fixtures simulate the API without
sending SMS or taking payments. Add regression tests for important behavior, rather than testing
every presentation change. Report what ran; do not treat fixture tests as production verification.

Generated `.next/`, `out/` and TypeScript build caches are not source files. Dependencies and the
lockfile should stay aligned with the package manager declared in `package.json`.
