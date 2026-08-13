import type { Metadata } from "next";
import { locales, type Locale } from "./locales";

export const publicUrl = "https://histae.com";

export function createLocaleMetadata(locale: Locale, title: string, description: string, path = ""): Metadata {
  const normalizedPath = path ? `${path}/` : "";
  const canonical = `${publicUrl}/${locale}/${normalizedPath}`;
  const languages = Object.fromEntries(locales.map((targetLocale) => [targetLocale, `${publicUrl}/${targetLocale}/${normalizedPath}`]));
  const socialImage = `${publicUrl}/og.png`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      locale,
      title: `Histae — ${title}`,
      description,
      images: [{ url: socialImage, width: 1728, height: 904, alt: "Histae" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Histae — ${title}`,
      description,
      images: [socialImage],
    },
  };
}
