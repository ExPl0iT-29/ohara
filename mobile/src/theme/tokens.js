// Design tokens: the single source for every colour and font in the app.
// CommonJS so tailwind.config.js can require it; typed by tokens.d.ts.
// A visual direction changes this file and the primitives in src/components/ui/, not screens.

/** Colours exposed to NativeWind class names (bg-paper, text-ink, border-line, ...). */
const colors = {
  paper: "#FAF3E1",
  surface: { DEFAULT: "#FAF3E1", dark: "#161412" },
  ink: { DEFAULT: "#1C1917", soft: "#57534E", faint: "#A8A29E" },
  brand: { DEFAULT: "#FFC933", dark: "#E6A800", light: "#FFF3D1" },
  accent: {
    yellow: "#FFC933",
    yellowLight: "#FFF3D1",
    pink: "#FF5C8A",
    pinkLight: "#FFE1EA",
    violet: "#8B5CF6",
    violetLight: "#EDE4FF",
    mint: "#34D399",
    mintLight: "#D6F5E8",
    blue: "#5B8DEF",
    blueLight: "#E1E9FB",
  },
  line: "#1C1917",
  danger: { DEFAULT: "#FF4D6D", light: "#FFE1E7" },
  amber: { DEFAULT: "#E6A800", light: "#FFF3D1" },
};

/**
 * Font families. Android resolves a family name to assets/fonts/<name>.ttf, and
 * <name>_bold.ttf / <name>_italic.ttf for weight >= 600 and italics.
 * "sans-serif" is the platform default (Roboto).
 */
const fonts = {
  heading: "sans-serif",
  ui: "sans-serif",
  reading: "sans-serif",
};

/** Colours for places class names cannot reach (native props, shadows, HTML renderer, header). */
const palettes = {
  light: {
    background: colors.paper,
    surface: colors.paper,
    text: colors.ink.DEFAULT,
    textSoft: colors.ink.soft,
    textFaint: colors.ink.faint,
    line: colors.line,
    shadow: colors.ink.DEFAULT,
    accent: colors.brand.DEFAULT,
    link: "#3B6FD6",
    highlight: colors.brand.light,
    actionOpen: colors.accent.blue,
    actionArchive: colors.accent.yellow,
    actionShare: colors.accent.mint,
  },
  dark: {
    background: colors.surface.dark,
    surface: colors.surface.dark,
    text: "#FAF9F6",
    textSoft: colors.ink.faint,
    textFaint: colors.ink.faint,
    line: colors.line,
    shadow: colors.ink.DEFAULT,
    accent: colors.brand.DEFAULT,
    link: "#8FB4F5",
    highlight: colors.brand.light,
    actionOpen: colors.accent.blue,
    actionArchive: colors.accent.yellow,
    actionShare: colors.accent.mint,
  },
};

module.exports = { colors, fonts, palettes };
