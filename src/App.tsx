import AppRoutes from "./routes/AppRoutes";
import "./styles/variables.css";

export default function App() {
  return (
    <div style={{ 
      background: "var(--bg)",
      color: "var(--text)",
      height: "100vh",
    }}>
      <AppRoutes />
    </div>
  );
}
