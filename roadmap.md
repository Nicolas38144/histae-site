# Website roadmap

[Documentation](README.md#documentation)

This is the remaining release backlog, not a history of completed changes. Marketing and legal
content is statically exported in four languages. The subscription flow depends on the API through
a same-origin proxy. Keep product availability and deployed behavior distinct from local code.

## Priorities

| Workstream | Priority | Remaining outcome |
| --- | --- | --- |
| S01: legal content and contacts | P0 | Reviewed information matching the actual publisher and data flows |
| S02: product and commercial accuracy | P0, recurring | Marketing, API and store information reconciled for each release |
| S03: launch and subscription journeys | P1 | Official download links, support and verified purchase/return behavior |
| S04: automated quality | P1/P2 | Focused checks for missing content, navigation and critical regressions |
| S05: accessibility and performance | P1 | Agreed browser/device coverage and measured usability targets |
| S06: hosting and operations | P1 | Verified edge behavior, monitoring and rollback |

## S01: legal content and contacts

- Confirm publisher details, support/privacy/security contacts and website-specific notices.
- Reconcile actual server/CDN logging, session cookies, processors and retention with the documents.
- Review the four legal documents and translations, record approval and align published API versions.
- Define version history and explicitly review indexing after approval.

Done when the [legal workflow](docs/legal/README.md) has an identified owner and reviewed content
matching the hosted service. Pending-validation wording is not an approval record.

## S02: product and commercial accuracy

- Assign owners for prices, quotas, availability and public product claims.
- Reconcile configured credit quotas, benefit descriptions and actual store offers with the API.
- Public Premium amounts now use the Checkout API catalogue; verify its deployed route and unavailable state.
- Review screenshots, consent/location/photo behavior, credit rules and payment wording per release.

Done when the release records its app/API versions and content approval without making marketing
pages depend on live API availability.

## S03: launch and subscription journeys

- Add official store links only when the corresponding platform is available; verify support paths.
- Validate web authentication, Checkout, formula changes, expired sessions and native-subscription management.
- Verify return pages, subscription refresh, portal exit and delayed webhooks on representative devices.
- Deploy compatible website/API changes and verify the final public routes and cache bypass.

Done when visitors reach the intended official app or payment journey and availability is stated
accurately. Fixture tests alone do not establish deployed provider behavior.

## S04: automated quality

- Extend static validation to the subscription route and missing internal assets/links.
- Add runtime checks for empty translations where TypeScript shape checks are insufficient.
- Validate structured data and social images, and add targeted navigation/accessibility regressions.
- Consolidate release checks when the workflow needs it; keep production dependency review separate
  from visitor page loads.

Preserve the existing SEO and billing regression checks. Done when important content and navigation
errors fail the release checks without introducing a broad test suite for every visual change.

## S05: accessibility and performance

- Agree supported devices, browsers and measurable asset/performance budgets.
- Keep the focused keyboard, mobile overflow, image loading and reduced-motion checks in `tests/marketing.spec.ts`.
- Complete manual screen-reader, zoom, contrast and cross-browser checks on representative devices.
- Measure the hosted mobile experience, image loading and behavior on slow connections.

Done when representative pages meet the agreed targets and regressions are addressed before adding
new animation or third-party scripts.

## S06: hosting and operations

- Validate the generated CSP with the runtime image and verify it is preserved through the CDN.
- Verify canonical/locale redirects, HTTPS, billing parameters, headers, 404s and CDN cache rules.
- Review all log sinks and exported files for unintended sensitive data.
- Verify availability/certificate monitoring and rollback to an identifiable previous artifact.

Done when the [deployment checks](docs/deployment.md#release-verification) pass on the real hosting
stack. Do not infer production behavior from the local static build.

## Scope and completion

The public site does not expose the administrator dashboard. Waiting lists, newsletters, analytics
and additional collection are separate product decisions. Keep mobile functionality and access
decisions in the app/API; the website's authenticated billing flow is the defined exception.

For each completed item, update its durable guide and remove obsolete backlog detail. Review the
four locales, run checks appropriate to the change and identify any production verification still
outstanding. Do not turn the README into a dated work log.
