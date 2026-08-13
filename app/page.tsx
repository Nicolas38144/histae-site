"use client";

import { useEffect } from "react";
import { locales, type Locale } from "../lib/locales";

const supportedLanguages = locales;
type LanguageCode = Locale;

function getBrowserLanguage(): LanguageCode {
  const primaryLanguage = (navigator.languages[0] ?? navigator.language).toLowerCase().split("-")[0];
  return supportedLanguages.includes(primaryLanguage as LanguageCode) ? (primaryLanguage as LanguageCode) : "fr";
}

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`/${getBrowserLanguage()}/`);
  }, []);

  return <main className="language-redirect" aria-live="polite" />;
}
