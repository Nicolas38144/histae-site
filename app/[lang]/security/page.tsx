import { SecurityPage } from "../../../components/security-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("security");

export default createLocalizedPage((locale) => <SecurityPage locale={locale} />);
