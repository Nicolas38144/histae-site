# Legal content workflow

[Documentation](../../README.md#documentation)

This directory contains public legal content and its developer documentation. The four source
documents are maintained in French, English, Spanish and Italian. Their publication languages
must remain intact when the developer documentation is edited in English.

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

Each prefix has API `_VERSION` and `_URL` settings. Do not rename sources or public routes as part
of a documentation cleanup. The footer and language selector link to rendered HTML pages. Caddy
permanently redirects legacy French route names while retaining the locale and query string.

## Review and publication

Public draft banners have been removed. Missing information uses the localized equivalent of
“Validation in progress.” This wording does not mean the documents have been approved. The pages
remain `noindex, follow` and are excluded from the sitemap.

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

Use the API [HTTP contract](../../../histae-api-rust/docs/http-contract.md),
[continuation and rewards guide](../../../histae-api-rust/docs/continuation-and-rewards.md) and
[billing guide](../../../histae-api-rust/docs/store-billing.md), together with the current privacy
maintenance implementation and actual provider configuration. These are inputs for review, not
proof of legal compliance.

Keep translations aligned when changing continuation decisions, per-participant credit use,
rewarded advertising, retention or payments. Mobile purchases use Apple/Google; the website uses
Stripe and UUID/phone/SMS authentication. Documentation edits do not change published API consent
versions, advertising settings or legal approval references.

## Existing drafting references

- [CNIL: transparency and information](https://www.cnil.fr/fr/conformite-rgpd-information-des-personnes-et-transparence)
- [CNIL: consent](https://www.cnil.fr/fr/les-bases-legales/consentement)
- [CNIL: mobile geolocation](https://www.cnil.fr/fr/geolocalisation-applications-mobiles-quelles-regles)
- [CNIL: dating applications and privacy](https://www.cnil.fr/fr/sites-et-applications-de-rencontres-comment-proteger-votre-intimite)
- [GDPR text](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=en)
- [Google: rewarded advertising](https://support.google.com/admob/answer/7313578?hl=en)
- [Google: UMP for Flutter](https://developers.google.com/admob/flutter/privacy)
