"use client";

import { useEffect } from "react";
import { routing } from "../../i18n/routing";
import type { Locale } from "../../lib/site-config";

function getBrowserLanguage(): Locale {
  const primaryLanguage = (navigator.languages[0] ?? navigator.language).toLowerCase().split("-")[0];
  return routing.locales.find((locale) => locale === primaryLanguage) ?? routing.defaultLocale;
}

export default function RootPage() {
  useEffect(() => {
    window.location.replace(`/${getBrowserLanguage()}/`);
  }, []);

  return <main className="language-redirect" aria-live="polite" />;
}
