import { billingRequest } from "./billing/client";
import { BillingFailure, object } from "./billing/failure";
import type { Locale } from "./site-config";

export const dataCategories = ["photo", "location", "sensitive_profile"] as const;
export type DataCategory = typeof dataCategories[number];
export type AccountSession = { user_id: string; onboarding_complete: boolean };
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validAccountIdentity(user: string, phone: string): boolean {
  return uuid.test(user.trim()) && /^\+[1-9][0-9]{7,14}$/.test(phone.replace(/[ .()-]/g, ""));
}
export function parseAccountSession(value: unknown): AccountSession {
  const data = object(value);
  if (typeof data.user_id !== "string" || !uuid.test(data.user_id) || typeof data.onboarding_complete !== "boolean") {
    throw new BillingFailure("invalid_response");
  }
  return { user_id: data.user_id, onboarding_complete: data.onboarding_complete };
}
export function parseChallenge(value: unknown): string {
  const id = object(value).challenge_id;
  if (typeof id !== "string" || !uuid.test(id)) throw new BillingFailure("invalid_response");
  return id;
}
export function parseDeletionToken(value: unknown): string {
  const token = object(value).confirmation_token;
  if (typeof token !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}:[A-Za-z0-9_-]{43}$/.test(token)) {
    throw new BillingFailure("invalid_response");
  }
  return token;
}
export function parseErasureReceipt(value: unknown): string {
  const data = object(value);
  if (data.status !== "in_progress" || typeof data.request_id !== "string" || !uuid.test(data.request_id)) {
    throw new BillingFailure("invalid_response");
  }
  return data.request_id;
}
export function accountRequest(path: string, locale: Locale, options: RequestInit = {}) {
  return billingRequest(path, locale, options, "account");
}
export function privacyRequest(path: string, locale: Locale, options: RequestInit = {}) {
  return billingRequest(path, locale, options, "privacy");
}
