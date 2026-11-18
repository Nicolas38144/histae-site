import frChildSafety from "./fr/child-safety.json";
import enChildSafety from "./en/child-safety.json";
import esChildSafety from "./es/child-safety.json";
import itChildSafety from "./it/child-safety.json";
import frAccountData from "./fr/account-data.json";
import enAccountData from "./en/account-data.json";
import esAccountData from "./es/account-data.json";
import itAccountData from "./it/account-data.json";
import itDiscovery from "./it/discovery.json";
import esDiscovery from "./es/discovery.json";
import enDiscovery from "./en/discovery.json";
import frDiscovery from "./fr/discovery.json";
import enCommon from "./en/common.json";
import enFaq from "./en/faq.json";
import enHome from "./en/home.json";
import enPages from "./en/pages.json";
import enPricing from "./en/pricing.json";
import esCommon from "./es/common.json";
import esFaq from "./es/faq.json";
import esHome from "./es/home.json";
import esPages from "./es/pages.json";
import esPricing from "./es/pricing.json";
import frCommon from "./fr/common.json";
import frFaq from "./fr/faq.json";
import frHome from "./fr/home.json";
import frPages from "./fr/pages.json";
import frPricing from "./fr/pricing.json";
import itCommon from "./it/common.json";
import itFaq from "./it/faq.json";
import itHome from "./it/home.json";
import itPages from "./it/pages.json";
import itPricing from "./it/pricing.json";
import type { Locale } from "../lib/site-config";

const frMessages = { ...frCommon, ...frHome, ...frPricing, ...frPages, ...frFaq, ...frDiscovery, ...frAccountData, ...frChildSafety };
export type AppMessages = typeof frMessages;

function defineMessages(messages: AppMessages): AppMessages {
  return messages;
}

const messagesByLocale: Record<Locale, AppMessages> = {
  fr: frMessages,
  en: defineMessages({ ...enCommon, ...enHome, ...enPricing, ...enPages, ...enFaq, ...enDiscovery, ...enAccountData, ...enChildSafety }),
  es: defineMessages({ ...esCommon, ...esHome, ...esPricing, ...esPages, ...esFaq, ...esDiscovery, ...esAccountData, ...esChildSafety }),
  it: defineMessages({ ...itCommon, ...itHome, ...itPricing, ...itPages, ...itFaq, ...itDiscovery, ...itAccountData, ...itChildSafety }),
};

export function getMessagesForLocale(locale: Locale): AppMessages {
  return messagesByLocale[locale];
}
