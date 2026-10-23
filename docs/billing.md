# Website billing

[Documentation](../README.md#documentation) · [Deployment](deployment.md)

Stripe is used on the website. Android and iOS purchases use their respective stores.
The website signs users into an existing Histae account; it does not register new accounts.

## Authentication and requests

The subscription page is `/{locale}/billing/subscribe/`. Premium pricing links can preselect
`?period=monthly` or `?period=annual`; the selection survives the authentication flow.

The user supplies an account UUID and matching phone number, then confirms an SMS code.
The API sets an HttpOnly session cookie. The site does not store JWTs, OTPs or phone numbers in
browser storage. The API checks account eligibility and onboarding before allowing a purchase.

All requests use `/api/web/billing/*` on the site's origin:

| Operation | Method and endpoint |
| --- | --- |
| Load available offers | `GET /api/web/billing/plans` |
| Read session and subscription | `GET /api/web/billing/session` |
| Request and verify the SMS code | `POST /api/web/billing/otp/send`, `POST /api/web/billing/otp/verify` |
| Open Checkout | `POST /api/web/billing/checkout` |
| Open the customer portal | `POST /api/web/billing/portal` |
| Sign out | `DELETE /api/web/billing/session` |

Checkout sends only `billing_period` and an `Idempotency-Key` UUID. The API selects the Stripe price
and returns `201 { session_id, url, expires_at }`. Preserve the complete URL, including its fragment
after `#`. The client accepts HTTPS URLs on `checkout.stripe.com` for Checkout and
`billing.stripe.com` for the portal. Never include real Checkout links or secrets in documentation.

## Retries and formula changes

Session storage keeps a separate retry key for each formula and the associated account UUID.
The previous single-formula format is migrated without discarding its key. Signing out or confirming
Premium access clears the saved keys.

Retry an uncertain request with the same key and formula. Do not replace a key just because a
network request failed. Closing the Stripe page leaves its session open.

The corresponding API change expires a known open session for the other formula before creating
its replacement. Creating, completed or uncertain attempts remain protected against another purchase.
This behavior requires deployment of the matching API version as well as the website.

When the API returns `idempotency_key_consumed`, the client rereads the subscription. If Premium
is not confirmed, it clears only that formula's key and retries once. Other conflicts and network
failures do not trigger a new purchase automatically. Native subscriptions show their official
store-management link rather than a second Stripe purchase form.

## Configuration

In development, `pnpm dev` proxies the same-origin billing routes to `http://127.0.0.1:8080`.
Override the upstream with `HISTAE_API_DEV_UPSTREAM` when needed. It is a development server setting,
not a browser API URL or a production proxy configuration.

The API requires `WEB_BILLING_ENABLED=true` and `WEB_BILLING_ORIGIN` matching the browser's exact
origin, including the development port when applicable. Stripe keys, prices, webhook settings and
store credentials remain in the API environment. See its [Stripe guide](../../histae-api-rust/docs/billing.md)
and [store and web billing guide](../../histae-api-rust/docs/store-billing.md).

Production serves a static export. Configure the external reverse proxy and CDN as described in
[Deployment](deployment.md#api-routing). Next.js development rewrites do not exist in `out/`.

## Return pages

Public API configuration uses these neutral entry points:

```dotenv
STRIPE_CHECKOUT_SUCCESS_URL=https://www.histae.com/billing/success?session_id={CHECKOUT_SESSION_ID}
STRIPE_CHECKOUT_CANCEL_URL=https://www.histae.com/billing/cancel
STRIPE_PORTAL_RETURN_URL=https://www.histae.com/billing/return
```

Keep `{CHECKOUT_SESSION_ID}` literal. The API can select a localized return path when creating a
session. Existing sessions retain their original URLs and request parameters.

Neutral entry points choose the first supported browser language, normalize regional preferences
and fall back to French. They preserve the query string without interpreting it and use
`location.replace`. Without JavaScript, four links let the visitor choose a language.

Localized return pages explain how to check the subscription in Histae. They do not read or display
the session identifier, call the API or grant Premium. Webhooks and the API subscription projection
determine access. Returning from Stripe does not prove payment, cancellation or a portal change.

Billing pages use `noindex, follow`, `no-referrer` and `no-store`; they stay out of the sitemap.
Keep these protections through the CDN. See [development checks](development.md#checks) for simulated
tests; verify real return flows, delayed webhooks and subscription refresh separately.
