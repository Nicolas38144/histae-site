import enCommon from "./en/common.json";
import enHome from "./en/home.json";
import enPages from "./en/pages.json";
import enPricing from "./en/pricing.json";
import esCommon from "./es/common.json";
import esHome from "./es/home.json";
import esPages from "./es/pages.json";
import esPricing from "./es/pricing.json";
import frCommon from "./fr/common.json";
import frHome from "./fr/home.json";
import frPages from "./fr/pages.json";
import frPricing from "./fr/pricing.json";
import itCommon from "./it/common.json";
import itHome from "./it/home.json";
import itPages from "./it/pages.json";
import itPricing from "./it/pricing.json";
import type { Locale } from "../lib/site-config";

const frMessages = { ...frCommon, ...frHome, ...frPricing, ...frPages };
export type AppMessages = typeof frMessages;

function defineMessages(messages: AppMessages): AppMessages {
  return messages;
}

export const messagesByLocale: Record<Locale, AppMessages> = {
  fr: frMessages,
  en: defineMessages({ ...enCommon, ...enHome, ...enPricing, ...enPages }),
  es: defineMessages({ ...esCommon, ...esHome, ...esPricing, ...esPages }),
  it: defineMessages({ ...itCommon, ...itHome, ...itPricing, ...itPages }),
};

export function getMessagesForLocale(locale: Locale): AppMessages {
  return messagesByLocale[locale];
}
