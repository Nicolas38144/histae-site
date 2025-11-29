import { useTranslation } from "react-i18next";

const Feature = () => {
  const { t } = useTranslation();
  
  return (
    <div className="feature">
      <h1>{t("Feature.title")}</h1>
    </div>
  );
};

export default Feature;
