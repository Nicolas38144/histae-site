import type { Metadata } from "next";
import siteConfig from "../config/site.json";
import { getMessagesForLocale } from "../messages";
import type { LocalizedPageProps } from "./localized-page";
import { createPathMetadata } from "./metadata";
import { defaultLocale, isLocale, publicUrl } from "./site-config";

export type BillingReturnKind = keyof typeof siteConfig.billingReturns;

export function createBillingEntryMetadata(kind: BillingReturnKind): Metadata {
  return {
    title: "Histae",
    description: getMessagesForLocale(defaultLocale).billing[kind].description,
    alternates: { canonical: `${publicUrl}/${siteConfig.billingReturns[kind].path}/` },
    robots: { index: false, follow: true },
    referrer: "no-referrer",
  };
}

export function createBillingReturnMetadata(kind: BillingReturnKind) {
  return async function generateBillingReturnMetadata({ params }: LocalizedPageProps): Promise<Metadata> {
    const { lang } = await params;
    if (!isLocale(lang)) return {};
    const copy = getMessagesForLocale(lang).billing[kind];
    return {
      ...createPathMetadata(lang, siteConfig.billingReturns[kind].path, copy.title, copy.description, false),
      referrer: "no-referrer",
    };
  };
}
