import { Routes, Route, Navigate } from "react-router-dom";
import LangWrapper from "./LangWrapper";
import i18n from "../translations/i18n";

const supportedLangs: string[] = i18n.options.supportedLngs as string[];
const fallbackLng: string = (i18n.options.fallbackLng as string);
const detectedLang = i18n.language.split("-")[0];
const browserLang = supportedLangs.includes(detectedLang) ? detectedLang : fallbackLng;

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${browserLang}`} replace />} />
      <Route path="/:lang/*" element={<LangWrapper supportedLangs={supportedLangs} fallbackLng={fallbackLng} />} />
      <Route path="*" element={<Navigate to={`/${browserLang}`} replace />} />
    </Routes>
  );
};

export default AppRoutes;
