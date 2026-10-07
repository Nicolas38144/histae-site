# Vérification de l’indexation — 7 octobre 2026

## Observations sur le site en ligne

- Les 28 pages principales (7 pages × 4 langues) répondent en HTTP 200 après redirection vers `https://www.histae.com`. Elles portent `index, follow`, une balise canonique et cinq liens de langue (fr, en, es, it et x-default). Aucun en-tête `X-Robots-Tag` bloquant n’a été trouvé.
- `https://www.histae.com/robots.txt` autorise l’exploration. Le sitemap répond en HTTP 200 et contient les 28 pages.
- Une adresse inexistante renvoie bien HTTP 404.
- Incohérence à corriger au déploiement : Cloudflare redirige `histae.com` vers `www.histae.com`, alors que les balises canoniques et le sitemap du site en ligne utilisent encore le domaine sans www. La configuration Nginx du dépôt redirigeait également dans le sens opposé.
- L’accueil `https://www.histae.com/` renvoie actuellement une redirection 302 vers `http://www.histae.com/fr/`. Cette étape HTTP est à supprimer.

## Corrections dans le projet

- Domaine canonique unique : `https://www.histae.com`, cohérent avec la redirection publique existante. Les métadonnées, les données structurées, le sitemap et robots.txt utilisent cette origine.
- Redirection Nginx du domaine sans www vers www. Les redirections locales restent relatives avec `absolute_redirect off`, pour conserver HTTPS lorsque Nginx est derrière le proxy.
- Contrôle de l’export étendu aux 44 pages : langues, canonicals, hreflang réciproques, titres, descriptions, directives robots, navigation, liens juridiques et tableau de confidentialité. Le sitemap est vérifié contre les 28 URLs canoniques attendues.
- Les 16 pages juridiques sont accessibles depuis le footer dans chaque langue. Elles restent en `noindex, follow` et hors sitemap pendant leur statut de brouillon, comme indiqué dans les sources. Leur finalisation demandera de revoir cette exclusion.

## Après déploiement

1. Vérifier que `https://www.histae.com/fr/` indique bien cette même URL comme canonique, et que le domaine sans www redirige vers www.
2. Vérifier que l’accueil ne renvoie plus vers une adresse HTTP.
3. Soumettre `https://www.histae.com/sitemap.xml` dans Google Search Console. Une propriété de domaine `histae.com` couvre les deux hôtes ; une propriété de préfixe doit correspondre à `https://www.histae.com/`.
4. Inspecter les pages d’accueil `/fr/`, `/en/`, `/es/` et `/it/` : test de l’URL publiée, accès autorisé aux robots, canonique déclarée et canonique choisie par Google. Demander une nouvelle indexation des pages importantes après le déploiement.

Ces contrôles vérifient l’aptitude technique à l’indexation. Ils ne confirment pas l’état réel dans votre compte Search Console, qui n’a pas été consulté, et ne garantissent pas que Google indexera toutes les pages.

Références : [versions linguistiques](https://developers.google.com/search/docs/specialty/international/localized-versions), [sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), [canonicals](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls).
