import itDiscovery from "./it/discovery.json";
import esDiscovery from "./es/discovery.json";
import enDiscovery from "./en/discovery.json";
import frDiscovery from "./fr/discovery.json";
import itCheckout from "./it/checkout.json";
import esCheckout from "./es/checkout.json";
import enCheckout from "./en/checkout.json";
import frCheckout from "./fr/checkout.json";
import enBilling from "./en/billing.json";
import enCommon from "./en/common.json";
import enFaq from "./en/faq.json";
import enHome from "./en/home.json";
import enPages from "./en/pages.json";
import enPricing from "./en/pricing.json";
import esBilling from "./es/billing.json";
import esCommon from "./es/common.json";
import esFaq from "./es/faq.json";
import esHome from "./es/home.json";
import esPages from "./es/pages.json";
import esPricing from "./es/pricing.json";
import frBilling from "./fr/billing.json";
import frCommon from "./fr/common.json";
import frFaq from "./fr/faq.json";
import frHome from "./fr/home.json";
import frPages from "./fr/pages.json";
import frPricing from "./fr/pricing.json";
import itBilling from "./it/billing.json";
import itCommon from "./it/common.json";
import itFaq from "./it/faq.json";
import itHome from "./it/home.json";
import itPages from "./it/pages.json";
import itPricing from "./it/pricing.json";
import type { Locale } from "../lib/site-config";

const frMessages = { ...frCommon, ...frHome, ...frPricing, ...frPages, ...frFaq, ...frBilling, ...frCheckout, ...frDiscovery };
export type AppMessages = typeof frMessages;

function defineMessages(messages: AppMessages): AppMessages {
  return messages;
}

export const messagesByLocale: Record<Locale, AppMessages> = {
  fr: frMessages,
  en: defineMessages({ ...enCommon, ...enHome, ...enPricing, ...enPages, ...enFaq, ...enBilling, ...enCheckout, ...enDiscovery }),
  es: defineMessages({ ...esCommon, ...esHome, ...esPricing, ...esPages, ...esFaq, ...esBilling, ...esCheckout, ...esDiscovery }),
  it: defineMessages({ ...itCommon, ...itHome, ...itPricing, ...itPages, ...itFaq, ...itBilling, ...itCheckout, ...itDiscovery }),
};

export function getMessagesForLocale(locale: Locale): AppMessages {
  return messagesByLocale[locale];
}
