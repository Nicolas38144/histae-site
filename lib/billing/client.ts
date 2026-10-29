import { BillingFailure, object } from "./failure";
export async function billingRequest(path: string, language: string, options: RequestInit = {}, scope: "billing" | "account" | "privacy" = "billing"): Promise<unknown> {
  const headers = new Headers(options.headers);
  if (!headers.has("Accept-Language")) headers.set("Accept-Language", language);
  if (options.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  let response: Response;
  try {
    response = await fetch(`/api/web/${scope}/${path}`, {
      ...options, credentials: "same-origin", cache: "no-store", redirect: "error",
      headers,
      signal: AbortSignal.any([AbortSignal.timeout(25000), ...(options.signal ? [options.signal] : [])]),
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
