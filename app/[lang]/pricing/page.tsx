import { PricingPage } from "../../../components/pricing-page";
import { createLocalizedPage, createPageMetadata } from "../../../lib/localized-page";

export const generateMetadata = createPageMetadata("pricing");

export default createLocalizedPage((locale) => <PricingPage locale={locale} />);
