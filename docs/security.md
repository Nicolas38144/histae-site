# Website security

[Documentation](../README.md#documentation) · [Deployment](deployment.md)

## Boundary

Production serves static HTML, scripts and assets through Caddy. Next.js runs only for local
development and builds. SMS, sessions, authorization, rate limits and payments belong to the
Rust API. Public source availability is not evidence that an independent audit has passed.

The billing client uses same-origin cookies, no-store requests and rejects HTTP redirects.
A 25-second deadline remains active alongside caller cancellation. Checkout and portal URLs
must have their exact approved Stripe HTTPS host, without credentials or custom ports.
Retry keys remain associated with the account and formula; they do not prove identity.
No browser return URL or session_id parameter grants Premium access.

The Rust web handlers were read: OTP send/verify and logout call validate_origin; Checkout
and portal call payer, which checks the exact enabled origin and authenticated session.
Cookies are HttpOnly, SameSite=Strict and host-scoped with Secure in the production configuration.
These observations are a code review, not a test of the deployed API. No API tests or real
SMS, payment or production account operations were run for this website change.

## Static content security policy

The postbuild step scans the final HTML and computes SHA-256 hashes of its exact inline
script text. `.generated/security-headers.caddy` maps each exported path, trailing-slash
variant and index.html path to its policy. Unknown paths use the exported 404 page policy.
Headers are limited to 7,500 bytes per page. The CSP allows same-origin external scripts
and the page's approved hashes, with no unsafe-inline or unsafe-eval for scripts. Inline
event handlers are blocked through script-src-attr. Inline styles remain allowed because
the generated interface uses them; this is distinct from script execution.

The Caddyfile imports the generated map. The Dockerfile copies it from the same build as
the HTML. Deploy them atomically, including on rollbacks; never edit the HTML afterwards
without regenerating hashes. Do not add a fixed nonce or reintroduce an unsafe-inline
fallback. Missing generation makes the image/configuration fail rather than weaken policy.
Preserve the CSP through the outer proxy/CDN and keep cached HTML paired with its headers.

JSON-LD is serialized with literal less-than characters escaped, so text cannot close its
script element and create another HTML element. This defense is retained alongside CSP.

## Dependencies and environment files

The 2026-10-14 Next.js security release was checked against the official advisory. Next.js
and eslint-config-next are pinned to 16.4.1; React and React DOM to 19.2.9. The Next.js-resolved
Sharp version is 0.35.5. The static runtime does not expose a Next.js server, but keeping
the build and development dependencies patched is still required.

On 2026-10-23, `pnpm audit --prod --audit-level=high` reported no known vulnerabilities.
The full audit still reports GHSA-vfj7-8cjw-p6xm in braces 3.0.3, reached through the Next.js
ESLint plugin's glob tooling. No patched version is published in the advisory. It parses
repository-controlled lint patterns, not website visitor input, and is not shipped as a
server in the static Caddy image. Keep the finding visible, do not accept untrusted glob
patterns, and update the dependency when an upstream fix is available. This is not an
assertion that the dependency is fixed or that a registry scan is a complete security audit.

`.gitignore` and `.dockerignore` exclude .env and .env.*. No example environment file is
created. Ignore rules cannot remove a file already committed or revoke a leaked secret:
any suspected historical exposure requires a separate review and rotation. No Git history
or private environment content was examined by this change.

References: [Next.js security release](https://nextjs.org/blog/nextjs-security-update-october-14-2026),
[braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm),
[CSP script hashes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src).

## Checks

```bash
pnpm build
pnpm exec playwright test
pnpm exec playwright test --config=playwright.export.config.ts
pnpm audit --prod --audit-level=high
pnpm audit --audit-level=high
```

The export suite serves the built files with the generated policies on localhost, checks
hashes and header size, exercises hydration in four languages and verifies that injected
inline scripts/event handlers are blocked. It uses synthetic API responses and a local
Node test server. It does not validate the Caddy parser, real Stripe or the CDN configuration.

For the actual runtime, build and validate the image with Docker:

```bash
docker build -t histae-site .
docker run --rm --entrypoint caddy histae-site validate --config /etc/caddy/Caddyfile --adapter caddyfile
```

Native Caddy validation was not run locally: Docker/Caddy were not installed, and a temporary
download failed its published checksum comparison and was not extracted or executed.
The runtime version and pinned container digest were not changed. After deployment, verify
the actual response CSP, no-store/referrer headers, cookies and API origin checks. Exercise
real provider flows only in the intended test environment.
