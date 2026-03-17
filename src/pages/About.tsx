import { useTranslation } from "react-i18next";
import styles from "./About.module.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.aboutContainer}>
      <h1>{t("About.title")}</h1>
    </div>
  );
};

export default About;
