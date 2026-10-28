"use client";
import { useEffect, useRef, useState } from "react";
import {
  accountRequest, privacyRequest, parseAccountSession, parseChallenge,
  parseDeletionToken, parseErasureReceipt, validAccountIdentity,
  type AccountSession, type DataCategory,
} from "../lib/account-data";
import { BillingFailure } from "../lib/billing/failure";
import { clearCheckoutKey } from "../lib/billing/checkout-storage";
import type { Locale } from "../lib/site-config";

export function useAccountData(locale: Locale) {
  const [session, setSession] = useState<AccountSession | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(true);
  const [failure, setFailure] = useState<unknown>(null);
  const [deletedCategory, setDeletedCategory] = useState<DataCategory | null>(null);
  const [receipt, setReceipt] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<DataCategory | "account" | null>(null);
  const [confirmationText, setConfirmationText] = useState("");
  const alive = useRef(false);
  const running = useRef(false);
  const pending = useRef<AbortController | null>(null);
  const sendAttempt = useRef<{ input: string; key: string } | null>(null);

  useEffect(() => {
    alive.current = true;
    const controller = new AbortController();
    accountRequest("session", locale, { signal: controller.signal })
      .then(value => { if (!controller.signal.aborted) setSession(parseAccountSession(value)); })
      .catch((error: unknown) => {
        if (!controller.signal.aborted && (!(error instanceof BillingFailure) || error.status !== 401)) setFailure(error);
      }).finally(() => { if (!controller.signal.aborted) setBusy(false); });
    return () => { alive.current = false; controller.abort(); pending.current?.abort(); };
  }, [locale]);

  const resetIdentity = () => { setUserId(""); setPhone(""); setCode(""); setChallenge(null); sendAttempt.current = null; };
  const run = (action: (signal: AbortSignal) => Promise<void>) => {
    if (busy || running.current) return;
    running.current = true;
    const controller = new AbortController();
    pending.current = controller;
    setBusy(true); setFailure(null); setDeletedCategory(null);
    void action(controller.signal).catch((error: unknown) => {
      if (!alive.current || controller.signal.aborted) return;
      setFailure(error);
      if (error instanceof BillingFailure && error.status === 401 && session) {
        setSession(null); setConfirmation(null); setConfirmationText(""); resetIdentity();
      }
    }).finally(() => { running.current = false; if (alive.current) setBusy(false); });
  };
  const identify = () => {
    if (!validAccountIdentity(userId, phone)) { setFailure(new BillingFailure("invalid_input")); return; }
    run(async signal => {
      const input = JSON.stringify({ user_id: userId.trim().toLowerCase(), phone_number: phone });
      if (sendAttempt.current?.input !== input) sendAttempt.current = { input, key: crypto.randomUUID() };
      const value = await accountRequest("otp/send", locale, {
        method: "POST", signal, headers: { "Idempotency-Key": sendAttempt.current.key }, body: input,
      });
      if (alive.current) setChallenge(parseChallenge(value));
    });
  };
  const verify = () => {
    if (!challenge || !/^[0-9]{6}$/.test(code)) { setFailure(new BillingFailure("invalid_input")); return; }
    run(async signal => {
      try {
        await accountRequest("otp/verify", locale, {
          method: "POST", signal, body: JSON.stringify({ challenge_id: challenge, phone_number: phone, otp: code }),
        });
      } catch (error) {
        // A lost verification response may already have installed the cookie.
        if (!(error instanceof BillingFailure) || error.code !== "network_error") throw error;
      }
      const current = parseAccountSession(await accountRequest("session", locale, { signal }));
      if (alive.current) { setSession(current); resetIdentity(); }
    });
  };
  const ask = (category: DataCategory | "account") => {
    if (busy || !session) return;
    setConfirmation(category); setConfirmationText(""); setFailure(null); setDeletedCategory(null);
  };
  const cancel = () => { if (!busy) { setConfirmation(null); setConfirmationText(""); } };
  const confirm = () => {
    if (!session || !confirmation || confirmationText !== "HISTAE") return;
    const category = confirmation;
    run(async signal => {
      if (category === "account") {
        const token = parseDeletionToken(await privacyRequest("deletion-token", locale, { method: "POST", signal }));
        let value: unknown;
        try {
          value = await privacyRequest("account", locale, { method: "DELETE", signal, body: JSON.stringify({ confirmation_token: token }) });
        } catch (error) {
          if (error instanceof BillingFailure && error.code === "network_error") {
            if (alive.current) { setSession(null); resetIdentity(); setConfirmation(null); setConfirmationText(""); }
            throw new BillingFailure("deletion_unconfirmed");
          }
          throw error;
        }
        const id = parseErasureReceipt(value);
        clearCheckoutKey();
        if (alive.current) { setReceipt(id); setSession(null); resetIdentity(); }
      } else {
        await privacyRequest("data", locale, { method: "DELETE", signal, body: JSON.stringify({ category }) });
        if (alive.current) setDeletedCategory(category);
      }
      if (alive.current) { setConfirmation(null); setConfirmationText(""); }
    });
  };
  const signOut = () => run(async signal => {
    await accountRequest("session", locale, { method: "DELETE", signal });
    clearCheckoutKey();
    if (alive.current) { setSession(null); resetIdentity(); setConfirmation(null); setConfirmationText(""); }
  });
  const back = () => { if (!busy) { setChallenge(null); setCode(""); setFailure(null); sendAttempt.current = null; } };
  return {
    session, challenge, userId, setUserId, phone, setPhone, code, setCode,
    busy, failure, deletedCategory, receipt, confirmation, confirmationText, setConfirmationText,
    identify, verify, ask, cancel, confirm, signOut, back,
  };
}
