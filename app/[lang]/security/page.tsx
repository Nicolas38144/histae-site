import { SafetyPage } from "../../../components/safety-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("safety");

export default createLocalizedPage((locale) => <SafetyPage locale={locale} />);
