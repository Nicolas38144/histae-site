import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { createLocaleMetadata } from "./metadata";
import { isLocale, type Locale, type SiteRouteId } from "./site-config";
import { getMessagesForLocale, type AppMessages } from "../messages";

export type LocalizedPageProps = { params: Promise<{ lang: string }> };

async function resolvePageLocale(params: LocalizedPageProps["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  setRequestLocale(lang);
  return lang;
}

export function createLocalizedPage(render: (locale: Locale) => ReactNode) {
  return async function LocalizedPage({ params }: LocalizedPageProps) {
    const locale = await resolvePageLocale(params);
    return render(locale);
  };
}

export function getRouteMetadataCopy(messages: AppMessages, routeId: SiteRouteId) {
  switch (routeId) {
    case "home":
      return { title: messages.home.title, description: messages.home.intro };
    case "pricing":
      return { title: messages.pricing.title, description: messages.pricing.intro };
    case "feature":
    case "safety":
    case "about":
    case "download": {
      const page = messages.pages[routeId];
      return { title: page.title, description: page.intro };
    }
  }
}

export function createPageMetadata(routeId: SiteRouteId) {
  return async function generateLocalizedMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
    const { lang } = await params;
    if (!isLocale(lang)) return {};
    const copy = getRouteMetadataCopy(getMessagesForLocale(lang), routeId);
    return createLocaleMetadata(lang, routeId, copy.title, copy.description);
  };
}
