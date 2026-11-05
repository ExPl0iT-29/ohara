import { Text, useWindowDimensions } from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import { useTheme, type Theme } from "../../theme/useTheme";

interface ReaderBodyProps {
  extractedText: string | null;
}

function buildTagsStyles({ colors, fonts }: Theme) {
  return {
    body: { color: colors.text, fontSize: 18, lineHeight: 30, fontFamily: fonts.reading },
    p: { marginTop: 0, marginBottom: 18 },
    img: { borderRadius: 10, marginVertical: 18 },
    h1: { fontSize: 24, lineHeight: 31, fontWeight: "700", marginTop: 28, marginBottom: 12, fontFamily: fonts.heading },
    h2: { fontSize: 21, lineHeight: 28, fontWeight: "700", marginTop: 26, marginBottom: 10, fontFamily: fonts.heading },
    h3: { fontSize: 18, lineHeight: 26, fontWeight: "600", marginTop: 22, marginBottom: 8, fontFamily: fonts.heading },
    a: { color: colors.link, textDecorationLine: "underline" },
    blockquote: {
      borderLeftWidth: 2,
      borderLeftColor: colors.accent,
      paddingLeft: 16,
      marginLeft: 0,
      marginVertical: 8,
      color: colors.textSoft,
      fontStyle: "italic",
    },
    li: { marginBottom: 8 },
    ul: { marginBottom: 18 },
    ol: { marginBottom: 18 },
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
      contentWidth={Math.min(width - 48, 680)}
      source={{ html: extractedText }}
      tagsStyles={buildTagsStyles(theme)}
      // The renderer drops font families it does not know about, so register the theme's.
      systemFonts={[...defaultSystemFonts, theme.fonts.reading, theme.fonts.heading]}
    />
  );
}
