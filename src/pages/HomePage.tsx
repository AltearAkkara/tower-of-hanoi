import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export function HomePage() {
  const navigate = useNavigate();
  const { t } = useSettings();

  return (
    <main className="container home-container">
      <div className="home-title-block">
        <h1 className="home-title">{t.homeTitle}</h1>
        <p className="home-subtitle">{t.homeSubtitle}</p>
      </div>
      <div className="home-buttons">
        <button className="home-btn home-btn-primary" onClick={() => navigate("/mode")}>
          {t.startGame}
        </button>
        <button className="home-btn" onClick={() => navigate("/settings")}>
          {t.settings}
        </button>
      </div>
    </main>
  );
}
