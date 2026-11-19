# Website account management

[Documentation](../README.md#documentation) · [Deployment](deployment.md#api-routing)

The only authenticated website journey is `/{locale}/account/data/`. It lets existing users
remove their photo, saved location or sensitive profile data, or request account erasure.
Public instructions, retention information and support remain available without signing in.
Neither completed onboarding nor a subscription is required.

## Authentication and requests

Users enter their existing UUID and phone number, then verify a one-time SMS code. The API
sets a thirty-minute HttpOnly session cookie. Account identifiers, phone numbers, SMS codes
and deletion tokens are not written to localStorage or sessionStorage. SMS validation proves
access to the phone number, not civil identity or actual age.

`lib/web-client.ts` owns transport, cancellation, the 25-second deadline and typed failures.
Only the `account` and `privacy` scopes are supported. Requests stay on the same origin,
reject redirects, include same-origin credentials and bypass caches. `lib/account-data.ts`
validates the responses; `hooks/use-account-data.ts` owns the interaction state.

The current API retains historical configuration names: `WEB_BILLING_ORIGIN` must equal the
website origin, and the cookie is `__Host-histae_billing` in HTTPS (`histae_billing` in local
HTTP development). These names are part of the API authentication contract, not a website
payment feature. Account/privacy handlers work with `WEB_BILLING_ENABLED=false`. Do not
rename the cookie in website documentation without a matching API change.

## Supported operations

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/api/web/account/otp/send` | Request an SMS challenge for an existing account |
| POST | `/api/web/account/otp/verify` | Validate the SMS code and establish the session |
| GET / DELETE | `/api/web/account/session` | Check the session / sign out |
| DELETE | `/api/web/privacy/data` | Remove `photo`, `location` or `sensitive_profile` data |
| POST | `/api/web/privacy/deletion-token` | Issue a one-time account-deletion confirmation token |
| DELETE | `/api/web/privacy/account` | Accept background erasure and expire the session |

Deletion requires a separate confirmation by typing HISTAE. A successful account request
returns `202` and an in-progress receipt, not proof that all background cleanup has finished.
A lost destructive response is never retried automatically or shown as confirmed success.
Session expiry returns the user to sign-in. Sign-out and erasure do not require browser storage.

## Purchases and deployment

Premium is purchased and managed only through the mobile app and its Apple/Google store.
Public plan cards show reference EUR prices, link to app availability and make no catalogue or
session requests. Store help links open the official subscription settings. Account deletion does not cancel those
store subscriptions automatically.

Deploy the fresh export and generated security headers together, replacing the old artifact.
The outer proxy must forward only the account/privacy web scopes needed by the site, preserve
Origin and cookie headers and bypass caches. Remove any former website-payment proxy rules.
The retired localized and neutral payment pages must return 404. The postbuild check and
export suite reject leftover pages, including slash and index.html variants.

Run the account, web-client, security, marketing and export regression tests documented in
[Development](development.md#checks). They use synthetic responses and do not send SMS or
perform production account deletion. Verify the deployed API origin, cookies and headers separately.
