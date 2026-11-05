import { useColorScheme } from "nativewind";

import { fonts, palettes, type Palette } from "./tokens";

export interface Theme {
  scheme: "light" | "dark";
  colors: Palette;
  fonts: typeof fonts;
}

/** Current palette and fonts for values that class names cannot express. */
export function useTheme(): Theme {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  return { scheme, colors: palettes[scheme], fonts };
}
