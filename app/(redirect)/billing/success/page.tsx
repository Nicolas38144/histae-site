import { BillingReturnEntry } from "../../../../components/billing-return-entry";
import { createBillingEntryMetadata } from "../../../../lib/billing-returns";

export const metadata = createBillingEntryMetadata("success");

export default function BillingSuccessEntry() {
  return <BillingReturnEntry kind="success" />;
}
