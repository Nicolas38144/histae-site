# Histae Privacy Policy

**Published version:** Validation in progress.\
**Document date:** 4 November 2026.\
**Data controller:** Histae.\
**Data controller’s legal identity and address:** Validation in progress.\
**Privacy contact:** [support.histae@gmail.com](mailto:support.histae@gmail.com)

This notice describes processing associated with the Histae app, its API and authenticated website journeys for subscriptions and account data requests. Any trackers or audience measurement tools specific to the showcase website must be assessed separately; this notice does not presume their activation.

## 1. Data and purposes

| Data concerned | Why it is used | Proposed legal basis, subject to review |
| --- | --- | --- |
| Phone number, phone number fingerprint, temporary codes, sessions | Create and secure the account, send and verify login codes | Performance of the service and account security |
| First name, declared birth date, biography, photo, traits and profile answers | Present the profile, check declared adulthood, enable discovery and moderation; without certifying identity or actual age | Performance of the service; legitimate interest in security and moderation |
| Declared sex and preferences regarding people sought | Apply mutual discovery criteria; this information may reveal sex life or sexual orientation | Separate explicit consent, subject to review of the analysis of GDPR Articles 6 and 9 |
| Centre of an approximate zone of about 5 km and update date | Calculate approximate distances and suggest profiles based on mutual criteria; received coordinates are minimised before recording presence | Separate consent to location use |
| Likes or passes, matches, agreements to reveal photos, messages, blocks | Operate the interactions requested | Performance of the service |
| Reports, moderation decisions and administrator access logs | Protect people, handle abuse and document interventions | Legitimate interest in security; legal obligation where applicable |
| Choices regarding texts and consent, with their versions and dates | Record choices, allow withdrawal and demonstrate that they have been taken into account | Compliance obligation and legitimate interest in retaining evidence, subject to review |
| Order, subscription and billing data when the paid plan is enabled | Manage purchases, payments and accounting obligations | Performance of the contract and legal obligations, to be specified at launch |
| Limited technical data necessary for operation and security | Protect the service, detect abuse and resolve incidents | Legitimate interest in security, to be documented |

The current process does not request marketing consent. Any future direct marketing or advertising use would require its own information and legal basis before activation.

## 2. Visibility and recipients

Other users see profile elements useful for discovery: first name, calculated declared age, declared sex, traits and permitted content. Received coordinates are replaced by the centre of an approximate zone of about 5 km before being recorded as presence; public distances are rounded in 5 km steps, with a minimum of 5 km. This reduces precision without guaranteeing anonymity. Exact birth dates and phone numbers are not shown to other users. The photo remains private and does not appear in the feed; within a match, it requires two photo-sharing agreements. Withdrawal hides it in subsequent reads; an already issued private link may remain usable for at most 60 seconds for new links, or until object deletion. Copies already received cannot be erased remotely.

People authorised to administer and moderate Histae have restricted access and logged sensitive consultations. Administrative access to messages requires a retained report linked to the conversation and both participants; a profile-only report is insufficient. Providers may handle SMS (Sweego), enabled payments (Stripe, Apple App Store, Google Play), hosting, technical photo conversion and storage. Conversion does not automatically analyse image content. **Validation in progress.** Each provider's identity, role and location, processor access, any transfers outside the European Economic Area and their safeguards remain to be finalised.

## 3. Retention periods

Account, profile and conversation information is retained for the life of the account, subject to applicable deletions, expirations and obligations. Closing an account immediately disables its use, then triggers technical erasure that may finish in the background; messages already exchanged may be anonymised to preserve the other participant's conversation.

Approximate presence can no longer be used for discovery after one hour without an update; maintenance purges it after 24 hours, or it is deleted when consent is withdrawn. This resource does not create a travel history. Login codes are purged on expiry. Data access logs and administrator authentication events are purged after one year; resolved reports three years after resolution; withdrawn consent five years after withdrawal; closed rights requests five years after closure. These periods describe the API's batched maintenance rules and must be reconciled with backups and applicable obligations.

**Validation in progress.** exact retention periods for inactive accounts, messages, invoices and subscriptions, backups, infrastructure logs, moderation content and any disputes; criteria for extending retention or legal archiving. The published version must give an understandable period or criterion for each category. Historical backups may still contain data from before location minimisation until their expiry; their retention periods and arrangements remain subject to review.

