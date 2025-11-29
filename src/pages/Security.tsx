import { useTranslation } from "react-i18next";

const Security = () => {
  const { t } = useTranslation();
  
  return (
    <div className="security">
      <h1>{t("Security.title")}</h1>
    </div>
  );
};

export default Security;
