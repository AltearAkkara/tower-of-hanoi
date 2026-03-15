import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export function ModePage() {
  const navigate = useNavigate();
  const { t } = useSettings();

  const MODES = [
    { key: "classic", label: t.modeClassicLabel, description: t.modeClassicDesc },
    { key: "chaos",   label: t.modeChaosLabel,   description: t.modeChaosDesc },
  ] as const;

  return (
    <main className="container">
      <h2 className="page-heading">{t.selectMode}</h2>
      <div className="mode-list">
        {MODES.map(({ key, label, description }) => (
          <button
            key={key}
            className="mode-card"
            onClick={() => navigate("/difficulty", { state: { mode: key } })}
          >
            <span className="mode-label">{label}</span>
            <span className="mode-desc">{description}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate("/home")}>
        {t.back}
      </button>
    </main>
  );
}
