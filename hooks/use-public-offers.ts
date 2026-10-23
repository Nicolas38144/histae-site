"use client";

import { useEffect, useState } from "react";
import type { Locale } from "../lib/site-config";
import type { WebOffer } from "../lib/billing/models";
import { publicOffers } from "../lib/billing/public-offers";

type OfferState = { locale: Locale; offers: WebOffer[]; status: "loading" | "ready" | "unavailable" };

export function usePublicOffers(locale: Locale) {
  const [state, setState] = useState<OfferState>({ locale, offers: [], status: "loading" });
  useEffect(() => {
    let active = true;
    publicOffers(locale).then(offers => {
      if (active) setState({ locale, offers, status: offers.length ? "ready" : "unavailable" });
    }).catch(() => { if (active) setState({ locale, offers: [], status: "unavailable" }); });
    return () => { active = false; };
  }, [locale]);
  // Never display an earlier locale's offers while its replacement is loading or failed.
  return state.locale === locale ? state : { offers: [], status: "loading" as const };
}
