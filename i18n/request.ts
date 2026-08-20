import { getRequestConfig } from "next-intl/server";
import { getMessagesForLocale } from "../messages";
import { defaultLocale, isLocale } from "../lib/site-config";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  const requestedLocale = locale ?? await requestLocale;
  const resolvedLocale = requestedLocale && isLocale(requestedLocale) ? requestedLocale : defaultLocale;

  return {
    locale: resolvedLocale,
    messages: getMessagesForLocale(resolvedLocale),
  };
});
