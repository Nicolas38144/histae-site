import type { Metadata } from "next";
import { brandSocialImage } from "./branding";
import {
  defaultLocale,
  localeConfig,
  locales,
  publicUrl,
  siteRoutes,
  type Locale,
  type SiteRouteId,
} from "./site-config";

export function absoluteLocalizedUrl(locale: Locale, routeId: SiteRouteId): string {
  return absoluteLocalizedPathUrl(locale, siteRoutes[routeId].path);
}

function absoluteLocalizedPathUrl(locale: Locale, path: string): string {
  return `${publicUrl}/${locale}/${path ? `${path}/` : ""}`;
}

export function createLocaleMetadata(locale: Locale, routeId: SiteRouteId, title: string, description: string): Metadata {
  return createPathMetadata(locale, siteRoutes[routeId].path, title, description);
}

export function createPathMetadata(locale: Locale, path: string, title: string, description: string, indexable = true): Metadata {
  const canonical = absoluteLocalizedPathUrl(locale, path);
  const languages = Object.fromEntries([
    ...locales.map((targetLocale) => [targetLocale, absoluteLocalizedPathUrl(targetLocale, path)]),
    ["x-default", absoluteLocalizedPathUrl(defaultLocale, path)],
  ]);
  const socialImage = `${publicUrl}${brandSocialImage.url}`;
  const alternateLocale = locales
    .filter((targetLocale) => targetLocale !== locale)
    .map((targetLocale) => localeConfig[targetLocale].openGraph);

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: "website",
      locale: localeConfig[locale].openGraph,
      alternateLocale,
      title: `Histae — ${title}`,
      description,
      images: [{ url: socialImage, width: brandSocialImage.width, height: brandSocialImage.height, alt: brandSocialImage.alt }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Histae — ${title}`,
      description,
      images: [socialImage],
    },
    robots: { index: indexable, follow: true },
  };
}

export function routePriority(routeId: SiteRouteId): number {
  return siteRoutes[routeId].priority;
}
