import { Text, useWindowDimensions } from "react-native";
import RenderHtml, { defaultSystemFonts } from "react-native-render-html";

import { useTheme, type Theme } from "../../theme/useTheme";

interface ReaderBodyProps {
  extractedText: string | null;
}

function buildTagsStyles({ colors, fonts }: Theme) {
  return {
    body: { color: colors.text, fontSize: 17, lineHeight: 28, letterSpacing: 0.1, fontFamily: fonts.reading },
    p: { marginTop: 0, marginBottom: 16 },
    img: { borderRadius: 20, marginVertical: 16 },
    h1: { fontSize: 26, lineHeight: 32, fontWeight: "800", marginTop: 28, marginBottom: 12, fontFamily: fonts.heading },
    h2: { fontSize: 22, lineHeight: 28, fontWeight: "700", marginTop: 24, marginBottom: 10, fontFamily: fonts.heading },
    h3: { fontSize: 18, lineHeight: 24, fontWeight: "700", marginTop: 20, marginBottom: 8, fontFamily: fonts.heading },
    a: { color: colors.link, fontWeight: "600" },
    blockquote: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 4,
      marginLeft: 0,
      marginVertical: 8,
      color: colors.textSoft,
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
