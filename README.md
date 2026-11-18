# Histae website

The public website for Histae, a dating app built around conversation, time and mutual consent.
It presents the product in French, English, Spanish and Italian and lets existing users manage
their account and data. Purchases and subscriptions use the Apple and Google stores in the app.

**Website:** [www.histae.com](https://www.histae.com/)

**Support:** [support.histae@gmail.com](mailto:support.histae@gmail.com)

## Getting started

Use Node.js 24 and the pnpm version declared in `package.json`.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open the local URL printed by Next.js. Marketing and legal pages work without an API.
Account management requires the API; see the [account guide](docs/account.md).

## Documentation

| Guide | Purpose |
| --- | --- |
| [Development](docs/development.md) | Structure, translations, design, screenshots and checks |
| [Account](docs/account.md) | Web authentication, data deletion and account erasure |
| [Security](docs/security.md) | Static CSP, dependency findings and security checks |
| [Deployment](docs/deployment.md) | Static export, API routing, caching and release checks |
| [SEO](docs/seo-indexation.md) | Canonical URLs, indexing rules and verification |
| [Child safety](docs/child-safety.md) | Published standards, in-app reporting and operator procedure |
| [Legal content](docs/legal/README.md) | Localized document sources and publication workflow |
| [Roadmap](roadmap.md) | Remaining work and acceptance criteria |

## Architecture

Next.js App Router, React, TypeScript and next-intl generate a static `out/` directory.
Caddy serves it in production with a CSP generated from the same HTML; there is no Next.js production server.
Account authentication and privacy requests reach the API through a same-origin reverse proxy.

`config/site.json` defines locales, public routes, the public support address, feature/credit descriptions
and legal document mappings.
Premium cards describe the mobile plans and link to app availability; store prices are shown in the app.
`messages/` contains localized interface copy. Account data and sessions belong to the API.

## Account and data deletion

The footer links to `/{fr,en,es,it}/account/data/`. Instructions, retention information and a
support email are public, including for people who have uninstalled the app or lost their UUID.
Automatic actions require the existing account UUID, matching phone number and SMS verification.
The short-lived HttpOnly website session is used only for account management; no mobile token
or private account data is written to browser storage.

Users can remove their profile photo, erase their saved location and withdraw location consent,
or erase sex/dating preferences and withdraw sensitive-data consent without closing their account.
Closing the account requires a separate confirmation and a one-time deletion token. The page
acknowledges acceptance of background erasure, rather than claiming that cleanup has finished.
Neither paid access nor completed onboarding is required. Apple/Google subscriptions must be
cancelled in their store.

Deploy the API, site and reverse proxy together. The proxy must forward `/api/web/account/*` and
`/api/web/privacy/*`. Remove former website-payment proxy rules. No database reset or migration is needed.
`WEB_BILLING_ORIGIN` must match the website origin even if `WEB_BILLING_ENABLED=false`.

Once deployed, the Google Play account-deletion URL can point to
`https://www.histae.com/fr/account/data/#delete-account` and its optional partial-data-deletion URL
to `https://www.histae.com/fr/account/data/#delete-data`. Confirm the real production retention
and backup practices before submitting the declaration; this page does not finalise the draft legal policy.

## Checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The build includes static SEO checks. Run focused tests when changing account management or other interactive
behavior; commands and limitations are documented in [Development](docs/development.md#checks).
A successful local build does not verify production headers or API configuration.

## Source access and licensing

Copyright © 2026 Nicolas GERMANI. Original Histae code is proprietary and publicly available only
for inspection and security audits. Reuse, modification outside an audit, redistribution and use
in another project or service are prohibited for commercial and non-commercial purposes without
prior written permission. See [LICENSE.md](LICENSE.md) for the limited audit permission and
applicable exceptions. External contributions are not accepted.

Third-party dependencies, SDKs and fonts retain their own licenses; these restrictions do not
override their rights or notices. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
