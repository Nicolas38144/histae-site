import { Outlet, useNavigate } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useTheme } from "../../hooks/useTheme";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import languageLight from "../../assets/language-light.svg";
import languageDark from "../../assets/language-dark.svg";
import { t } from "i18next";


function NavBar() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const navItems = [
    { label: t("NavBar.products"), link: "/products" },
    { label: t("NavBar.about"), link: "/about" },
    { label: t("NavBar.security"), link: "/security" },
    { label: t("NavBar.download"), link: "/download" },
  ];

  return (
    <>
      <nav className={`${styles.nav} ${styles[theme]}`}>
        <div className={styles.left}>
          <h1 className={styles.logo} onClick={() => navigate("/")}>
            {t("NavBar.brand")}
          </h1>
          <ul className={styles.menu}>
            {navItems.map((item, index) => (
              <li
                key={index}
                className={styles.menuItem}
                onClick={() => navigate(item.link)}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.right}>
          <ThemeToggle />
          <button className={styles.langBtn}>
            <img
              src={theme === "dark" ? languageLight : languageDark}
              alt={t("NavBar.language")}
              className={styles.langIcon}
            />
            {t("NavBar.language")}
          </button>
        </div>
      </nav>
      <Outlet />
    </>
  );
}

export default NavBar;