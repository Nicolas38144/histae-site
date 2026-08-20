import { InformationPage } from "../../../components/information-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("about");

export default createLocalizedPage((locale) => <InformationPage locale={locale} pageName="about" />);
