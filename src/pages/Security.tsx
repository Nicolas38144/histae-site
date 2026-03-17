import { useTranslation } from "react-i18next";
import styles from "./Security.module.css";

const Security = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.securityContainer}>
      <h1>{t("Security.title")}</h1>
    </div>
  );
};

export default Security;
