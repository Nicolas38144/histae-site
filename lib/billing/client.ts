import { BillingFailure, object } from "./failure";
export async function billingRequest(path: string, language: string, options: RequestInit = {}): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(`/api/web/billing/${path}`, {
      ...options, credentials: "same-origin", cache: "no-store", redirect: "error",
      headers: { "Content-Type": "application/json", "Accept-Language": language, ...options.headers },
      signal: options.signal ?? AbortSignal.timeout(25000),
    });
  } catch { throw new BillingFailure("network_error"); }
  if (response.status === 204) return null;
  let body: unknown;
  try { body = await response.json(); } catch { throw new BillingFailure("invalid_response", response.status); }
  if (!response.ok) {
    const error = object(object(body).error);
    throw new BillingFailure(typeof error.code === "string" ? error.code : "request_failed", response.status);
  }
  return body;
}
