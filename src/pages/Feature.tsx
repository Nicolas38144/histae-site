import { useTranslation } from "react-i18next";
import styles from "./Feature.module.css";

const Feature = () => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.featureContainer}>
      <h1>{t("Feature.title")}</h1>
    </div>
  );
};

export default Feature;
