# Histae Site — feuille de route

État au 5 septembre 2026.

Cette feuille de route contient uniquement les travaux encore ouverts de la vitrine publique. Le site est un export
statique Next.js, sans dépendance d'exécution à l'API. Il présente Histae en français, anglais, espagnol et italien.

Les décisions juridiques et les promesses produit ne doivent pas être inventées dans le code. Leur propriétaire doit
valider une source de référence avant publication ; le site se charge ensuite de la restituer fidèlement.

## Périmètre et principes

- Le site reste consultable si l'API, le dashboard ou les applications mobiles sont indisponibles.
- Aucun formulaire, compte, cookie non essentiel, mesure d'audience ou appel tiers n'est ajouté sans besoin explicite,
  analyse des données transmises et mise à jour des textes applicables.
- Les informations commerciales et fonctionnelles sont versionnées avec le site plutôt que chargées depuis l'API à
  chaque visite.
- Une traduction n'est publiée que si ses pages, liens, métadonnées et textes structurants sont complets.
- Le build local ne prouve pas les en-têtes, redirections, performances ou règles de cache du véritable hébergement.

## État acquis

- export statique Next.js avec sept routes dans quatre langues, soit 28 pages localisées ;
- navigation localisée, sélecteur de langue et redirection vers la langue par défaut ;
- canonical, `hreflang`, `x-default`, métadonnées sociales, sitemap, robots et manifest ;
- contrôle post-build de la langue du document, des canonical, des alternates, des liens de langue et de l'unique `h1` ;
- contenu responsive pour accueil, fonctionnalités, tarifs, sécurité, FAQ, à propos et téléchargement ;
- catalogue marketing centralisé dans `config/site.json` ;
- aucune dépendance actuelle du navigateur à l'API et aucun mécanisme de mesure d'audience identifié.

Au 5 septembre 2026, les montants et limites déclarés dans `config/site.json` correspondent au catalogue initial de
l'API : gratuit, Premium à 5 € par mois ou 30 € par an, essai de 30 jours et trois continuations hebdomadaires pour
le plan gratuit. Cette concordance doit être vérifiée à chaque changement, pas supposée durable.

## Niveaux de priorité

| Niveau | Signification |
| --- | --- |
| P0 | Information publique potentiellement trompeuse, manquante ou juridiquement sensible à qualifier immédiatement |
| P1 | Requis avant le lancement public des applications |
| P2 | Requis pour fiabiliser les publications et l'exploitation dans la durée |
| P3 | Optimisation à réaliser seulement après mesure d'un besoin réel |

## Synthèse des lots

| Référence | Résultat attendu | Priorité | Dépendances | État |
| --- | --- | --- | --- | --- |
| S01 | Informations légales validées et accessibles | P0 | Éditeur, DPO/juriste | En attente de décisions |
| S02 | Promesses et tarifs alignés avec le produit | P0 continu | API, mobile, produit | Contrôle manuel actuel |
| S03 | Parcours de lancement et de support opérationnels | P1 | Fiches App Store/Play Store | Bloqué par le lancement |
| S04 | Build et contenu localisé vérifiés automatiquement | P1/P2 | Outillage de test | Partiellement couvert |
| S05 | Site accessible, rapide et compatible | P1 | Design, navigateurs cibles | À mesurer |
| S06 | Hébergement public sécurisé, observable et réversible | P1 | Infrastructure | À valider sur la cible |

## S01 — Informations légales et contacts

### État à confirmer

La page « Sécurité et confidentialité » explique le produit ; elle ne remplace pas nécessairement les mentions
légales, la notice de confidentialité ou les conditions du service. La liste exacte, le responsable de traitement,
les coordonnées, les bases légales et les traductions doivent être validés par les personnes compétentes.

### Travail

- [ ] Inventorier ce que le site hébergé traite réellement : journaux du serveur/CDN, adresses IP, cookies, polices,
  ressources tierces, supervision et éventuels liens mesurés.
- [ ] Faire valider puis publier les mentions légales adaptées à l'entité éditrice et à l'hébergeur.
- [ ] Faire valider puis publier une notice de confidentialité cohérente avec l'inventaire réel du site.
- [ ] Publier les conditions applicables au service lorsque leur version produit et leur date d'entrée en vigueur sont
  arrêtées ; ne pas recopier une version de travail de l'API.
- [ ] Ajouter les coordonnées validées pour support, exercice des droits et signalement de sécurité.
- [ ] Décider, à partir des mécanismes réellement déployés, si une politique ou un consentement cookies est requis ;
  ne pas ajouter de bandeau décoratif en l'absence de choix à recueillir.
- [ ] Ajouter les routes légales dans la configuration commune, le footer, le sitemap et les quatre catalogues de
  traduction sans créer de lien mort.
- [ ] Afficher version ou date d'effet lorsque nécessaire et définir comment une ancienne version peut être retrouvée.

### Validation

- Les textes ont un auteur métier identifié et une validation datée.
- Chaque page est accessible depuis le footer, au clavier, dans toutes les langues annoncées.
- Les descriptions correspondent aux requêtes réseau et données constatées sur la version hébergée.
- Aucune case, bannière ou finalité de collecte inexistante n'est présentée à l'utilisateur.

