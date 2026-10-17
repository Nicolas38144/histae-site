"use client";

import { useEffect } from "react";
import { preferredLocale } from "../lib/site-config";

export function BillingLanguageRedirect({ path }: { path: string }) {
  useEffect(() => {
    const languages = navigator.languages?.length ? navigator.languages : [navigator.language];
    // The destination path comes from the site configuration, never the query string.
    // Forward the query unchanged without interpreting or storing the Stripe session.
    window.location.replace(`/${preferredLocale(languages)}/${path}/${window.location.search}`);
  }, [path]);

  return null;
}
