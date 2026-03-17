import { useTranslation } from "react-i18next";
import styles from "./Home.module.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  return (
    <div className={styles.homeContainer}>
      
      {/* Hero */}
      <div className={styles.hero}>
        <h1 className={styles.title}>
          {t(
            "Home.title",
            "Des rencontres qui prennent le temps d’exister."
          )}
        </h1>

        <p className={styles.subtitle}>
          Une application pensée pour celles et ceux qui cherchent une relation sincère, basée sur l’échange et la confiance.
        </p>

        <button
          className={styles.cta}
          onClick={() => navigate(`/${lang}/download`)}
        >
          {t("Home.cta", "Commencer une rencontre sincère")}
        </button>
      </div>

      {/* Features */}
      <div className={styles.features}>
        <div className={styles.card}>
          <h3>🕊️ Prendre son temps</h3>
          <p>
            Ici, pas de swipe frénétique. Chaque profil mérite attention.
          </p>
        </div>

        <div className={styles.card}>
          <h3>💬 Échanges profonds</h3>
          <p>
            Des conversations longues pour vraiment se découvrir.
          </p>
        </div>

        <div className={styles.card}>
          <h3>🤝 Confiance</h3>
          <p>
            Une communauté bienveillante tournée vers le sérieux.
          </p>
        </div>
      </div>

      {/* Footer */}
      <p className={styles.footer}>
        Promis maintenant je révise à fond le TOEIC !
      </p>
    </div>
  );
};

export default Home;