### Critère de fin

Les informations applicables au site réel sont validées, publiées, localisées et vérifiables ; toute nouvelle collecte
est bloquée par la procédure de publication tant que ces documents ne sont pas réévalués.

## S02 — Cohérence éditoriale, fonctionnelle et commerciale

### Risque traité

Le catalogue et les textes du site sont volontairement statiques. Ce choix protège la disponibilité, mais permet une
divergence silencieuse avec l'API ou les applications mobiles.

### Travail

- [ ] Désigner une source et un propriétaire pour tarifs, devise, essai, quotas et liste des fonctionnalités.
- [ ] Vérifier `config/site.json` contre le catalogue destiné à la release, sans rendre le site dépendant de l'API en
  production.
- [ ] Vérifier les affirmations sur découverte, consentements, localisation, révélation des photos, modération,
  abonnements, rétention et droits avec la version réellement livrée.
- [ ] Maintenir une checklist de release indiquant version mobile, version API et date de validation éditoriale.
- [ ] Ajouter un contrôle automatisé contre un artefact de contrat versionné si l'API en fournit un ; un échec doit
  bloquer le build de publication, jamais la consultation du site déjà déployé.
- [ ] Vérifier la parité structurelle des clés de traduction et faire relire les textes visibles par un locuteur
  compétent avant de déclarer une langue supportée.
- [ ] Retirer ou reformuler rapidement une fonctionnalité retardée plutôt que laisser une promesse prospective ambiguë.

### Validation

- Comparaison documentée des valeurs commerciales avec l'API de la release.
- Revue des pages et FAQ dans les quatre langues, y compris métadonnées et données structurées.
- Aucun contenu ne décrit comme disponible une fonctionnalité uniquement prévue.
- Le site continue de se construire et de fonctionner sans API joignable.

### Critère de fin

Chaque publication possède une validation produit identifiable et un contrôle reproductible des informations
commerciales et fonctionnelles sensibles.

## S03 — Lancement, téléchargement et support

### Travail

- [ ] Représenter explicitement l'état de chaque plateforme : prochainement, test limité ou disponible.
- [ ] Ajouter dans la configuration les liens App Store et Play Store officiels, sans URL factice ni redirection non
  maîtrisée.
- [ ] Remplacer les appels à l'action « bientôt disponible » seulement pour la plateforme réellement publiée.
- [ ] Ajouter badges et visuels conformes aux règles des stores, optimisés localement et accompagnés de textes
  alternatifs pertinents.
- [ ] Vérifier que QR codes et liens profonds, s'ils sont ajoutés, pointent vers des domaines ou fiches contrôlés et
  possèdent une destination de secours.
- [ ] Définir les parcours publics de support, exercice des droits et signalement d'un problème de sécurité.
- [ ] Mettre à jour FAQ, données structurées, métadonnées sociales, captures et statut du footer le jour du lancement.
- [ ] Préparer une procédure de retrait d'un lien si une fiche store est suspendue ou compromise.

### Validation

- Tous les liens sont contrôlés automatiquement et vérifiés sur appareils réels.
- Une plateforme non disponible n'affiche jamais un bouton de téléchargement actif.
- Les pages restent compréhensibles sans image et utilisables au clavier.
- Aucun visuel ne contient de donnée personnelle ou de compte de test réutilisable.

### Critère de fin

Chaque visiteur est dirigé vers la bonne version officielle, ou reçoit un état d'indisponibilité honnête, et dispose
d'un canal de support adapté.

## S04 — Automatisation de la qualité et des traductions

### Couverture déjà présente

Le script `scripts/fix-static-seo.mjs` contrôle déjà les 28 pages pour `lang`, canonical, `hreflang`, `x-default`,
description, changement de langue et unicité du `h1`. Ces contrôles doivent être conservés ; ils ne sont pas à recréer.

### Travail restant

- [ ] Faire échouer le build si les catalogues de traduction n'ont pas la même structure ou si une valeur requise est
  vide.
- [ ] Parcourir l'export statique pour détecter liens internes, images, manifest, robots et sitemap manquants ou
  incohérents.
- [ ] Valider la syntaxe et les URLs des données structurées, ainsi que l'image Open Graph réellement produite.
- [ ] Ajouter des tests ciblés pour la redirection racine, les locales inconnues, les slashes finaux et la conservation
  de la route lors d'un changement de langue.
- [ ] Ajouter quelques parcours navigateur pour navigation principale, dialogue de langue, footer et appels à l'action.
- [ ] Ajouter un script unique de validation réunissant typecheck, lint, build et tests ; ajouter un audit des
  dépendances de production sans l'exécuter au chargement du site.
- [ ] Documenter la méthode de prévisualisation et la vérification des 28 pages générées avant publication.

### Critère de fin

Une traduction incomplète, un lien interne cassé, une métadonnée incohérente ou une régression de navigation empêche
automatiquement la publication.

## S05 — Accessibilité, performance et compatibilité

### Travail

