# Third-party licensing review

Reviewed on 2026-10-23.

[Histae's proprietary source-access terms](LICENSE.md) apply only to original Histae
materials. Dependencies, SDKs, fonts, container images and other third-party materials
retain their own licenses and rights, including reuse rights those licenses grant.

## Build dependencies and deployed artifacts

The installed Sharp Windows artifact 0.35.5 declares `Apache-2.0 AND LGPL-3.0-or-later`.
Determine whether such artifacts are actually distributed; a build dependency is not
necessarily part of the exported website. `axe-core` 4.13.0 declares MPL-2.0 and
`caniuse-lite` 1.0.30001809 declares CC-BY-4.0. Preserve required license and attribution
information for artifacts actually shipped. Native binaries and container contents
require their own release review. The website's original code remains proprietary.

## Recorded package metadata

459 installed package-version entries are recorded in [THIRD_PARTY_LICENSES.json](THIRD_PARTY_LICENSES.json).
The inventory was refreshed after the Next.js/React security update. Build/test and installed
optional packages are included; packages for other deployment platforms require separate review.
These counts do not describe the contents of a production artifact.

| Declared license expression | Entries |
| --- | ---: |
| `0BSD` | 1 |
| `Apache-2.0` | 27 |
| `Apache-2.0 AND LGPL-3.0-or-later` | 1 |
| `Apache-2.0 AND MIT` | 1 |
| `BSD-2-Clause` | 7 |
| `BSD-3-Clause` | 3 |
| `BlueOak-1.0.0` | 1 |
| `CC-BY-4.0` | 1 |
| `CC0-1.0` | 1 |
| `ISC` | 15 |
| `MIT` | 399 |
| `MPL-2.0` | 1 |
| `Python-2.0` | 1 |

## Release responsibilities and limits

This review records declared licenses, not a complete attribution or license-text bundle.
Keep upstream copyright statements, LICENSE/NOTICE files and required attribution with
distributed components. Meet applicable source-availability and other copyleft requirements;
do not strip existing generated license information or third-party notices from bundles.
An `AND` expression requires satisfying both licenses; an `OR` expression allows a choice
subject to its terms. Unusual or custom expressions need the corresponding upstream text.

Before a release, review the actual dependency versions and shipped platform artifacts,
collect their full required texts and document any modifications. Base-image packages,
external service contracts, model weights and unpinned Python transitive packages have not
received a complete artifact-level review. No compatibility, ownership or legal-compliance
certification is asserted. This report does not revoke any earlier valid license grant.
