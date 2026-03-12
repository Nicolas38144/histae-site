import { useTranslation } from "react-i18next";
import styles from "./Download.module.css";

const Download = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.downloadContainer}>
      <div className={styles.content}>
        <h1 className={styles.title}>{t("Download.title", "Download the application")}</h1>
        <p className={styles.subtitle}>{t("Download.subtitle", "Available on iOS and Android.")}</p>
        
        <div className={styles.buttons}>
          <a href="#" className={styles.storeButton}>
            <span className={styles.icon}>🍎</span>
            <div className={styles.btnText}>
              <span className={styles.smallText}>{t("Download.availableOn", "Download on the")}</span>
              <span className={styles.largeText}>App Store</span>
            </div>
          </a>
          
          <a href="#" className={styles.storeButton}>
            <span className={styles.icon}>▶️</span>
            <div className={styles.btnText}>
              <span className={styles.smallText}>{t("Download.getItOn", "Get it on")}</span>
              <span className={styles.largeText}>Google Play</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Download;
