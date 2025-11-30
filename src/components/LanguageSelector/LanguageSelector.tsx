import { useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import i18n from "../../translations/i18n";
import styles from "./LanguageSelector.module.css";
import { useTheme } from "../../hooks/useTheme";
import closeLight from "../../assets/close-light.svg";
import closeDark from "../../assets/close-dark.svg";
import { t } from "i18next";

interface Language { code: string; name: string; localName: string; }
interface LanguageSelectorProps { languages: Language[]; onClose: () => void; }

export default function LanguageSelector({ languages, onClose }: LanguageSelectorProps) {
  const { lang } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const popupRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) { 
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleSelect = useCallback(
    (newLang: string) => {
      if (lang === newLang) { return onClose(); }
      i18n.changeLanguage(newLang);
      const segments = location.pathname.split("/").filter(Boolean);
      segments[0] = newLang;
      navigate("/" + segments.join("/"), { replace: true });
      onClose();
    },
    [lang, location.pathname, navigate, onClose]
  );

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div ref={popupRef} className={styles.popup}>
        <button
          className={styles.closeButton}
          onClick={onClose}
        >
         <img
            src={theme === "dark" ? closeLight : closeDark}
            alt={t("LanguageSelector.close")}
            className={styles.closeIcon}
          />
        </button >

        <div className={styles.languagePopup}>
          <h3>{i18n.t("language.choose")}</h3>

          <div className={styles.languageGrid}>
            {languages.map((l: any) => (
              <button
                key={l.code}
                aria-current={l.code === lang}
                className={l.code === lang ? styles.selected : ""}
                onClick={() => handleSelect(l.code)}
              >
                <span className={styles.langName}>{l.name}</span>
                <span className={styles.langLocal}>{l.localName}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
