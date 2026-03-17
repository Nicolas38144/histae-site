import { useNavigate, useParams } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useTheme } from "../../hooks/useTheme";
// import ThemeToggle from "../ThemeToggle/ThemeToggle";
import languageLight from "../../assets/language-light.svg";
import languageDark from "../../assets/language-dark.svg";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { useLanguages } from "../../hooks/useLanguages";

function NavBar() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { lang } = useParams();
  const { t } = useTranslation();
  const { languages } = useLanguages();

  const [showLangPopup, setShowLangPopup] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: t("NavBar.products"), link: `/${lang}/feature` },
    { label: t("NavBar.about"), link: `/${lang}/about` },
    { label: t("NavBar.security"), link: `/${lang}/security` },
    { label: t("NavBar.download"), link: `/${lang}/download` },
  ];

  const handleNavigation = (link: string) => {
    setIsMobileMenuOpen(false);
    navigate(link);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
    <nav className={`${styles.nav} ${styles[theme]}`}>
      <div className={styles.left}>
        <h1 className={styles.logo} onClick={() => handleNavigation(`/${lang}`)}>
          {t("NavBar.brand")}
        </h1>
        <ul className={`${styles.menu} ${isMobileMenuOpen ? styles.open : ""}`}>
          {navItems.map((item, index) => (
            <li
              key={index}
              className={styles.menuItem}
              onClick={() => handleNavigation(item.link)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.right}>
        {/* <ThemeToggle /> */}
        <button className={styles.langBtn} onClick={() => setShowLangPopup(true)}>
          <img
            src={theme === "dark" ? languageLight : languageDark}
            alt={t("NavBar.language")}
            className={styles.langIcon}
          />
          <span className={styles.langText}>{t("NavBar.language")}</span>
        </button>
        <button className={styles.hamburgerBtn} onClick={toggleMobileMenu} aria-label="Toggle menu">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </nav>

    {showLangPopup && (
        <LanguageSelector
          languages={languages}
          onClose={() => setShowLangPopup(false)}
        />
      )}
    </>
  );
}

export default NavBar;