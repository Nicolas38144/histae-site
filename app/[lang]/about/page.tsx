import { AboutPage } from "../../../components/about-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("about");

export default createLocalizedPage((locale) => <AboutPage locale={locale} />);
