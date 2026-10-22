import { BillingCheckout } from "../../../../components/billing-checkout";
import { createLocalizedPage, type LocalizedPageProps } from "../../../../lib/localized-page";
import { getMessagesForLocale } from "../../../../messages";
import { isLocale } from "../../../../lib/site-config";

export async function generateMetadata({ params }: LocalizedPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getMessagesForLocale(lang).billingCheckout;
  return { title: copy.title, description: copy.intro, robots: { index: false, follow: true }, referrer: "no-referrer" as const };
}
export default createLocalizedPage((locale) => <BillingCheckout locale={locale} copy={getMessagesForLocale(locale).billingCheckout} />);
