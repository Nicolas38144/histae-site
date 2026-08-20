import type { Locale } from "../lib/site-config";
import type { AppMessages } from "../messages";

declare module "next-intl" {
  interface AppConfig {
    Locale: Locale;
    Messages: AppMessages;
  }
}
