import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";

export function ModePage() {
  const navigate = useNavigate();
  const { t } = useSettings();

  const MODES = [
    { key: "classic",   label: t.modeClassicLabel,   description: t.modeClassicDesc },
    { key: "chaos",     label: t.modeChaosLabel,     description: t.modeChaosDesc },
    { key: "forbidden",      label: t.modeForbiddenLabel,      description: t.modeForbiddenDesc,      comingSoon: true },
    { key: "forgotten", label: t.modeForgottenLabel, description: t.modeForgottenDesc, comingSoon: true },
  ] as const;

  return (
    <main className="container">
      <h2 className="page-heading">{t.selectMode}</h2>
      <div className="mode-list">
        {MODES.map(({ key, label, description, ...rest }) => {
          const comingSoon = "comingSoon" in rest && rest.comingSoon;
          return (
            <button
              key={key}
              className={`mode-card${comingSoon ? " mode-card-soon" : ""}`}
              onClick={() => !comingSoon && navigate("/difficulty", { state: { mode: key } })}
              disabled={comingSoon}
            >
              <span className="mode-label">{label}</span>
              <span className="mode-desc">{description}</span>
            </button>
          );
        })}
      </div>
      <button className="back-btn" onClick={() => navigate("/home")}>
        {t.back}
      </button>
    </main>
  );
}
