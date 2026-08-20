import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "../lib/site-config";

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "always",
});
