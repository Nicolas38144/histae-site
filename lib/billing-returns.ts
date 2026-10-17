import type { Metadata } from "next";
import siteConfig from "../config/site.json";
import { getMessagesForLocale } from "../messages";
import type { LocalizedPageProps } from "./localized-page";
import { createPathMetadata } from "./metadata";
import { isLocale } from "./site-config";

export type BillingReturnKind = keyof typeof siteConfig.billingReturns;

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
