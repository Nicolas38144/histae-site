import siteConfig from "../config/site.json";

export const publicUrl = siteConfig.publicUrl;
export const localeConfig = siteConfig.locales;
export type Locale = keyof typeof localeConfig;

export function isLocale(value: string): value is Locale {
  return Object.prototype.hasOwnProperty.call(localeConfig, value);
}

export const locales = Object.keys(localeConfig).filter(isLocale);

function resolveDefaultLocale(value: string): Locale {
  if (isLocale(value)) return value;
  throw new Error(`Unsupported default locale: ${value}`);
}

export const defaultLocale = resolveDefaultLocale(siteConfig.defaultLocale);

export const siteRoutes = siteConfig.routes;
export type SiteRouteId = keyof typeof siteRoutes;
export type InformationPageName = Exclude<SiteRouteId, "home" | "pricing" | "faq">;

export function isSiteRouteId(value: string): value is SiteRouteId {
  return Object.prototype.hasOwnProperty.call(siteRoutes, value);
}

export const siteRouteIds = Object.keys(siteRoutes).filter(isSiteRouteId);
export const navigationRouteIds = siteRouteIds.filter((routeId) => siteRoutes[routeId].navigation);

export function localizedHref(locale: Locale, routeId: SiteRouteId): string {
  const path = siteRoutes[routeId].path;
  return path ? `/${locale}/${path}` : `/${locale}`;
}

export function switchPathLocale(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) segments[0] = targetLocale;
  else segments.unshift(targetLocale);
  return `/${segments.join("/")}`;
}
