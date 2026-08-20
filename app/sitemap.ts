import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, routePriority } from "../lib/metadata";
import { defaultLocale, locales, siteRouteIds } from "../lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    siteRouteIds.map((routeId) => {
      return {
        url: absoluteLocalizedUrl(locale, routeId),
        changeFrequency: "monthly" as const,
        priority: routePriority(routeId),
        alternates: {
          languages: Object.fromEntries([
            ...locales.map((targetLocale) => [targetLocale, absoluteLocalizedUrl(targetLocale, routeId)]),
            ["x-default", absoluteLocalizedUrl(defaultLocale, routeId)],
          ]),
        },
      };
    }),
  );
}
