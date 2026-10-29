import Link from "next/link";
import { getMessagesForLocale } from "../messages";
import { childSafetyUpdatedAt, localizedHref, supportEmail, type Locale } from "../lib/site-config";
import { legalDocumentHref } from "../lib/legal-documents";

export function ChildSafetyPage({ locale }: { locale: Locale }) {
  const messages = getMessagesForLocale(locale);
  const copy = messages.childSafety;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" })
    .format(new Date(`${childSafetyUpdatedAt}T12:00:00Z`));
  const contactHref = `mailto:${supportEmail}?subject=${encodeURIComponent(copy.emailSubject)}`;

  return (
    <main id="main-content" className="information-page child-safety-page">
      <div className="shell legal-content">
        <p className="eyebrow">{copy.eyebrow}</p>
        <article className="legal-document" lang={locale}>
          <h1>{copy.title}</h1>
          <p>{copy.updated} <time dateTime={childSafetyUpdatedAt}>{date}</time></p>
          <p>{copy.intro}</p>
          <p><a className="text-link" href="#report">{copy.sections.report.title} →</a></p>
          {Object.entries(copy.sections).map(([id, section]) => (
            <section key={id} id={id} aria-labelledby={`policy-${id}`}>
              <h2 id={`policy-${id}`}>{section.title}</h2>
              {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <section id="contact" aria-labelledby="policy-contact">
            <h2 id="policy-contact">{copy.contactTitle}</h2>
            <p>{copy.contact}</p>
            <p><a href={contactHref}>{supportEmail}</a></p>
            <p><a className="button button-primary" href={contactHref}>{copy.contactButton}</a></p>
            <blockquote><p>{copy.emergency}</p></blockquote>
          </section>
          <section aria-labelledby="policy-resources">
            <h2 id="policy-resources">{copy.related}</h2>
            <p><Link href={legalDocumentHref(locale, "terms-of-use")}>{copy.terms}</Link></p>
            <p><Link href={legalDocumentHref(locale, "privacy-policy")}>{copy.privacy}</Link></p>
            <p><a href={`https://support.google.com/googleplay/android-developer/answer/14747720?hl=${locale}`}>{copy.google}</a></p>
            <p><a href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31979">{copy.authoritiesLink}</a></p>
          </section>
        </article>
      </div>
      <section className="shell page-closing">
        <Link className="text-link" href={localizedHref(locale, "home")}>{messages.common.backHome} →</Link>
      </section>
    </main>
  );
}
