import { BillingReturnEntry } from "../../../../components/billing-return-entry";
import { createBillingEntryMetadata } from "../../../../lib/billing-returns";

export const metadata = createBillingEntryMetadata("return");

export default function BillingPortalEntry() {
  return <BillingReturnEntry kind="return" />;
}
