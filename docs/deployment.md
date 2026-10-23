# Deployment and operations

[Documentation](../README.md#documentation) · [SEO](seo-indexation.md)

## Build and runtime

```bash
pnpm install --frozen-lockfile
pnpm build
```

Publish the generated `out/` directory together with `.generated/security-headers.caddy`.
For a non-Docker deployment, place the generated map beside the Caddyfile as
`security-headers.caddy`. The Dockerfile copies both artifacts automatically. Production does not run a Next.js server.
The Dockerfile builds with Node.js 24 and serves the export with the digest-pinned Caddy image.
Keep `Dockerfile`, `Caddyfile` and `caddy-common.caddy` together; the runtime also requires the
generated `security-headers.caddy` from that exact build. Missing or stale hashes must not be
replaced with an unsafe-inline fallback. See [Security](security.md#static-content-security-policy).

Caddy listens on internal HTTP port 80; the public proxy provides HTTPS. The runtime uses UID/GID
1000 and disables the Caddy administration endpoint, automatic HTTPS and configuration persistence.
Container filesystem and capability restrictions belong to the deployment stack, not the static export.

## API routing

The outer reverse proxy must forward `/api/web/billing/*` to the Histae API on the website origin,
not to the static Caddy service. Preserve methods, request bodies, Origin, cookies and response headers.
Bypass CDN caching for these endpoints and retain API `no-store` responses and Set-Cookie headers.
The site's Caddyfile does not provide this proxy route.

Align the API's web-billing origin with the public site origin. Deploy matching API changes before
relying on new Checkout lifecycle behavior. Keep all payment and session secrets on the API side.

## Routes, headers and cache

The canonical origin is `https://www.histae.com`. The non-www host redirects there with the path and
query intact. Caddy selects a supported language for `/`, serves static directories with trailing
slashes and redirects legacy French legal paths to their stable English route names.

The Caddyfile defines CSP, anti-framing, MIME sniffing protection, cross-origin policies and browser
permissions. Billing pages additionally use `Referrer-Policy: no-referrer`, `Cache-Control: no-store`
and `X-Robots-Tag: noindex, follow`. Public assets have a one-day cache lifetime. Missing pages must
retain a 404 status, and private paths and source maps must not be served.

Verify the actual public responses: the static build cannot prove proxy or CDN behavior. Configure
HTTPS, certificate renewal and any additional edge policies in the hosting stack.

## Logging

`caddy-common.caddy` removes the request object, response headers and sensitive error fields from
JSON access logs. It keeps status, duration, numeric metrics, normalized method, route category and
a validated API request UUID. Do not reintroduce full URLs, query strings, IP addresses or cookies
through another log sink. The public proxy and CDN need their own corresponding review.

Shared infrastructure is documented in the API's [Caddy migration guide](../../histae-api-rust/docs/caddy-migration.md).
The website repository does not define Docker log rotation or the entire hosting stack.

## Release verification

Before release, run the [development checks](development.md#checks), review all four locales and
compare credit quotas and benefit descriptions with the API and store offers for the release.
Public Premium prices come from `/api/web/billing/plans`; verify its public unauthenticated response
and that a failure shows a price link rather than a stale amount. Confirm launch links,
fictional screenshots and legal content with their owners.

After deployment, check representative pages and an unknown URL, canonical and language redirects,
billing return parameters, API routing, cookies, cache bypass and security headers. Exercise the
subscription flow in the intended test environment, including switching formulas and resuming after
a lost response. A local fixture test is not evidence of a successful production payment.

Keep an identifiable previous artifact and verify the rollback procedure. Use the shared Histae
monitoring setup for availability and certificates without introducing visitor tracking by default.
Current release work belongs in the [roadmap](../roadmap.md), not in a dated README activity log.
