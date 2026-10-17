import siteConfig from "../config/site.json";
import type { BillingReturnKind } from "../lib/billing-returns";
import { locales } from "../lib/site-config";
import { getMessagesForLocale } from "../messages";
import { BillingLanguageRedirect } from "./billing-language-redirect";

export function BillingReturnEntry({ kind }: { kind: BillingReturnKind }) {
  const { path } = siteConfig.billingReturns[kind];

  return (
    <main className="billing-return-page">
      <BillingLanguageRedirect path={path} />
      <section className="shell billing-return-card" aria-labelledby="page-title">
        <h1 id="page-title">Histae</h1>
        <nav className="billing-language-options" aria-label="Langue / Language / Idioma / Lingua">
          {locales.map((locale) => (
            <a className="text-link" key={locale} lang={locale} href={`/${locale}/${path}/`}>
              {getMessagesForLocale(locale).billing.continueInLocale}
            </a>
          ))}
        </nav>
      </section>
    </main>
  );
}
