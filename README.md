# Histae website

The public website for Histae, a dating app built around conversation, time and mutual consent.
It presents the product in French, English, Spanish and Italian and lets existing users purchase
or manage a Stripe subscription. Mobile purchases use the Apple and Google stores.

**Website:** [www.histae.com](https://www.histae.com/)

## Getting started

Use Node.js 24 and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Next.js. Marketing and legal pages work without an API.
The subscription flow requires the API; see [billing](docs/billing.md).

## Documentation

| Guide | Purpose |
| --- | --- |
| [Development](docs/development.md) | Structure, translations, design, screenshots and checks |
| [Billing](docs/billing.md) | Web authentication, Stripe Checkout and payment recovery |
| [Deployment](docs/deployment.md) | Static export, API routing, caching and release checks |
| [SEO](docs/seo-indexation.md) | Canonical URLs, indexing rules and verification |
| [Legal content](docs/legal/README.md) | Localized document sources and publication workflow |
| [Roadmap](roadmap.md) | Remaining work and acceptance criteria |

## Architecture

Next.js App Router, React, TypeScript and next-intl generate a static `out/` directory.
Caddy serves it in production; there is no Next.js production server.
Subscription requests reach the API through a same-origin reverse proxy.

`config/site.json` defines locales, public routes, the marketing catalogue and legal document mappings.
`messages/` contains localized interface copy. Stripe credentials and account data belong to the API.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The build includes static SEO checks. Run focused tests when changing billing or other interactive
behavior; commands and limitations are documented in [Development](docs/development.md#checks).
A successful local build does not verify production headers, API configuration or real payments.

## Source visibility and rights

The source is public for inspection and security audits. It remains proprietary; public visibility
does not grant modification or reuse rights. External contributions are not accepted.
All rights reserved.
