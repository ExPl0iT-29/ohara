export interface Palette {
  background: string;
  surface: string;
  text: string;
  textSoft: string;
  textFaint: string;
  line: string;
  shadow: string;
  accent: string;
  link: string;
  highlight: string;
  actionOpen: string;
  actionArchive: string;
  actionShare: string;
}

export const colors: Record<string, string | Record<string, string>>;
export const fonts: { heading: string; ui: string; reading: string };
export const palettes: { light: Palette; dark: Palette };
