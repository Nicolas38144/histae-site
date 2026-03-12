import { useParams, useNavigate, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import i18n from "../translations/i18n";

import Home from "../pages/Home";
import About from "../pages/About";
import NavBar from "../components/NavBar/NavBar";
import Feature from "../pages/Feature";
import Security from "../pages/Security";
import Download from "../pages/Download";

interface LangWrapperProps {
  supportedLangs: string[];
  fallbackLng: string;
}

export default function LangWrapper({ supportedLangs, fallbackLng }: LangWrapperProps) {
  const { lang } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!lang || !supportedLangs.includes(lang)) {
      navigate(`/${fallbackLng}`, { replace: true });
      return;
    }

    i18n.changeLanguage(lang);
    document.documentElement.lang = lang;
  }, [lang, navigate, supportedLangs, fallbackLng]);

  return (
    <>
      <NavBar />

      <Routes>
        <Route index element={<Home />} />
        <Route path="feature" element={<Feature />} />
        <Route path="about" element={<About />} />
        <Route path="security" element={<Security />} />
        <Route path="download" element={<Download />} />
        <Route path="*" element={<Navigate to={`/${lang}`} replace />} />
      </Routes>
    </>
  );
}
