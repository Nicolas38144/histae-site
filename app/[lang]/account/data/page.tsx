import { AccountDataPage } from "../../../../components/account-data-page";
import { createLocalizedPage, type LocalizedPageProps } from "../../../../lib/localized-page";
import { getMessagesForLocale } from "../../../../messages";
import { accountDataHref, defaultLocale, isLocale, locales, publicUrl } from "../../../../lib/site-config";

export async function generateMetadata({ params }: LocalizedPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getMessagesForLocale(lang).accountData;
  return {
    title: copy.title, description: copy.intro,
    robots: { index: false, follow: true }, referrer: "no-referrer" as const,
    alternates: {
      canonical: `${publicUrl}${accountDataHref(lang)}`,
      languages: Object.fromEntries([
        ...locales.map(locale => [locale, `${publicUrl}${accountDataHref(locale)}`]),
        ["x-default", `${publicUrl}${accountDataHref(defaultLocale)}`],
      ]),
    },
  };
}
export default createLocalizedPage(locale => {
  const messages = getMessagesForLocale(locale);
  return <AccountDataPage locale={locale} copy={messages.accountData} auth={messages.billingCheckout} />;
});
