import { BillingReturnEntry } from "../../../../components/billing-return-entry";
import { createBillingEntryMetadata } from "../../../../lib/billing-returns";

export const metadata = createBillingEntryMetadata("cancel");

export default function BillingCancelEntry() {
  return <BillingReturnEntry kind="cancel" />;
}
