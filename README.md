# Histae

Histae is the official showcase website for an upcoming **dating application**.

The purpose of the website is to:

* Introduce the Histae concept and brand
* Present the upcoming dating application
* Build awareness before launch
* Provide visitors with information about the future product
* Prepare the online presence of Histae ahead of the app release

The Histae dating app is **coming soon**.

🌐 **Live website:** https://www.histae.com
Alternative URL: https://histae.com


## Tech Stack

* [Next.js](https://nextjs.org/) — React framework for production
* [React](https://react.dev/) — User interface library
* [TypeScript](https://www.typescriptlang.org/) — Static type checking for JavaScript
* [next-intl](https://next-intl.dev/) — Internationalization and localized navigation
* CSS — Styling and responsive design
* Node.js — JavaScript runtime


## Project Structure

```text
.
├── app/                # Next.js App Router pages and layouts
├── components/         # Reusable React components
├── config/             # Shared locales, routes and commercial catalogue
├── i18n/               # next-intl request and navigation configuration
├── messages/           # Translation catalogs split by locale and domain
├── public/             # Static assets
├── lib/                # Utilities and shared logic
├── next.config.ts      # Next.js configuration
├── tsconfig.json       # TypeScript configuration
├── package.json        # Project dependencies and scripts
└── README.md
```

## Performance & SEO

The website takes advantage of Next.js features to provide a fast and modern experience:

* Server-side rendering and static generation where appropriate
* Optimized routing
* Image optimization
* SEO-friendly metadata
* Canonical and hreflang links for every localized route
* Responsive design
* Type-safe development with TypeScript

## Quality checks

```bash
pnpm typecheck
pnpm lint
pnpm build
```

The production build validates all localized pages, their canonical URLs, hreflang links, language switch links and heading structure.

## Roadmap

The current website represents the first public presence of Histae.

The detailed backlog, priorities and completion criteria are maintained in [roadmap.md](roadmap.md).

Future developments include:

* Official launch of the Histae dating application
* Additional information about the app and its features
* Updates related to the launch
* Expansion of the Histae ecosystem

## Status

🚧 **Histae is currently in development.**

The website is live, while the dating application itself will be released soon.

## License

This project is private/proprietary unless otherwise specified.

All rights reserved.

---

Built with **Next.js** and **TypeScript**.

**Histae — Dating app coming soon.**

**Website:** [www.histae.com](https://www.histae.com)

## Règles de continuation

Le catalogue `config/site.json` distingue les trois crédits gratuits hebdomadaires, le stock publicitaire de trois crédits et le plafond de six continuations confirmées par participant Free. Les valeurs sont injectées dans les tarifs, la FAQ et la page des fonctionnalités, dans les quatre langues. Les choix restent privés et l’envoi est suspendu pendant les 24 heures de décision. Les textes juridiques décrivent aussi la publicité récompensée prévue et restent des brouillons à valider avant son activation. Aucun SDK publicitaire n’est ajouté au site.

## Next.js and TypeScript conventions

Presentation components remain Server Components unless browser interactivity requires a client boundary.
`lib/plans.ts` validates the configured feature identifiers; `lib/pricing.ts` builds typed, localized card models;
`PricingCard` renders them. Prices and credit limits come from `config/site.json`, with text supplied by next-intl.
React keys use stable catalogue or content identifiers rather than translated labels.

TypeScript is strict and checks unused code and switch fallthrough. ESLint includes the Next.js Core Web Vitals
and TypeScript configurations. Run all three quality checks above before shipping; the static build also validates
localized navigation and SEO. Do not commit generated `.next`, `out` or TypeScript build cache files.
