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
      return { title: messages.seo.home.title, description: messages.home.intro };
    case "pricing":
      return { title: messages.seo.pricing.title, description: messages.pricing.intro };
    case "feature":
      return { title: messages.seo.feature.title, description: messages.pages.feature.intro };
    case "safety":
      return { title: messages.seo.safety.title, description: messages.pages.safety.intro };
    case "about":
      return { title: messages.seo.about.title, description: messages.pages.about.intro };
    case "faq":
      return { title: messages.seo.faq.title, description: messages.faq.intro };
    case "download":
      return { title: messages.seo.download.title, description: messages.pages.download.intro };
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
