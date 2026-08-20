import { FaqPage } from "../../../components/faq-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("faq");

export default createLocalizedPage((locale) => <FaqPage locale={locale} />);
