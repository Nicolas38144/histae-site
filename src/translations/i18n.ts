import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { supportedLngs, defaultFallback } from "./language";

import fr from "./fr.json";
import en from "./en.json";
import it from "./it.json";
import es from "./es.json";

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
      en: { translation: en },
      it: { translation: it },
      es: { translation: es }
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
