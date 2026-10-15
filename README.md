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

* Static export generated at build time, without a Next.js production server
* Optimized routing
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

The source code is public for review and security audits. The repositories are not open to external contributions.
The code remains proprietary: modification and reuse rights are reserved. Public visibility does not grant an open-source licence.

All rights reserved.

---

Built with **Next.js** and **TypeScript**.

**Histae — Dating app coming soon.**

**Website:** [www.histae.com](https://www.histae.com)

## Règles de continuation

Le catalogue `config/site.json` distingue les trois crédits gratuits hebdomadaires, le stock publicitaire de trois crédits et le plafond de six continuations confirmées par participant Free. Les valeurs sont injectées dans les tarifs, la FAQ et la page des fonctionnalités, dans les quatre langues. Les choix restent privés et l’envoi est suspendu pendant les 24 heures de décision. Chaque participant Free utilise son propre crédit ; un participant Premium n’en consomme pas et ne couvre pas le crédit de l’autre. Les textes juridiques décrivent aussi la publicité récompensée prévue et restent des brouillons à valider avant son activation. Aucun SDK publicitaire n’est ajouté au site.

## Présentation des offres et du code public

L’accueil et la page Tarifs présentent trois cartes : Free, Premium Mensuel et Premium Annuel. Les deux formules
Premium partagent les mêmes fonctionnalités du catalogue. Le prix annuel est affiché comme un paiement unique ;
son équivalent mensuel, l’économie annuelle et le pourcentage de réduction sont calculés à partir des prix du catalogue.
La page Tarifs explique les crédits, les deux fenêtres de 24 heures, l’essai, la reconduction et les matchs Free/Premium.
Le site reste une vitrine : il ne propose ni achat ni précommande, et conserve un état de lancement en préparation.

Les trois dépôts publics sont centralisés dans `config/site.json` et présentés sur les pages Sécurité et À propos,
avec un accès depuis le footer et la FAQ. La formulation retenue est « code source public et auditable » ; aucun droit
de modification ou de réutilisation, ni aucune acceptation de contributions externes, n’est annoncé. Cette visibilité
ne doit pas être présentée comme une licence open source. Les textes sont maintenus dans les quatre langues.

## Next.js and TypeScript conventions

Presentation components remain Server Components unless browser interactivity requires a client boundary.
`lib/plans.ts` validates the configured feature identifiers; `lib/pricing.ts` builds typed, localized card models;
`PricingCard` renders them. Prices and credit limits come from `config/site.json`, with text supplied by next-intl.
React keys use stable catalogue or content identifiers rather than translated labels.

TypeScript is strict and checks unused code and switch fallthrough. ESLint includes the Next.js Core Web Vitals
and TypeScript configurations. Run all three quality checks above before shipping; the static build also validates
localized navigation and SEO. Do not commit generated `.next`, `out` or TypeScript build cache files.

## Serveur Caddy et confidentialité des logs

L’image finale utilise Caddy **2.11.7**, figé par digest, pour servir les fichiers statiques.
`Caddyfile` désactive l’API d’administration, HTTPS automatique et la sauvegarde de configuration.
Il écoute en HTTP interne et charge `caddy-common.caddy` pour la politique commune des logs et du corps HTTP.
Le runtime utilise UID/GID 1000, une racine en lecture seule et uniquement `NET_BIND_SERVICE`.

Les logs JSON suppriment la requête complète et les en-têtes de réponse. Ils conservent le statut,
la durée, des métriques numériques, la méthode normalisée, la catégorie de route et l’UUID de réponse
API validé. Les URL, paramètres, IP, cookies et autres en-têtes privés sont exclus. Les erreurs HTTP
ordinaires sont représentées par ce log expurgé ; le logger runtime ne les duplique pas.
La pile `reverse-proxy` borne les logs Docker à cinq fichiers de 10 Mo par conteneur.

Lors d’une copie manuelle, copier **`Caddyfile`**, **`caddy-common.caddy`** et **`Dockerfile`**, puis reconstruire
et recréer le service. Les anciens fichiers `nginx.conf` et `nginx-logging.conf` sont supprimés.
Le guide et les vérifications sont dans `../histae-api-rust/docs/caddy-migration.md`.

Les redirections du domaine canonique, des langues et des anciennes routes juridiques sont conservées.
Les ressources publiques gardent leur cache d’un jour et une page absente garde le statut 404.
Les en-têtes CSP et protections navigateur s’appliquent aussi aux réponses d’erreur.
