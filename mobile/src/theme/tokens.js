// Design tokens: the single source for every colour and font in the app.
// CommonJS so tailwind.config.js can require it; typed by tokens.d.ts.
// Direction: Material Expressive — Material 3 tonal palette from a teal seed,
// large rounded shapes, Android's own Roboto.

/** Colours exposed to NativeWind class names. Names follow the app's tokens; comments give the M3 role. */
const colors = {
  // background (light); also onSurface text in dark mode via dark:text-paper.
  paper: "#F4FBF8",
  surface: { DEFAULT: "#F4FBF8", dark: "#0E1513" },
  // surfaceContainer / surfaceContainerHigh.
  raised: { DEFAULT: "#E6F0EC", dark: "#1A211F", high: "#DAE5E1", highDark: "#252B2A" },
  // onSurface / onSurfaceVariant / outline.
  ink: { DEFAULT: "#161D1B", soft: "#3F4946", faint: "#7C8784" },
  // primary, primaryContainer, onPrimaryContainer and their dark roles.
  brand: {
    DEFAULT: "#006A60",
    dark: "#00201C",
    light: "#CCE8E1",
    deep: "#005048",
    bright: "#84D5C6",
    onDeep: "#A0F2E2",
    onBright: "#003731",
  },
  accent: {
    // tertiaryContainer (FAB, highlights)
    yellow: "#F9DF8F",
    yellowLight: "#FFF1C9",
    yellowDeep: "#3F3300",
    yellowOnDeep: "#FFDF9E",
    pink: "#FFD9E2",
    pinkLight: "#FFECF0",
    violet: "#D9E2FF",
    violetLight: "#ECF0FF",
    mint: "#B7EFC5",
    mintLight: "#DDF6E3",
    blue: "#CDE5FF",
    blueLight: "#E7F2FF",
  },
  // outlineVariant
  line: { DEFAULT: "#BEC9C5", dark: "#3F4946" },
  danger: { DEFAULT: "#BA1A1A", light: "#FFDAD6", deep: "#93000A", bright: "#FFB4AB" },
  amber: { DEFAULT: "#7A5900", light: "#FFDF9E", bright: "#F5BF48" },
};

/** Android's system Roboto; weights 100–900 are built in, so nothing is bundled. */
const fonts = {
  heading: "sans-serif",
  ui: "sans-serif",
  reading: "sans-serif",
};

/** Colours for places class names cannot reach (native props, swipe actions, HTML renderer, header). */
const palettes = {
  light: {
    background: colors.paper,
    surface: colors.raised.DEFAULT,
    text: colors.ink.DEFAULT,
    textSoft: colors.ink.soft,
    textFaint: colors.ink.faint,
    line: colors.line.DEFAULT,
    shadow: "rgba(0, 0, 0, 0.18)",
    accent: colors.brand.DEFAULT,
    link: colors.brand.DEFAULT,
    highlight: colors.brand.light,
    actionOpen: colors.brand.light,
    actionArchive: colors.accent.yellow,
    actionShare: colors.accent.blue,
  },
  dark: {
    background: colors.surface.dark,
    surface: colors.raised.dark,
    text: "#DDE4E1",
    textSoft: "#BEC9C5",
    textFaint: "#899390",
    line: colors.line.dark,
    shadow: "rgba(0, 0, 0, 0.5)",
    accent: colors.brand.bright,
    link: colors.brand.bright,
    highlight: colors.brand.deep,
    actionOpen: colors.brand.deep,
    actionArchive: colors.accent.yellowDeep,
    actionShare: "#004A77",
  },
};

module.exports = { colors, fonts, palettes };