## 4. Your choices and rights

Acknowledging this notice does not constitute blanket consent to processing. Acceptance of the terms of use, consent to sensitive data processing and consent to location use are separate choices. Refusing or withdrawing either optional consent prevents the features that depend on it. Withdrawing sensitive data consent deletes the sex and preferences concerned; withdrawing location consent deletes the recorded location.

The account and dedicated website journey allow access, rectification, portability and erasure requests; an owner data export is also available. Restriction and objection currently have no dedicated new-request types in the API: where applicable, these rights remain exercisable through [support.histae@gmail.com](mailto:support.histae@gmail.com). Rectification requests are handled manually; closing one does not automatically update the profile. A request may require reasonable identity verification, without treating an SMS code as certification of civil identity. Legal limitations will be explained in the response; a complaint may be submitted to the [CNIL](https://www.cnil.fr/fr/plaintes).

## 5. Security, automated decisions and changes

Histae uses access controls, limits on attempts and rule-based moderation for biographies and profile answers. Discovery filters apply mutual preferences. Photos undergo neither automated content analysis nor facial recognition or identity verification; adulthood is checked against the declared date. Tools allow human review and content removal. Reporting and appeal arrangements are described in the [Acceptable Use Policy](/en/legal/acceptable-use-policy/). **Validation in progress.** The legal classification of any automated decisions producing significant effects and the corresponding additional information remain to be assessed.

A significant change to purposes, recipients, retention periods or rights will be communicated appropriately. The notice's version and effective date will remain accessible. Other mandatory information under GDPR Article 13, including transfers and the source of data when it does not come from the user, must be checked in the final version.

## Optional rewarded advertising — before activation

Google AdMob rewarded ads are planned for the mobile app, with no ads on this website. Activation requires dedicated information and separate advertising choices that can be changed or withdrawn. Watching a video or agreeing to continue does not constitute consent to tracking or personalization. The two free credits remain available without watching ads. Depending on applicable choices, the SDK may process technical identifiers, device information and advertising interactions; the precise data, recipients, transfers and safeguards must be reviewed before activation. Histae does not send the phone number, account UUID, profile, sex, preferences, precise location or messages to the ad network. A temporary random intent links the reward to the account within Histae; a signed proof and a unique transaction are required to add a credit. Internal intents and proofs are retained for up to 90 days and purged during maintenance; advertising credits expire every Monday at 00:00 UTC, including reserved credits. The latest balance and its week remain recorded until replaced or the account is erased. These data are included in the export and removed on account erasure. The other person’s individual continuation choices are not disclosed.

## Functional update, 22 October 2026 — payments

Website payment sign-in checks an existing account using its UUID, phone number and SMS code. It uses a thirty-minute HttpOnly session cookie; challenges expire within ten minutes. Maintenance removes expired sessions and challenges. Card details remain with the payment provider.

To verify Apple/Google purchases, Histae sends technical purchase references and an opaque account binding without sending profiles, messages or location. References needed for provider checks are encrypted in the database; Google tokens are indexed by a hash. Projections are included in the data export without secret tokens. Account anonymisation removes website sessions, encrypted references and account links. Minimal replay-prevention records are purged 400 days after the period ends. Imported financial reports are separate from profiles and require a reviewed accounting retention period. Recipients, roles, transfers and final retention periods remain to be completed and reviewed before publication.

## What happens to inactive conversations?

For a confirmed conversation, the inactivity period starts at mutual confirmation and resets only when a new message is sent. After 10 days the conversation is archived but remains accessible; after 23 days a warning is scheduled. At 30 days access closes and maintenance deletes the match, its messages and associated notifications. A new message before the deadline unarchives the conversation without another agreement or additional credit; reading or opening the app does not reset the period. Reports follow their own retention period and may survive match deletion. The same rule applies to Free and Premium.

## Requests from authorities

Official requests are assessed under the [Law Enforcement Policy](/en/legal/law-enforcement-policy/). Any disclosure is limited to available and necessary data, on an applicable legal basis, after verification of the authority and request. This policy is not blanket consent from the user and does not guarantee preservation or recovery of already deleted data.
