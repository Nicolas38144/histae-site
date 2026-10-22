"use client";
import type { AppMessages } from "../messages";
import type { Locale } from "../lib/site-config";
import { BillingFailure, storeManagementUrl } from "../lib/web-billing";
import { useBillingCheckout } from "../hooks/use-billing-checkout";

type Copy = AppMessages["billingCheckout"];
function failureMessage(error: unknown, copy: Copy): string {
  if (!(error instanceof BillingFailure)) return copy.error;
  if (error.code === "invalid_input") return copy.invalid;
  if (error.code === "storage_unavailable") return copy.storage;
  switch (error.status) {
    case 429: return copy.limited;
    case 401: return copy.auth;
    case 409: return copy.existing;
    case 503: return copy.unavailable;
    default: return copy.error;
  }
}
export function BillingCheckout({ locale, copy }: { locale: Locale; copy: Copy }) {
  const { session, offers, challenge, userId, setUserId, phone, setPhone, code, setCode, period, setPeriod, busy, failure, identify, verify, checkout, manage, signOut, back, refresh } = useBillingCheckout(locale);
  const managementUrl = storeManagementUrl(session?.subscription.management_url ?? null);
  return <main id="main-content" className="billing-return-page">
    <section className="shell billing-return-card billing-checkout" aria-labelledby="page-title">
      <h1 id="page-title">{copy.title}</h1><p>{copy.intro}</p>
      {busy && <p role="status">{copy.loading}</p>}
      {failure !== null && <p role="alert">{failureMessage(failure, copy)}</p>}
      {!session && !challenge && <form onSubmit={(event) => { event.preventDefault(); identify(); }}>
        <label>{copy.userId}<input required autoComplete="off" value={userId} maxLength={36} onChange={(e) => setUserId(e.target.value)} disabled={busy} /></label>
        <label>{copy.phone}<input required type="tel" autoComplete="tel" value={phone} maxLength={32} onChange={(e) => setPhone(e.target.value)} disabled={busy} /></label>
        <button className="button button-primary" disabled={busy}>{copy.identify}</button>
        <p>{copy.session}</p>
      </form>}
      {!session && challenge && <form onSubmit={(event) => { event.preventDefault(); verify(); }}>
        <p role="status">{copy.sent}</p>
        <label>{copy.code}<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} disabled={busy} /></label>
        <button className="button button-primary" disabled={busy}>{copy.verify}</button>
        <button type="button" className="button" disabled={busy} onClick={back}>{copy.back}</button>
      </form>}
      {session && <>
        <p>{session.subscription.access_granted ? copy.active : copy.free}</p>
        {!session.onboarding_complete && <p role="alert">{copy.onboarding}</p>}
        {session.subscription.provider && session.subscription.provider !== "stripe" && <p>{copy.store} <strong>{session.subscription.provider === "app_store" ? copy.apple : copy.google}</strong></p>}
        {managementUrl && <a className="button" href={managementUrl} rel="noreferrer">{copy.manage}</a>}
        {!session.subscription.access_granted && session.onboarding_complete && <form onSubmit={(event) => { event.preventDefault(); checkout(); }}>
          <fieldset disabled={busy}><legend>{copy.choose}</legend>
            {offers.map((offer) => <label key={offer.billing_period}>
              <input type="radio" name="period" checked={period === offer.billing_period} onChange={() => setPeriod(offer.billing_period)} />
              {offer.billing_period === "monthly" ? copy.monthly : copy.annual} — {new Intl.NumberFormat(locale, { style: "currency", currency: offer.currency }).format(offer.price_cents / 100)}
            </label>)}
          </fieldset><p>{copy.renewal}</p>
          <button className="button button-primary" disabled={busy || !offers.some((offer) => offer.billing_period === period)}>{copy.pay}</button>
        </form>}
        {session.subscription.customer_portal_available && session.subscription.provider === "stripe" && <button className="button" disabled={busy} onClick={manage}>{copy.manage}</button>}
        <button className="button" disabled={busy} onClick={refresh}>{copy.refresh}</button>
        <button className="button" disabled={busy} onClick={signOut}>{copy.logout}</button>
      </>}
    </section>
  </main>;
}
