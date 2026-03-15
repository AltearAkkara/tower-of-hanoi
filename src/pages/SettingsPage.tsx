import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../context/SettingsContext";
import { themes } from "../theme/themes";
import { clearAllScores } from "../services/leaderboard";

const THEME_ACCENT: Record<string, string> = {
  nebula: "#646cff",
  ocean: "#00b4d8",
  forest: "#4caf50",
  ember: "#ff6b35",
};

export function SettingsPage() {
  const navigate = useNavigate();
  const { lang, setLang, themeId, setThemeId, t } = useSettings();
  const [confirming, setConfirming] = useState(false);

  return (
    <main className="container">
      <h2 className="page-heading">{t.settingsTitle}</h2>

      <div className="settings-list">
        {/* Language */}
        <div className="settings-row">
          <span className="settings-label">{t.language}</span>
          <div className="settings-options">
            <button
              className={`settings-option${lang === "en" ? " active" : ""}`}
              onClick={() => setLang("en")}
            >
              English
            </button>
            <button
              className={`settings-option${lang === "th" ? " active" : ""}`}
              onClick={() => setLang("th")}
            >
              ภาษาไทย
            </button>
          </div>
        </div>

        {/* Theme */}
        <div className="settings-row">
          <span className="settings-label">{t.theme}</span>
          <div className="settings-options">
            {themes.map((theme) => (
              <button
                key={theme.id}
                className={`settings-option${themeId === theme.id ? " active" : ""}`}
                onClick={() => setThemeId(theme.id)}
              >
                <span className="theme-swatch">
                  <span
                    className="theme-dot"
                    style={{ background: THEME_ACCENT[theme.id] }}
                  />
                  {lang === "th" ? theme.labelTh : theme.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="settings-danger-zone">
        {confirming ? (
          <div className="settings-confirm-row">
            <span className="settings-confirm-text">{t.clearProgressConfirm}</span>
            <button
              className="settings-clear-btn"
              onClick={() => { clearAllScores(); setConfirming(false); }}
            >
              ยืนยัน
            </button>
            <button className="settings-cancel-btn" onClick={() => setConfirming(false)}>
              ยกเลิก
            </button>
          </div>
        ) : (
          <button className="settings-clear-btn" onClick={() => setConfirming(true)}>
            {t.clearProgress}
          </button>
        )}
      </div>

      <button className="back-btn" onClick={() => navigate(-1)}>
        {t.back}
      </button>
    </main>
  );
}
