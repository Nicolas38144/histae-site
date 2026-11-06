import { FeaturePage } from "../../../components/feature-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("feature");

export default createLocalizedPage((locale) => <FeaturePage locale={locale} />);
