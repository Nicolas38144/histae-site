import { useTranslation } from "react-i18next";
import { languages } from "../translations/language";

export const useLanguages = () => {
  const { t } = useTranslation();

  const translatedLanguages = languages.map(l => ({
    ...l,
    localName: t(`language.${l.code}`)
  }));

  return {
    languages: translatedLanguages,
    supportedLngs: translatedLanguages.map(l => l.code),
  };
};
