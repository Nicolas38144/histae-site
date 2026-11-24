import { expect, test } from "@playwright/test";
import { parseAccountSession, parseDeletionToken, parseErasureReceipt, validAccountIdentity } from "../lib/account-data";

test("privacy DTOs reject malformed receipts and never accept incomplete deletion tokens", () => {
  const user = "11111111-1111-4111-8111-111111111111";
  const requestId = "22222222-2222-4222-8222-222222222222";
  const deletionToken = `${user}:${"a".repeat(43)}`;

  expect(validAccountIdentity(user, "+33 6 12 34 56 78")).toBe(true);
  expect(validAccountIdentity("not-a-user", "+33612345678")).toBe(false);
  expect(validAccountIdentity(user, "123456")).toBe(false);
  expect(() => parseAccountSession({ user_id: user })).toThrow();
  expect(() => parseDeletionToken({ confirmation_token: user })).toThrow();
  expect(parseDeletionToken({ confirmation_token: deletionToken })).toBe(deletionToken);
  expect(() => parseErasureReceipt({ request_id: requestId, status: "completed" })).toThrow();
});
