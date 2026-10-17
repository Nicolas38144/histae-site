import { BillingReturnPage } from "../../../../components/billing-return-page";
import { createBillingReturnMetadata } from "../../../../lib/billing-returns";
import { createLocalizedPage } from "../../../../lib/localized-page";

export const generateMetadata = createBillingReturnMetadata("success");

export default createLocalizedPage((locale) => <BillingReturnPage locale={locale} kind="success" />);
