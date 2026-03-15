export type ThemeId = "nebula" | "ocean" | "forest" | "ember";

export interface Theme {
  id: ThemeId;
  label: string;
  labelTh: string;
  /** hue range used for disk color gradient in GamePage */
  diskHueRange: number;
  vars: Record<string, string>;
}

export const themes: Theme[] = [
  {
    id: "nebula",
    label: "Nebula",
    labelTh: "เนบิวลา",
    diskHueRange: 240,
    vars: {
      "--color-bg": "#1a1a2e",
      "--color-bg-titlebar": "#111120",
      "--color-accent": "#646cff",
      "--color-accent-20": "rgba(100, 108, 255, 0.2)",
      "--color-accent-40": "rgba(100, 108, 255, 0.4)",
      "--color-accent-60": "rgba(100, 108, 255, 0.6)",
      "--color-accent-border": "#646cff",
      "--color-text": "#f6f6f6",
      "--color-text-heading": "#e0e0ff",
      "--color-peg": "#555",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    labelTh: "โอเชียน",
    diskHueRange: 200,
    vars: {
      "--color-bg": "#0a1628",
      "--color-bg-titlebar": "#060e1a",
      "--color-accent": "#00b4d8",
      "--color-accent-20": "rgba(0, 180, 216, 0.2)",
      "--color-accent-40": "rgba(0, 180, 216, 0.4)",
      "--color-accent-60": "rgba(0, 180, 216, 0.6)",
      "--color-accent-border": "#00b4d8",
      "--color-text": "#f0f8ff",
      "--color-text-heading": "#caf0f8",
      "--color-peg": "#3a5070",
    },
  },
  {
    id: "forest",
    label: "Forest",
    labelTh: "ฟอเรสต์",
    diskHueRange: 120,
    vars: {
      "--color-bg": "#0d1f0d",
      "--color-bg-titlebar": "#081408",
      "--color-accent": "#4caf50",
      "--color-accent-20": "rgba(76, 175, 80, 0.2)",
      "--color-accent-40": "rgba(76, 175, 80, 0.4)",
      "--color-accent-60": "rgba(76, 175, 80, 0.6)",
      "--color-accent-border": "#4caf50",
      "--color-text": "#f0fff0",
      "--color-text-heading": "#c8e6c9",
      "--color-peg": "#3a5a3a",
    },
  },
  {
    id: "ember",
    label: "Ember",
    labelTh: "เอมเบอร์",
    diskHueRange: 40,
    vars: {
      "--color-bg": "#1f0d08",
      "--color-bg-titlebar": "#140805",
      "--color-accent": "#ff6b35",
      "--color-accent-20": "rgba(255, 107, 53, 0.2)",
      "--color-accent-40": "rgba(255, 107, 53, 0.4)",
      "--color-accent-60": "rgba(255, 107, 53, 0.6)",
      "--color-accent-border": "#ff6b35",
      "--color-text": "#fff8f0",
      "--color-text-heading": "#ffe0cc",
      "--color-peg": "#6b4535",
    },
  },
];

export const defaultTheme = themes[0];
