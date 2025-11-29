import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import fr from "./fr.json";
import en from "./en.json";

const supportedLngs = ["fr", "en"];
const defaultFallback = "en";

const getFallbackLng = () => {
  const navLang = navigator.language.split("-")[0];
  return supportedLngs.includes(navLang) ? navLang : defaultFallback;
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en }
    },
    fallbackLng: getFallbackLng(),
    supportedLngs: supportedLngs,
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
    interpolation: { escapeValue: false }
  });

export default i18n;
