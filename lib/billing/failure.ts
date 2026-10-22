export class BillingFailure extends Error {
  constructor(readonly code: string, readonly status = 0) { super(code); }
}
export const object = (value: unknown): Record<string, unknown> => {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new BillingFailure("invalid_response");
  return value as Record<string, unknown>;
};
