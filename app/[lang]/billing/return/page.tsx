import { BillingReturnPage } from "../../../../components/billing-return-page";
import { createBillingReturnMetadata } from "../../../../lib/billing-returns";
import { createLocalizedPage } from "../../../../lib/localized-page";

export const generateMetadata = createBillingReturnMetadata("return");

export default createLocalizedPage((locale) => <BillingReturnPage locale={locale} kind="return" />);
