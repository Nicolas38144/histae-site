# Child-safety standards and operator procedure

[Documentation](../README.md#documentation)

The public HTML standards are served without authentication at `/{locale}/child-safety/` in
French, English, Spanish and Italian. The French Play Console URL is
`https://www.histae.com/fr/child-safety/`. The name is Histae, matching the app identity.
Content is in `messages/{locale}/child-safety.json`, presentation in
`components/child-safety-page.tsx`, and the stable path/publication date in
`config/site.json`. The contact uses the existing public `supportEmail` setting.

The footer and Security page link to the standards. The app's Help and contact links to the
matching language through `SUPPORT_WEBSITE_URL`. The page is static HTML rather than a PDF,
is available without JavaScript, has no public editing surface, and does not require a Histae
account. Its visibility at the public URL must still be checked after deployment, including
any CDN, region, bot or authentication rules. Local tests do not prove public availability.

## Requirements and verified implementation

Google's [child-safety standards guide](https://support.google.com/googleplay/android-developer/answer/14747720?hl=en)
and [full policy](https://support.google.com/googleplay/android-developer/answer/9878809?hl=en)
require published prohibitions, in-app feedback, action on identified CSAM, a reporting process
to relevant authorities and a designated contact. The policy applies even to adults-only apps.

| Requirement | Current implementation or operator responsibility |
| --- | --- |
| Published standards | Dedicated localized public page with CSAE/CSAM prohibitions and reporting guidance |
| In-app feedback | Existing profile/conversation report form, Other reason and free-text details; child-safety instructions added |
| Age restriction | Profile/API validate the declared eighteenth birthday; this is not identity verification |
| Enforcement | Dashboard Reports, Content moderation and user suspension; actions are manual |
| Authority reports | Responsible operator follows the procedure below; no automatic law-enforcement integration is claimed |
| Contact | `support.histae@gmail.com`; operator must monitor it and be able to explain review/enforcement procedures |

## Handling a report

1. **Receive and prioritise.** Monitor in-app Reports and the support mailbox. Identify the
   responsible human and a replacement if unavailable. If a child is in immediate danger,
   contact emergency services without waiting for routine review.
2. **Record minimum context.** Record the report ID, affected account/match IDs, dates, reported
   facts, reviewer and actions in a restricted incident record. Do not put illegal media, private
   conversations or identities in repository files, general logs or ordinary email attachments.
   Do not ask a reporter to download, screenshot or forward suspected CSAM.
3. **Restrict access and review.** In the dashboard, use Reports to find the account and match,
   user controls to suspend a confirmed minor or abusive account, and Content moderation to
   reject/remove a violating photo or profile content. A report status change alone does not
   suspend an account, remove content or send anything to an authority. If a harmful private
   message cannot be individually removed with available tools, immediately restrict the
   account and access to the affected exchange, and arrange appropriate removal with the
   operator; do not represent a profile/photo action as deleting a private message.
4. **Escalate confirmed cases.** Report confirmed CSAM to the competent regional or national
   authority in accordance with the applicable law. In France, contact the police, gendarmerie
   or competent public prosecutor. PHAROS is a channel for public illegal content within its
   remit, not a universal reporting destination for private conversations. Use another country's
   competent authority or NCMEC only where applicable; confirm the appropriate channel for the
   actual circumstances. Record the authority, date and case reference in restricted records.
5. **Preserve only what is lawful and necessary.** Obtain instructions about evidence preservation,
   retention and secure transmission where required. Prevent further user access to illegal
   content while avoiding unnecessary copies; do not promise indefinite retention. Coordinate
   with the existing privacy/deletion process and follow lawful preservation requests.
6. **Close and follow up.** Record the actions and authority referral before marking the report
   reviewed. Give a suitable response without disclosing another person's private data or
   investigation details. Handle good-faith reports without retaliation and review repeat abuse.

No automated CSAM detection, identity verification, continuous staffing, response-time guarantee
or completed legal certification is claimed. This runbook must be adopted and operated by the
responsible human; code and published wording cannot certify that actual practice complies.

## Before confirming Play Console declarations

Deploy the site and verify the live HTTPS URL without a session. Submit that exact URL and
the designated contact address. Verify a report from the actual release reaches the dashboard,
check the mailbox, and ensure the responsible person can carry out the removal/referral process
before self-certifying the corresponding boxes. Also configure the Play age restriction for
an adults-only dating app; the public policy is not a substitute for that console setting.

The app changes require a new signed bundle. If build number `1` was already uploaded, use a
new build number instead of attempting to reuse it. API and dashboard source code were not
changed for this work, and no API tests, deployment or authority report were performed.

Official operational references:

- [Reporting illegal online content in France](https://www.service-public.gouv.fr/particuliers/vosdroits/F31979)
- [Police and emergency contact guidance](https://www.service-public.gouv.fr/particuliers/vosdroits/F33953)
- [Google Play age-restricted content and functionality](https://support.google.com/googleplay/android-developer/answer/16302250?hl=en)
