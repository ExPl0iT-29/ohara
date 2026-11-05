// Design tokens: the single source for every colour and font in the app.
// CommonJS so tailwind.config.js can require it; typed by tokens.d.ts.
// Direction: Refined neo-brutalism — Ohara's original identity, tightened:
// 2.5px lines, one hard shadow per level, colour that marks content type,
// Bricolage Grotesque for the interface and Literata for reading.

/** Colours exposed to NativeWind class names (bg-paper, text-ink, border-line, ...). */
const colors = {
  // Warm paper background in light mode; also main text colour in dark mode (dark:text-paper).
  paper: "#FAF3E1",
  surface: { DEFAULT: "#FAF3E1", dark: "#161412" },
  // Card and field faces.
  raised: { DEFAULT: "#FFFDF7", dark: "#221F1B" },
  ink: { DEFAULT: "#1C1917", soft: "#57534E", faint: "#A8A29E" },
  brand: { DEFAULT: "#FFC933", dark: "#E6A800", light: "#FFF3D1", deep: "#3A3016" },
  accent: {
    yellow: "#FFC933",
    yellowLight: "#FFF3D1",
    yellowDeep: "#3A3016",
    pink: "#FF5C8A",
    pinkLight: "#FFE1EA",
    pinkDeep: "#41222B",
    violet: "#8B5CF6",
    violetLight: "#EDE4FF",
    violetDeep: "#2E2547",
    mint: "#34D399",
    mintLight: "#D6F5E8",
    mintDeep: "#1A3A2D",
    blue: "#5B8DEF",
    blueLight: "#E1E9FB",
    blueDeep: "#1F2C47",
  },
  // Lines and hard shadows: ink on paper, warm off-white on the dark surface (black would vanish).
  line: { DEFAULT: "#1C1917", dark: "#E9E1CC" },
  danger: { DEFAULT: "#FF4D6D", light: "#FFE1E7", deep: "#3E1E25", bright: "#FF8FA3" },
  amber: { DEFAULT: "#B77F00", light: "#FFF3D1", bright: "#FFC933" },
};

/**
 * Font families, registered natively in MainApplication.kt from res/font/*.xml,
 * so fontWeight selects the real faces.
 */
const fonts = {
  heading: "BricolageGrotesque",
  ui: "BricolageGrotesque",
  reading: "Literata",
};

/** Colours for places class names cannot reach (native props, shadows, HTML renderer, header). */
const palettes = {
  light: {
    background: colors.paper,
    surface: colors.raised.DEFAULT,
    text: colors.ink.DEFAULT,
    textSoft: colors.ink.soft,
    textFaint: colors.ink.faint,
    line: colors.line.DEFAULT,
    shadow: colors.line.DEFAULT,
    accent: colors.brand.DEFAULT,
    link: "#3B6FD6",
    highlight: colors.brand.light,
    actionOpen: colors.accent.blue,
    actionArchive: colors.accent.yellow,
    actionShare: colors.accent.mint,
  },
  dark: {
    background: colors.surface.dark,
    surface: colors.raised.dark,
    text: "#F5EEDC",
    textSoft: "#C9C1AE",
    textFaint: "#A8A29E",
    line: colors.line.dark,
    shadow: "#4A4338",
    accent: colors.brand.DEFAULT,
    link: "#8FB4F5",
    highlight: colors.brand.deep,
    actionOpen: colors.accent.blue,
    actionArchive: colors.accent.yellow,
    actionShare: colors.accent.mint,
  },
};

module.exports = { colors, fonts, palettes };
