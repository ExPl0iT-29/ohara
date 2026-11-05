// Design tokens: the single source for every colour and font in the app.
// CommonJS so tailwind.config.js can require it; typed by tokens.d.ts.
// Direction: Quiet Shelf — calm editorial. Cool paper, deep blue-grey ink,
// one teal accent, hairline rules, a serif for reading.

/** Colours exposed to NativeWind class names (bg-paper, text-ink, border-line, ...). */
const colors = {
  // Screen background in light mode; also the main text colour in dark mode (dark:text-paper).
  paper: "#F6F7F4",
  surface: { DEFAULT: "#F6F7F4", dark: "#121616" },
  // Raised surfaces: cards, fields, sheets.
  raised: { DEFAULT: "#FFFFFF", dark: "#1A1F1F" },
  ink: { DEFAULT: "#1F2A2E", soft: "#5F6B71", faint: "#98A2A6" },
  brand: { DEFAULT: "#2F6F73", dark: "#24585B", light: "#DCEBE6", deep: "#1F3634", bright: "#7FC4C0" },
  accent: {
    yellow: "#C8A04A",
    yellowLight: "#F4EBD3",
    pink: "#B5677A",
    pinkLight: "#F3E2E6",
    violet: "#5B6C8F",
    violetLight: "#E4E8F1",
    mint: "#3D7A57",
    mintLight: "#DCEBE0",
    blue: "#3F6E9C",
    blueLight: "#E0E9F2",
  },
  line: { DEFAULT: "#E1E5E2", dark: "#2A3130" },
  danger: { DEFAULT: "#B4232F", light: "#F7E1E2", deep: "#3A1E21", bright: "#F08A93" },
  amber: { DEFAULT: "#8A5A00", light: "#F6EDD6", bright: "#E3B65C" },
};

/**
 * Font families, registered natively in MainApplication.kt from res/font/*.xml,
 * so fontWeight and italics select the real faces.
 */
const fonts = {
  heading: "Literata",
  ui: "InstrumentSans",
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
    shadow: "rgba(31, 42, 46, 0.12)",
    accent: colors.brand.DEFAULT,
    link: colors.brand.DEFAULT,
    highlight: colors.brand.light,
    actionOpen: colors.brand.DEFAULT,
    actionArchive: colors.ink.soft,
    actionShare: colors.accent.mint,
  },
  dark: {
    background: colors.surface.dark,
    surface: colors.raised.dark,
    text: "#E8ECEA",
    textSoft: "#A3ADAA",
    textFaint: "#707A77",
    line: colors.line.dark,
    shadow: "rgba(0, 0, 0, 0.4)",
    accent: colors.brand.bright,
    link: colors.brand.bright,
    highlight: colors.brand.deep,
    actionOpen: colors.brand.dark,
    actionArchive: "#4A5458",
    actionShare: "#2E5E43",
  },
};

module.exports = { colors, fonts, palettes };
