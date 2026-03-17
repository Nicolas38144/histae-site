import AppRoutes from "./routes/AppRoutes";
import "./styles/variables.css";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.appContainer}>
      <AppRoutes />
    </div>
  );
}
