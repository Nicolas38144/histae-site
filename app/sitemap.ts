import type { MetadataRoute } from "next";
import { absoluteLocalizedUrl, routePriority } from "../lib/metadata";
import { defaultLocale, locales, policyPages, publicUrl, siteRouteIds } from "../lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    [...siteRouteIds.map((routeId) => {
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
    }), ...Object.values(policyPages).map(policy => ({
      url: `${publicUrl}/${locale}/${policy.path}/`,
      changeFrequency: "yearly" as const,
      priority: 0.4,
      alternates: { languages: Object.fromEntries([
        ...locales.map(target => [target, `${publicUrl}/${target}/${policy.path}/`]),
        ["x-default", `${publicUrl}/${defaultLocale}/${policy.path}/`],
      ]) },
    }))],
  );
}
