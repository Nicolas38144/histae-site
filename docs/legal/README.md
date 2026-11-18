# Legal content workflow

[Documentation](../../README.md#documentation)

This directory contains public legal content and its developer documentation. The four source
app documents and two compliance policies are maintained in French, English, Spanish and Italian.
Their publication languages must remain intact when the developer documentation is edited in English.

## Sources and public routes

French originals are in this directory. Translations are in `en/`, `es/` and `it/`, with the same
source filenames. `config/site.json` maps documents to stable public route identifiers;
`lib/legal-documents.ts` loads the corresponding Markdown at build time.

| Source filename | Public route under `/{locale}/legal/` | API variable prefix |
| --- | --- | --- |
| `conditions-utilisation.md` | `terms-of-use/` | `TERMS_OF_SERVICE` |
| `politique-confidentialite.md` | `privacy-policy/` | `PRIVACY_POLICY` |
| `consentement-donnees-sensibles.md` | `sensitive-data-consent/` | `SENSITIVE_DATA_CONSENT` |
| `consentement-localisation.md` | `location-consent/` | `LOCATION_CONSENT` |
| `politique-utilisation-acceptable.md` | `acceptable-use-policy/` | No separate API variable |
| `protocole-forces-ordre.md` | `law-enforcement-policy/` | No separate API variable |

Each of the four API prefixes has `_VERSION` and `_URL` settings. Do not rename sources or public routes as part
of a documentation cleanup. The footer and language selector link to rendered HTML pages.
Retired French route aliases return 404.

The public support and privacy contact is [support.histae@gmail.com](mailto:support.histae@gmail.com).
The footer and subscription help use `supportEmail` in `config/site.json`; keep the contact links
in all four document languages and the app's `SUPPORT_EMAIL` aligned when it changes.

## Review and publication

Public draft banners have been removed. Missing information uses the localized equivalent of
“Validation in progress.” This wording does not mean the documents have been approved. The pages
remain `noindex, follow` and are excluded from the sitemap.

Use Histae as the service/publisher name; keep the publisher/controller's legal identity and address
separately marked as pending until the owner supplies them. Do not replace approval, version,
retention or contractual placeholders with the brand name.

## Public policies

All six legal documents appear in the footer in French, English, Spanish and Italian. The
acceptable-use and law-enforcement policies remain part of the service rules, including the
18+ restriction, prohibited content, reports, moderation, appeals and official requests.
Their publication does not change API consent versions or establish legal approval.

Run `pnpm exec playwright test tests/legal-policies.spec.ts` to check all six public documents,
localized navigation, cross-links and pending-review notices without signing in or JavaScript.
The publisher/controller identity, version approval and final mobile subscription terms still
require completion. An operational owner must validate request authentication, secure
transmission, preservation and logging procedures before representing them as operational.

The website supports account/data management only. Purchases and subscription management take
place through the mobile app and its Apple/Google store. The privacy policy describes the
remaining account-authentication cookie; no payment retry storage remains in the website.
See the [account guide](../account.md) for its API contract and deployment requirements.

## Finalization checks

Before treating the content as finalized, confirm the publisher and controller identity, contacts,
hosting and processors, transfers, retention periods and the actual product and payment flows.
Have the text, translations and consent wording reviewed by the responsible legal/privacy owner.
`LEGAL_REVIEW_REFERENCE` must identify real approval rather than a fabricated placeholder.

Publish reviewed text at stable HTTPS HTML URLs. Align each API version and URL with what users
actually see, keep prior versions available through the agreed process and use a new version when
the applicable content changes substantially. Reassess indexing explicitly after approval.
Website publisher information and any non-essential tracking choices require their own assessment;
they are not replaced by these four app documents.

## Product sources to reconcile

See the [4 November 2026 API alignment review](api-alignment.md) for factual corrections, source
references and outstanding operational/legal decisions. Keep age/identity checks, photo moderation,
approximate presence, report/appeal procedures and provider prices aligned across all four languages.

Use the API [HTTP contract](../../../histae-api-rust/docs/http-contract.md),
[continuation and rewards guide](../../../histae-api-rust/docs/continuation-and-rewards.md) and
[billing guide](../../../histae-api-rust/docs/store-billing.md), together with the current privacy
maintenance implementation and actual provider configuration. These are inputs for review, not
proof of legal compliance.

Keep translations aligned when changing continuation decisions, per-participant credit use,
rewarded advertising, retention or payments. Mobile purchases use Apple/Google; website account
management uses UUID/phone/SMS authentication. Documentation edits do not change published API consent
versions, advertising settings or legal approval references.

## Existing drafting references

- [CNIL: transparency and information](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence)
- [CNIL: consent](https://www.cnil.fr/fr/les-bases-legales/consentement)
- [CNIL: mobile geolocation](https://www.cnil.fr/fr/geolocalisation-applications-mobiles-quelles-regles)
- [CNIL: dating applications and privacy](https://www.cnil.fr/fr/sites-et-applications-de-rencontres-comment-proteger-votre-intimite)
- [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=en)
- [Google: rewarded advertising](https://support.google.com/admob/answer/7313578?hl=en)
- [Google: UMP for Flutter](https://developers.google.com/admob/flutter/privacy)
