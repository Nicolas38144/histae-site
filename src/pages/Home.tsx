import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  
  return (
    <div className="home">
      <h1>{t("Home.title")}</h1>
      <p>Promis maintenant je révise à fond le toeic !</p>
    </div>
  );
};

export default Home;
