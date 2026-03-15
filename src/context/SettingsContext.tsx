import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { translations } from "../i18n/translations";
import type { Lang, Translations } from "../i18n/translations";
import { themes, defaultTheme } from "../theme/themes";
import type { Theme, ThemeId } from "../theme/themes";

interface SettingsContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  t: Translations;
  theme: Theme;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(theme.vars)) {
    root.style.setProperty(key, value);
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) ?? "en";
  });

  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    return (localStorage.getItem("themeId") as ThemeId) ?? defaultTheme.id;
  });

  const theme = themes.find((t) => t.id === themeId) ?? defaultTheme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem("lang", l);
  };

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id);
    localStorage.setItem("themeId", id);
  };

  return (
    <SettingsContext.Provider
      value={{ lang, setLang, themeId, setThemeId, t: translations[lang], theme }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextType {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
