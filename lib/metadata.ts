import type { Metadata } from "next";
import { locales, type Locale } from "./site-content";

function getPublicUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

export function createLocaleMetadata(locale: Locale, title: string, description: string, path = ""): Metadata {
  const publicUrl = getPublicUrl();
  const normalizedPath = path ? `${path}/` : "";
  const canonical = publicUrl ? `${publicUrl}/${locale}/${normalizedPath}` : undefined;
  const languages = publicUrl
    ? Object.fromEntries(locales.map((targetLocale) => [targetLocale, `${publicUrl}/${targetLocale}/${normalizedPath}`]))
    : undefined;
  const socialImage = publicUrl ? `${publicUrl}/og.png` : undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical, languages } : undefined,
    openGraph: {
      type: "website",
      locale,
      title: `Histae — ${title}`,
      description,
      images: socialImage ? [{ url: socialImage, width: 1728, height: 904, alt: "Histae" }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `Histae — ${title}`,
      description,
      images: socialImage ? [socialImage] : undefined,
    },
  };
}
