# Brouillons des documents juridiques Histae

Ces quatre fichiers sont des **sources de travail en français**, pas des textes validés pour la production :

| Fichier | Variables API correspondantes |
| --- | --- |
| `conditions-utilisation.md` | `TERMS_OF_SERVICE_VERSION`, `TERMS_OF_SERVICE_URL` |
| `politique-confidentialite.md` | `PRIVACY_POLICY_VERSION`, `PRIVACY_POLICY_URL` |
| `consentement-donnees-sensibles.md` | `SENSITIVE_DATA_CONSENT_VERSION`, `SENSITIVE_DATA_CONSENT_URL` |
| `consentement-localisation.md` | `LOCATION_CONSENT_VERSION`, `LOCATION_CONSENT_URL` |

## Intégration au site

Les originaux français restent dans ce dossier. Leurs traductions de travail sont dans `en/`, `es/` et `it/`, avec les mêmes noms de fichiers. Toute modification du français doit être répercutée dans les traductions et leur validation.

Le site génère une page HTML pour chaque document et langue sous `/{lang}/legal/{nom-du-fichier}/`, accessible depuis le footer. Le sélecteur de langue conserve le document consulté. Les textes sont lus directement depuis ces fichiers au moment de la compilation.

Ces pages conservent les mentions de brouillon et les champs à compléter. Elles sont en `noindex, follow` et absentes du sitemap tant que les textes ne sont pas finalisés. Après validation des textes et des traductions, adapter les métadonnées de la page juridique et le sitemap pour permettre leur indexation.

## Avant publication

1. Remplacer tous les marqueurs `[À COMPLÉTER]` et `[À VALIDER]`. Vérifier l’identité de l’éditeur et du responsable de traitement, les contacts, l’hébergeur, les sous-traitants, les transferts éventuels, toutes les durées de conservation et le parcours commercial réel.
2. Faire valider les quatre textes et les libellés de consentement par une personne compétente en droit et protection des données. `LEGAL_REVIEW_REFERENCE` doit renvoyer à **cette validation réelle** ; ne pas lui donner une valeur fictive pour démarrer la production.
3. Publier chaque texte sous une URL HTTPS stable et lisible dans le site Next.js. Un fichier `.md` placé tel quel dans `public/` ne constitue pas, à lui seul, une page HTML adaptée aux utilisateurs : rendre le Markdown dans une page du site et conserver une copie des versions antérieures.
4. Reporter dans `.env` de l’API la version exacte du texte publié et son URL absolue HTTPS. Une modification substantielle doit donner une nouvelle version et déclencher le parcours de présentation/acceptation approprié.
5. Le site vitrine existe en français, anglais, espagnol et italien. L’API ne fournit actuellement qu’une URL par document : choisir une page stable avec sélection de langue, ou faire évoluer ce contrat avant une publication multilingue. Vérifier que la version enregistrée correspond bien au texte présenté dans chaque langue.
6. Prévoir aussi des **mentions légales du site** et, si des traceurs non essentiels sont utilisés, leur information et leurs choix propres. Ces sujets ne sont pas couverts par les quatre variables API ci-dessus.

Les brouillons s’appuient sur les contrats actuels de `docs/http-contract.md`, les règles de purge de `src/privacy/maintenance.rs` et les descriptions publiques du site. Vérifier à nouveau ces sources au moment de la mise en ligne.

## Références de rédaction

- [CNIL — information des personnes et transparence](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence)
- [CNIL — consentement](https://www.cnil.fr/fr/les-bases-legales/consentement)
- [CNIL — géolocalisation des applications mobiles](https://www.cnil.fr/fr/geolocalisation-applications-mobiles-quelles-regles)
- [CNIL — applications de rencontre et vie privée](https://www.cnil.fr/fr/sites-et-applications-de-rencontres-comment-proteger-votre-intimite)
- [RGPD, notamment articles 7, 9 et 13](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=fr)
