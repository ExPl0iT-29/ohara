import { Text, useWindowDimensions } from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import { useTheme, type Theme } from "../../theme/useTheme";

interface ReaderBodyProps {
  extractedText: string | null;
}

function buildTagsStyles({ colors, fonts }: Theme) {
  return {
    // The reader is where restraint wins: a calm serif, no boxes or shadows on the text itself.
    body: { color: colors.text, fontSize: 17, lineHeight: 29, fontFamily: fonts.reading },
    p: { marginTop: 0, marginBottom: 17 },
    img: { borderRadius: 12, marginVertical: 16 },
    h1: { fontSize: 25, lineHeight: 30, fontWeight: "800", marginTop: 26, marginBottom: 10, fontFamily: fonts.heading },
    h2: { fontSize: 21, lineHeight: 26, fontWeight: "800", marginTop: 24, marginBottom: 10, fontFamily: fonts.heading },
    h3: { fontSize: 18, lineHeight: 24, fontWeight: "700", marginTop: 20, marginBottom: 8, fontFamily: fonts.heading },
    a: { color: colors.link, textDecorationLine: "underline" },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.accent,
      paddingLeft: 14,
      marginLeft: 0,
      marginVertical: 8,
      color: colors.textSoft,
      fontStyle: "italic",
    },
    li: { marginBottom: 6 },
  } as const;
}

export function ReaderBody({ extractedText }: ReaderBodyProps) {
  const { width } = useWindowDimensions();
  const theme = useTheme();
  if (!extractedText) return null;

  const isHtml = /<[a-z][\s\S]*>/i.test(extractedText);
  if (!isHtml) {
    return (
      <Text className="font-reading text-reading text-ink dark:text-paper" style={{ maxWidth: 680 }}>
        {extractedText}
      </Text>
    );
  }

  return (
    <RenderHtml
      contentWidth={Math.min(width - 40, 680)}
      source={{ html: extractedText }}
      tagsStyles={buildTagsStyles(theme)}
      // The renderer drops font families it does not know about, so register the theme's.
      systemFonts={[...defaultSystemFonts, theme.fonts.reading, theme.fonts.heading]}
    />
  );
}
