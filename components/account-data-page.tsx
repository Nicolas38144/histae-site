"use client";
import { useEffect, useRef } from "react";
import type { AppMessages } from "../messages";
import { type Locale, supportEmail } from "../lib/site-config";
import { BillingFailure } from "../lib/billing/failure";
import { subscriptionHref } from "../lib/billing/navigation";
import { useAccountData } from "../hooks/use-account-data";

type Copy = AppMessages["accountData"];
type AuthCopy = AppMessages["billingCheckout"];
function failureMessage(error: unknown, copy: Copy, auth: AuthCopy): string {
  if (!(error instanceof BillingFailure)) return auth.error;
  if (error.code === "deletion_unconfirmed") return copy.unconfirmed;
  if (error.code === "invalid_input") return auth.invalid;
  if (error.status === 401) return auth.auth;
  if (error.status === 404) return copy.notFound;
  if (error.status === 429) return auth.limited;
  if (error.status === 503) return auth.unavailable;
  return auth.error;
}

export function AccountDataPage({ locale, copy, auth }: { locale: Locale; copy: Copy; auth: AuthCopy }) {
  const data = useAccountData(locale);
  const confirmationInput = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => { if (data.confirmation) confirmationInput.current?.focus(); }, [data.confirmation]);
  useEffect(() => {
    if (data.receipt || data.deletedCategory || data.failure) statusRef.current?.focus();
  }, [data.receipt, data.deletedCategory, data.failure]);
  const categories = [
    { code: "photo", title: copy.photoTitle, body: copy.photoBody, action: copy.photoAction, success: copy.successPhoto },
    { code: "location", title: copy.locationTitle, body: copy.locationBody, action: copy.locationAction, success: copy.successLocation },
    { code: "sensitive_profile", title: copy.sensitiveTitle, body: copy.sensitiveBody, action: copy.sensitiveAction, success: copy.successSensitive },
  ] as const;
  const selected = categories.find(category => category.code === data.confirmation);
  return <main id="main-content" className="information-page account-data-page">
    <div className="shell account-data-shell">
      <header className="account-intro">
        <p className="eyebrow">Histae</p><h1>{copy.title}</h1><p>{copy.intro}</p>
        <nav className="account-shortcuts" aria-label={copy.actions}>
          <a className="text-link" href="#delete-data">{copy.partialTitle}</a>
          <a className="text-link" href="#delete-account">{copy.deleteTitle}</a>
        </nav>
      </header>

      <div ref={statusRef} tabIndex={-1} className="account-status">
        {data.busy && <p role="status">{auth.loading}</p>}
        {data.failure !== null && <p role="alert">{failureMessage(data.failure, copy, auth)}</p>}
        {data.deletedCategory && <p role="status">{categories.find(category => category.code === data.deletedCategory)?.success}</p>}
        {data.receipt && <section role="status" className="account-panel">
          <h2>{copy.receiptTitle}</h2><p>{copy.receiptBody}</p>
          <p>{copy.receiptLabel} <span className="account-reference">{data.receipt}</span></p>
        </section>}
      </div>

      {!data.receipt && <section id="data-login" className="account-panel billing-checkout" aria-labelledby="data-login-title">
        <h2 id="data-login-title">{copy.authTitle}</h2>
        {data.session ? <>
          <p>{copy.connected} <span className="account-reference">{data.session.user_id}</span></p>
          <button className="button" disabled={data.busy} onClick={data.signOut}>{auth.logout}</button>
        </> : <>
          <p>{copy.authIntro}</p>
          {!data.challenge ? <form onSubmit={event => { event.preventDefault(); data.identify(); }}>
            <label>{auth.userId}<input required autoComplete="off" spellCheck={false} value={data.userId} maxLength={36} onChange={event => data.setUserId(event.target.value)} disabled={data.busy} aria-describedby="account-identity-help" /></label>
            <p id="account-identity-help" className="account-note">{copy.identityHelp} <a className="text-link" href="#data-help">{copy.helpLink}</a></p>
            <label>{auth.phone}<input required type="tel" autoComplete="tel" value={data.phone} maxLength={32} onChange={event => data.setPhone(event.target.value)} disabled={data.busy} /></label>
            <button className="button button-primary" disabled={data.busy}>{auth.identify}</button>
          </form> : <form onSubmit={event => { event.preventDefault(); data.verify(); }}>
            <p role="status">{auth.sent}</p>
            <label>{auth.code}<input required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={data.code} onChange={event => data.setCode(event.target.value)} disabled={data.busy} /></label>
            <button className="button button-primary" disabled={data.busy}>{auth.verify}</button>
            <button type="button" className="button" disabled={data.busy} onClick={data.back}>{auth.back}</button>
          </form>}
          <p className="account-note">{copy.session}</p>
        </>}
      </section>}

      <section id="delete-data" className="account-section" aria-labelledby="partial-title">
        <h2 id="partial-title">{copy.partialTitle}</h2><p>{copy.partialIntro}</p>
        <div className="account-data-grid">{categories.map(category => <article key={category.code} className="account-panel">
          <h3>{category.title}</h3><p>{category.body}</p>
          {!data.receipt && (data.session ? <button className="button" disabled={data.busy} onClick={() => data.ask(category.code)}>{category.action}</button> : <a className="text-link" href="#data-login">{category.action}</a>)}
        </article>)}</div>
      </section>

      <section id="delete-account" className="account-panel account-delete" aria-labelledby="delete-account-title">
        <h2 id="delete-account-title">{copy.deleteTitle}</h2><p>{copy.deleteBody}</p>
        <p className="account-note">{copy.subscriptionWarning}</p>
        <p><a className="text-link" href={subscriptionHref(locale)}>{copy.subscriptionLink}</a></p>
        {!data.receipt && (data.session ? <button className="button button-danger" disabled={data.busy} onClick={() => data.ask("account")}>{copy.deleteAction}</button> : <a className="button" href="#data-login">{copy.deleteAction}</a>)}
      </section>

      {data.confirmation && <section className="account-panel account-confirmation" aria-labelledby="confirmation-title">
        <h2 id="confirmation-title">{copy.confirmTitle} — {selected?.title ?? copy.deleteTitle}</h2>
        <p>{data.confirmation === "account" ? copy.confirmAccount : copy.confirmData}</p>
        {selected && <p>{selected.body}</p>}
        <form className="billing-checkout" onSubmit={event => { event.preventDefault(); data.confirm(); }}>
          <label>{copy.confirmLabel}<input ref={confirmationInput} autoComplete="off" spellCheck={false} value={data.confirmationText} maxLength={6} disabled={data.busy} onChange={event => data.setConfirmationText(event.target.value)} /></label>
          <div className="account-button-row">
            <button className="button button-danger" disabled={data.busy || data.confirmationText !== "HISTAE"}>{copy.confirmAction}</button>
            <button type="button" className="button" disabled={data.busy} onClick={data.cancel}>{copy.cancel}</button>
          </div>
        </form>
      </section>}

      <section className="account-section" aria-labelledby="retention-title">
        <h2 id="retention-title">{copy.retentionTitle}</h2><p>{copy.retentionBody}</p><p>{copy.retentionBilling}</p>
        <a className="text-link" href={`/${locale}/legal/privacy-policy/`}>{copy.policyLink}</a>
      </section>
      <section id="data-help" className="account-panel" aria-labelledby="data-help-title">
        <h2 id="data-help-title">{copy.helpTitle}</h2><p>{copy.helpBody}</p>
        <a className="text-link" href={`mailto:${supportEmail}?subject=${encodeURIComponent("Histae — Data deletion")}`}>{copy.helpLink} — {supportEmail}</a>
      </section>
    </div>
  </main>;
}
