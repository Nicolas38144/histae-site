import { ChildSafetyPage } from "../../../components/child-safety-page";
import { createLocalizedPage, type LocalizedPageProps } from "../../../lib/localized-page";
import { createPathMetadata } from "../../../lib/metadata";
import { childSafetyPath, isLocale } from "../../../lib/site-config";
import { getMessagesForLocale } from "../../../messages";

export async function generateMetadata({ params }: LocalizedPageProps) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const copy = getMessagesForLocale(lang).childSafety;
  return createPathMetadata(lang, childSafetyPath, copy.title, copy.intro);
}

export default createLocalizedPage(locale => <ChildSafetyPage locale={locale} />);
