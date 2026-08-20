import type { Metadata } from "next";
import {
  defaultLocale,
  localeConfig,
  locales,
  localizedHref,
  publicUrl,
  siteRoutes,
  type Locale,
  type SiteRouteId,
} from "./site-config";

export { publicUrl } from "./site-config";

export function absoluteLocalizedUrl(locale: Locale, routeId: SiteRouteId): string {
  return `${publicUrl}${localizedHref(locale, routeId)}/`;
}

export function createLocaleMetadata(locale: Locale, routeId: SiteRouteId, title: string, description: string): Metadata {
  const canonical = absoluteLocalizedUrl(locale, routeId);
  const languages = Object.fromEntries([
    ...locales.map((targetLocale) => [targetLocale, absoluteLocalizedUrl(targetLocale, routeId)]),
    ["x-default", absoluteLocalizedUrl(defaultLocale, routeId)],
  ]);
  const socialImage = `${publicUrl}/og.png`;
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
      images: [{ url: socialImage, width: 1728, height: 904, alt: "Histae" }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Histae — ${title}`,
      description,
      images: [socialImage],
    },
    robots: { index: true, follow: true },
  };
}

export function routePriority(routeId: SiteRouteId): number {
  return siteRoutes[routeId].priority;
}
