import Link from "next/link";
import type { BillingReturnKind } from "../lib/billing-returns";
import { localizedHref, type Locale } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";

export function BillingReturnPage({ locale, kind }: { locale: Locale; kind: BillingReturnKind }) {
  const messages = getMessagesForLocale(locale);
  const copy = messages.billing;
  const status = copy[kind];

  return (
    <main id="main-content" className="billing-return-page">
      <section className="shell billing-return-card" aria-labelledby="page-title">
        <div className="billing-return-symbol" aria-hidden="true">↩</div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1 id="page-title">{status.title}</h1>
        <p className="billing-return-intro">{status.description}</p>
        <div className="billing-return-next">
          <h2>{copy.nextTitle}</h2>
          <ol>
            <li>{copy.steps.app}</li>
            <li>{copy.steps.subscription}</li>
            <li>{copy.steps.refresh}</li>
          </ol>
        </div>
        <p className="billing-return-note">{copy.note}</p>
        <Link className="text-link" href={localizedHref(locale, "home")}>{messages.common.backHome}</Link>
      </section>
    </main>
  );
}
