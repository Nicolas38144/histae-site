import { useTheme } from "../../hooks/useTheme";
import styles from "./ThemeToggle.module.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={`${styles.switch} ${theme === "dark" ? styles.dark : styles.light}`}
      onClick={toggleTheme}
    >
      <div className={styles.thumb}>
        {theme === "dark" ? "🌙" : "☀️"}
      </div>
    </div>
  );
}