- [ ] Définir les navigateurs et appareils réellement supportés.
- [ ] Tester navigation clavier, ordre du focus, fermeture du dialogue de langue, lien d'évitement, titres, landmarks,
  zoom à 200 %, contrastes et préférences de réduction des animations.
- [ ] Faire une vérification avec lecteur d'écran sur les parcours principaux ; l'audit automatique ne suffit pas.
- [ ] Mesurer Lighthouse et les Core Web Vitals sur l'artefact hébergé, en mobile et desktop.
- [ ] Définir des budgets mesurables pour JavaScript, CSS, images, polices et évolution de mise en page.
- [ ] Vérifier dimensions, compression, format, chargement et texte alternatif des visuels définitifs.
- [ ] Tester connexion lente, JavaScript retardé et indisponibilité d'une ressource sans rendre le contenu principal
  inaccessible.
- [ ] Corriger les régressions avant d'ajouter animations, scripts marketing ou ressources tierces.

### Critère de fin

Les pages essentielles respectent les objectifs d'accessibilité retenus, restent rapides sur un téléphone représentatif
et ne dépassent pas les budgets publiés.

## S06 — Sécurité, hébergement et exploitation

### Particularité de l'export statique

Avec `output: "export"`, les en-têtes de production ne sont pas fournis par le processus Next.js : ils doivent être
configurés sur le serveur, le CDN ou le reverse proxy qui sert le dossier `out`. Leur présence doit être vérifiée sur
les réponses publiques, pas déduite de `next.config.ts`.

### Travail

- [ ] Choisir une URL canonique unique entre `histae.com` et `www.histae.com`, puis rediriger l'autre origine en
  conservant chemin et langue.
- [ ] Vérifier HTTPS, certificat, renouvellement, redirections et absence de contenu mixte.
- [ ] Définir puis tester CSP, HSTS, anti-framing, `nosniff`, politique de référent et permissions navigateur sur
  toutes les réponses, y compris erreurs et redirections.
- [ ] Vérifier que `out` ne contient ni secret, source map involontaire, URL interne, fichier de développement ou
  métadonnée de dépôt.
- [ ] Définir les règles de cache : HTML rapidement remplaçable, actifs immuables fortement cachés, documents
  juridiques invalidables lors d'une mise à jour.
- [ ] Construire un artefact immuable, conserver la version précédente et répéter un retour arrière.
- [ ] Réutiliser la supervision retenue pour Histae afin de contrôler disponibilité, certificat et pages localisées,
  sans ajouter par défaut un nouveau fournisseur ni tracer les visiteurs.
- [ ] Examiner régulièrement les dépendances et documenter la procédure de correction urgente.
- [ ] Si une audience devient réellement nécessaire, définir métriques minimales, durée, accès et base juridique avant
  de choisir un outil ; conserver l'absence de mesure par défaut.

### Validation

- Contrôle HTTP automatisé depuis l'extérieur sur origine canonique, redirection, en-têtes et pages représentatives.
- Inspection réseau confirmant l'absence d'appel tiers ou de collecte non documentée.
- Déploiement puis retour arrière réalisés à partir d'artefacts identifiables.
- Une indisponibilité simulée déclenche l'alerte attendue sans dépendre du site lui-même.

### Critère de fin

La version publique est sécurisée par l'hébergement réel, observable sans suivi individuel et restaurable rapidement à
partir d'un artefact connu.

## Dépendances et hors périmètre

- Le site n'appelle pas l'API en production et ne doit pas devenir un second client métier.
- Le téléchargement, les notifications, l'authentification et les comptes appartiennent aux applications mobiles et à
  l'API.
- Le dashboard administrateur ne doit jamais être lié depuis la navigation publique.
- Les choix de consentement, conservation, sous-traitants et transferts relèvent des décisions juridiques R13 de l'API.
- Une liste d'attente, newsletter, formulaire de contact, analytics ou chat ne fait pas partie du périmètre actuel.
  Chacun constituerait une nouvelle collecte à concevoir séparément.

## Ordre conseillé

1. S01 et S02 immédiatement, puisque le site est déjà public.
2. S04 pour empêcher les régressions pendant les travaux suivants.
3. S05 et S06 sur l'hébergement réel avant le lancement mobile.
4. S03 lorsque les fiches stores, visuels et canaux de support sont prêts.

## Définition de fini commune

Un lot n'est terminé que si :

- son contenu possède un propriétaire et une source validée ;
- les quatre langues annoncées sont complètes ou la langue incomplète n'est pas publiée ;
- navigation clavier, mobile et desktop ont été vérifiées ;
- canonical, alternates, sitemap et données structurées restent cohérents ;
- aucune nouvelle requête tierce ou collecte n'est introduite implicitement ;
- `pnpm run typecheck`, `pnpm run lint`, `pnpm run build` et les tests concernés réussissent ;
- le comportement est vérifié sur l'artefact ou l'hébergement réel lorsque le lot concerne la production ;
- la roadmap et le README sont ajustés sans conserver un journal détaillé des travaux terminés.

Après validation, conserver les règles durables dans la documentation appropriée et retirer le détail terminé de cette
feuille de route.
