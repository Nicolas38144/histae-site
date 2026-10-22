"use client";
import { useEffect, useRef, useState } from "react";
import { requestedBillingPeriod } from "../lib/billing/navigation";
import type { Locale } from "../lib/site-config";
import { BillingFailure, billingRequest, checkoutKey, clearCheckoutKey, parseOffers, parseSession, paymentUrl, type BillingPeriod, type WebOffer, type WebSession } from "../lib/web-billing";

export function useBillingCheckout(locale: Locale) {
  const [session, setSession] = useState<WebSession | null>(null);
  const [offers, setOffers] = useState<WebOffer[]>([]);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [period, setPeriod] = useState<BillingPeriod>("monthly");
  const [busy, setBusy] = useState(true);
  const [failure, setFailure] = useState<unknown>(null);
  const alive = useRef(true);
  const periodInitialized = useRef(false);
  const running = useRef(false);
  const sendAttempt = useRef<{ input: string; key: string } | null>(null);
  const refresh = async () => {
    const current = parseSession(await billingRequest("session", locale));
    if (alive.current) setSession(current);
    if (current.subscription.access_granted) clearCheckoutKey();
  };
  useEffect(() => {
    alive.current = true;
    if (!periodInitialized.current) {
      const requestedPeriod = requestedBillingPeriod(window.location.search);
      if (requestedPeriod) setPeriod(requestedPeriod);
      periodInitialized.current = true;
    }
    const controller = new AbortController();
    Promise.all([
      billingRequest("plans", locale, { signal: controller.signal }).then((value) => { if (alive.current && !controller.signal.aborted) setOffers(parseOffers(value)); }),
      billingRequest("session", locale, { signal: controller.signal }).then((value) => { if (alive.current && !controller.signal.aborted) setSession(parseSession(value)); }).catch((error: unknown) => { if (!(error instanceof BillingFailure) || error.status !== 401) throw error; }),
    ]).catch(() => { if (alive.current && !controller.signal.aborted) setFailure(new BillingFailure("billing_unavailable", 503)); }).finally(() => { if (alive.current && !controller.signal.aborted) setBusy(false); });
    return () => { alive.current = false; controller.abort(); };
  }, [locale]);
  const run = async (action: () => Promise<void>) => {
    if (busy || running.current) return;
    running.current = true;
    setBusy(true); setFailure(null);
    try { await action(); }
    catch (error: unknown) {
      if (alive.current) {
        setFailure(error);
        if (error instanceof BillingFailure && error.status === 401) setSession(null);
      }
    } finally { running.current = false; if (alive.current) setBusy(false); }
  };
  const identify = () => {
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId.trim()) || !/^\+33[1-9][0-9]{8}$/.test(phone.replace(/[ .()-]/g, ""))) { setFailure(new BillingFailure("invalid_input")); return; }
    void run(async () => {
      const input = JSON.stringify({ user_id: userId.trim().toLowerCase(), phone_number: phone });
      if (sendAttempt.current?.input !== input) sendAttempt.current = { input, key: crypto.randomUUID() };
      const data = await billingRequest("otp/send", locale, { method: "POST", headers: { "Idempotency-Key": sendAttempt.current.key }, body: input }) as { challenge_id?: unknown };
      if (typeof data?.challenge_id !== "string") throw new BillingFailure("invalid_response");
      if (alive.current) setChallenge(data.challenge_id);
    });
  };
  const verify = () => {
    void run(async () => {
      try {
        await billingRequest("otp/verify", locale, { method: "POST", body: JSON.stringify({ challenge_id: challenge, phone_number: phone, otp: code }) });
      } catch (error) {
        if (!(error instanceof BillingFailure) || error.code !== "network_error") throw error;
        // The response can be lost after the browser received Set-Cookie.
        await refresh();
      }
      if (!alive.current) return;
      setCode(""); setPhone(""); setChallenge(null);
      await refresh();
    });
  };
  const checkout = () => {
    if (!session) return;
    void run(async () => {
      const key = checkoutKey(session.user_id, period);
      try {
        const result = await billingRequest("checkout", locale, { method: "POST", headers: { "Idempotency-Key": key }, body: JSON.stringify({ billing_period: period }) });
        const target = paymentUrl(result, false);
        if (alive.current) window.location.assign(target);
      } catch (error: unknown) {
        if (error instanceof BillingFailure && error.code === "idempotency_key_consumed") {
          await refresh(); clearCheckoutKey();
        }
        throw error;
      }
    });
  };
  const manage = () => void run(async () => {
    const target = paymentUrl(await billingRequest("portal", locale, { method: "POST" }), true);
    if (alive.current) window.location.assign(target);
  });
  const signOut = () => void run(async () => {
    await billingRequest("session", locale, { method: "DELETE" });
    clearCheckoutKey();
    if (alive.current) { setSession(null); setCode(""); setPhone(""); setUserId(""); setChallenge(null); sendAttempt.current = null; }
  });
  const back = () => { setChallenge(null); setCode(""); sendAttempt.current = null; };
  return { session, offers, challenge, userId, setUserId, phone, setPhone, code, setCode, period, setPeriod, busy, failure, identify, verify, checkout, manage, signOut, back, refresh: () => void run(refresh) };
}
