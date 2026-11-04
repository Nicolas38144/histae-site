# API and public legal content alignment — 4 November 2026

This is a factual source review, not legal approval or proof that the reviewed API is deployed.
All four languages were reviewed. Publisher/controller identity and final legal review remain
pending; the public service name is Histae. No consent version, API configuration or approval
reference was changed as part of this review.

## Corrections

| Topic | Public content after alignment | Evidence in the adjacent API repository |
| --- | --- | --- |
| Registration and age | French phone/SMS access check; age checked from declared birth date when saving the profile; no systematic ID, selfie, biometric or prior human profile verification | `docs/http-contract.md`, `src/profiles/service.rs` |
| Text moderation | Rule-based analysis of biographies and profile answers; flagged text pending review; no promise of scanning all private messages | `src/moderation/text.rs`, `src/profiles/service.rs`, `src/catalog/service.rs` |
| Photos | Technical conversion and manual review tools; no automatic content, face, age or CSAM-hash analysis; technical approval does not certify safe content or ownership | `docs/http-contract.md` (photo moderation) |
| Photo sharing | Two independent agreements, withdrawal, current replacement photo and limited lifetime of already issued links; no remote recovery of saved copies | `docs/continuation-and-rewards.md`, `docs/privacy-and-photo-security.md` |
| Location | Incoming coordinates minimised into approximate zone centres; public distance steps/minimum 5 km; zone changes limited to once per five minutes; no proof of actual GPS location | `src/profiles/location.rs`, `docs/privacy-and-photo-security.md` |
| Presence retention | No longer usable after one hour without refresh; batched purge after 24 hours; deletion on consent withdrawal; historical backups handled separately | `src/privacy/maintenance.rs`, `docs/privacy-and-photo-security.md` |
| Pause | No new discovery, likes or matches; existing conversations/subscriptions retained | `docs/http-contract.md` (discovery settings) |
| Credits | 2 weekly Free credits, optional video rewards up to stock 3, weekly expiry of advertising credits, maximum 5 confirmed Free continuations; only Free participants spend credits | `docs/continuation-and-rewards.md`, `config/site.json` |
| Premium pricing | Monthly/annual, no new free trial; actual channel catalogue and currency control the checkout price rather than hardcoded legal-copy amounts | `docs/store-billing.md` |
| Conversation expiry | 10/23/30-day sequence starts at mutual confirmation, resets only on a new message; access closes at expiry and maintenance purges content; reports have separate retention | `docs/continuation-and-rewards.md` |
| Reports and appeals | Manual responsible-person procedure, report-linked access to conversations, removal/ban/unban tools, no promised SLA or independent appeal body | `docs/http-contract.md` (administration), `docs/legal/politique-utilisation-acceptable.md` in this repository |
| Rights | API/web provide access, rectification, portability and erasure; restriction/objection remain exercisable via contact when applicable; closing a rectification request does not automatically edit the profile | `docs/http-contract.md` (privacy requests) |
| Retention clocks | Data access/admin authentication logs: one year; reports: three years after resolution; withdrawn consent and closed rights requests: five years after withdrawal/closure | `src/privacy/maintenance.rs` |
| Law enforcement | No automatic legal hold, guaranteed deleted-data recovery, precise GPS history or real-time surveillance; preserved report does not guarantee preserved conversation messages | `docs/privacy-and-photo-security.md`, `docs/continuation-and-rewards.md` |

The sensitive-data consent was reviewed and retained: separate explicit choice, reciprocal filtering,
deletion of the relevant sex/preferences on withdrawal, and independently retained consent evidence.
Child-safety disclosures now state the same age/identity and automated-image-analysis limitations.

## Outstanding owner decisions

- Supply the legal publisher/controller identity, address, hosting/processor details, transfers and
  backup retention; do not replace those missing facts with an invented legal entity.
- Finalise renewal, cancellation, refund, withdrawal, consumer mediation and legal-basis wording.
- Confirm that the documented manual reporting, appeal and authority-request procedures are staffed
  and operational. Source code provides tools, not proof of human handling or a response deadline.
- Confirm the SDK, advertising and payment providers actually enabled in production before release.
- Have the content and translations reviewed, then publish new consent versions and synchronise
  API URLs/dates through the existing workflow when required. A document date is not an approval.

## Verification

The production postbuild checks every configured legal page and locale, links, metadata and generated
CSP. `tests/legal-policies.spec.ts` checks all six documents without JavaScript or authentication,
including the new approximate-location and registration disclosures; `tests/child-safety.spec.ts`
covers the separate child-safety pages. These checks do not establish legal compliance.
